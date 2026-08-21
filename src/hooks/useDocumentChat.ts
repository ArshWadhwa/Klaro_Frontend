import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage, StompHeaders } from "@stomp/stompjs";
import { useAuthStore } from "@/lib/stores/authStore";
import { STORAGE_KEYS } from "@/config/constants";
import { ChatMessage, WebSocketMessagePayload } from "@/types/chat.types";
import toast from "react-hot-toast";

export function useDocumentChat(
  documentId?: number | string | null,
  jwtToken?: string | null,
  backendBaseUrl?: string
) {
  const storeToken = useAuthStore((state) => state.accessToken);
  const effectiveToken =
    jwtToken ||
    storeToken ||
    (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null);

  const effectiveBaseUrl = (
    backendBaseUrl ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.protocol === "https:"
      ? "https://klaro-4f3b.onrender.com"
      : "http://localhost:8081")
  ).trim();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingChunk, setStreamingChunk] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const stompClientRef = useRef<Client | null>(null);

  // 1. Fetch initial chat history from REST endpoint
  const fetchChatHistory = useCallback(async () => {
    if (!documentId || !effectiveToken) return;

    try {
      const response = await fetch(`${effectiveBaseUrl}/documents/${documentId}/chat/history`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const history: any[] = await response.json();
        if (Array.isArray(history)) {
          const normalized: ChatMessage[] = history.map((msg: any) => ({
            id: msg.id,
            content: msg.content || msg.message || "",
            message: msg.message || msg.content || "",
            senderEmail: msg.senderEmail || msg.email || msg.userEmail || "",
            senderName:
              msg.senderName ||
              msg.userName ||
              (msg.senderEmail ? msg.senderEmail.split("@")[0] : "User"),
            role: msg.role || (msg.messageType === "AI" ? "assistant" : "user"),
            messageType: msg.messageType || (msg.role === "assistant" ? "AI" : "USER"),
            createdAt: msg.createdAt,
          }));
          setMessages(normalized);
        }
      } else {
        console.error("Failed to load chat history, status:", response.status);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, [documentId, effectiveToken, effectiveBaseUrl]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // 2. Establish STOMP WebSocket Connection
  useEffect(() => {
    if (!documentId || !effectiveToken || typeof window === "undefined") {
      return;
    }

    setIsConnecting(true);

    const headers: StompHeaders = {
      Authorization: `Bearer ${effectiveToken}`,
    };

    // Native WebSocket: convert https:// → wss:// and http:// → ws://
    const wsProtocol = effectiveBaseUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = effectiveBaseUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const brokerURL = `${wsProtocol}://${wsHost}/ws-native`;

    const client = new Client({
      brokerURL: brokerURL,
      connectHeaders: headers,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log(`🟢 Connected to STOMP room: /topic/document.${documentId}`);

        // Subscribe to document room topic
        client.subscribe(`/topic/document.${documentId}`, (message: IMessage) => {
          try {
            if (!message.body) return;
            const payload: WebSocketMessagePayload = JSON.parse(message.body);
            console.log(`📥 [STOMP Received] /topic/document.${documentId}:`, payload);

            const msgContent = payload.content || payload.message || "";
            const msgType = (payload.type || "").toUpperCase();

            if (msgType === "TYPING") {
              // Server started RAG search & LLM generation
              setIsAiThinking(true);
            } else if (msgType === "CHUNK") {
              // Live AI token streaming chunk arrived -> switch thinking to streaming
              setIsAiThinking(false);
              setIsStreaming(true);
              setStreamingChunk((prev) => prev + msgContent);
            } else if (msgType === "DONE") {
              // Stream complete - finalize AI message
              setIsAiThinking(false);
              setIsStreaming(false);
              setStreamingChunk("");

              const aiMessage: ChatMessage = {
                id: payload.id || `ai-${Date.now()}`,
                content: msgContent,
                message: msgContent,
                senderEmail: payload.senderEmail || "ai@system",
                senderName: payload.senderName || "AI Assistant",
                role: payload.role || "assistant",
                messageType: payload.messageType || "AI",
                createdAt: payload.createdAt || new Date().toISOString(),
              };

              setMessages((prev) => {
                // If message already exists by ID, replace it; otherwise append
                if (aiMessage.id && prev.some((m) => m.id === aiMessage.id)) {
                  return prev.map((m) => (m.id === aiMessage.id ? aiMessage : m));
                }
                return [...prev, aiMessage];
              });
            } else if (msgType === "CHAT") {
              // New user or peer message broadcast
              const chatMsg: ChatMessage = {
                id: payload.id || `chat-${Date.now()}`,
                content: msgContent,
                message: msgContent,
                senderEmail: payload.senderEmail || "",
                senderName:
                  payload.senderName ||
                  (payload.senderEmail ? payload.senderEmail.split("@")[0] : "User"),
                role: payload.role || (payload.messageType === "AI" ? "assistant" : "user"),
                messageType: payload.messageType || (payload.role === "assistant" ? "AI" : "USER"),
                createdAt: payload.createdAt || new Date().toISOString(),
              };

              setMessages((prev) => {
                if (chatMsg.id && prev.some((m) => m.id === chatMsg.id)) {
                  return prev;
                }
                return [...prev, chatMsg];
              });
            } else if (msgType === "ERROR") {
              setIsAiThinking(false);
              setIsStreaming(false);
              setStreamingChunk("");
              toast.error(msgContent || "An error occurred during chat processing");
            }
          } catch (e) {
            console.error("Error parsing STOMP message frame:", e);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsAiThinking(false);
        console.log(`🔴 Disconnected from STOMP room: /topic/document.${documentId}`);
      },
      onStompError: (frame) => {
        setIsConnecting(false);
        setIsAiThinking(false);
        console.error("STOMP Error:", frame.headers?.["message"], frame.body);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsAiThinking(false);
      },
      onWebSocketError: (err) => {
        console.error("WebSocket Error:", err);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [documentId, effectiveToken, effectiveBaseUrl]);

  // 3. Send message helper (Optimistically sets isAiThinking when AI mode is active)
  const sendMessage = useCallback(
    (text: string, isAiMode: boolean = false) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (!stompClientRef.current || !stompClientRef.current.connected) {
        console.error("WebSocket not connected");
        toast.error("Chat connection not active. Reconnecting...");
        return;
      }

      if (isAiMode) {
        setIsAiThinking(true);
      }

      const payload = {
        message: trimmed,
        aiMode: Boolean(isAiMode),
      };

      console.log(`📤 [STOMP Publish] /app/chat.send/${documentId}:`, payload);

      stompClientRef.current.publish({
        destination: `/app/chat.send/${documentId}`,
        body: JSON.stringify(payload),
      });
    },
    [documentId]
  );

  return {
    messages,
    sendMessage,
    isAiThinking,
    isStreaming,
    streamingChunk,
    isConnected,
    isConnecting,
    reloadHistory: fetchChatHistory,
  };
}
