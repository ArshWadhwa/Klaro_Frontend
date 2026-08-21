'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Send,
  Loader2,
  FileText,
  Sparkles,
  User,
  Bot,
  Download,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';
import { documentsApi } from '@/lib/api/documents.api';
import { useAuthStore } from '@/lib/stores/authStore';
import { useSidebarStore } from '@/lib/stores/sidebarStore';
import { MessageContent } from '@/components/chat/MessageContent';
import { useDocumentChat } from '@/hooks/useDocumentChat';
import toast from 'react-hot-toast';

export default function DocumentChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = Number(params.id);
  const { user } = useAuthStore();
  const { isCollapsed, toggleSidebar, expandSidebar } = useSidebarStore();

  const [document, setDocument] = useState<any>(null);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDoc, setIsFetchingDoc] = useState(true);
  const [showDocsMobile, setShowDocsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket STOMP hook
  const {
    messages,
    sendMessage,
    isAiThinking,
    isStreaming,
    streamingChunk,
    isConnected,
    isConnecting,
  } = useDocumentChat(documentId);

  // Current user's email for identifying own messages
  const currentUserEmail = user?.email || '';

  // Auto-scroll to bottom on new messages or during AI thinking / streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingChunk, isStreaming, isAiThinking]);

  useEffect(() => {
    fetchAllDocuments();

    return () => {
      // Restore sidebar when leaving the chat page
      expandSidebar();
    };
  }, [documentId]);

  const fetchAllDocuments = async () => {
    try {
      const currentDoc = await documentsApi.getDocumentById(documentId);

      const data = await documentsApi.getProjectDocuments(currentDoc.projectId);
      console.log('📄 Fetched documents:', data);

      if (Array.isArray(data) && data.length > 0) {
        setAllDocuments(data);
        const doc = data.find((d: any) => d.id === documentId);
        if (doc) {
          setDocument(doc);
        }
      } else {
        setAllDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setAllDocuments([]);
    } finally {
      setIsFetchingDoc(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // ONLY activate AI mode when user types "AI " at the beginning and AI mode is not active
    if (!isAiMode && (value === 'AI ' || value === 'ai ')) {
      setIsAiMode(true);
      setInputMessage('');
      return;
    }

    setInputMessage(value);
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentsApi.deleteDocument(docId);
      toast.success('Document deleted');
      fetchAllDocuments();
      if (docId === documentId) {
        router.push('/documents');
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (docId: number, fileName: string) => {
    try {
      const blob = await documentsApi.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document downloaded');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    let messageToSend = inputMessage.trim();
    let wasAiMode = isAiMode;

    // Detect if user typed `/ai ` or `ai: ` directly in message
    if (messageToSend.toLowerCase().startsWith('/ai ')) {
      wasAiMode = true;
      messageToSend = messageToSend.slice(4).trim();
    } else if (messageToSend.toLowerCase().startsWith('ai: ')) {
      wasAiMode = true;
      messageToSend = messageToSend.slice(4).trim();
    }

    setInputMessage('');

    try {
      setIsSubmitting(true);
      console.log(`🚀 Sending message with AI mode: ${wasAiMode}`, { message: messageToSend });
      sendMessage(messageToSend, wasAiMode);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setInputMessage(messageToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0f]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 -mx-6 -my-6 relative overflow-hidden">
      {/* Backdrop for Mobile Documents Sidebar */}
      {showDocsMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
          onClick={() => setShowDocsMobile(false)}
        />
      )}

      {/* Left Sidebar - Documents List */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0f] border-r border-[#1f1f23] flex flex-col transition-transform duration-300 transform md:translate-x-0 md:relative md:w-80 md:flex ${showDocsMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1f1f23] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Documents</h2>
            <p className="text-xs text-gray-500 mt-2">
              Upload documents from project pages
            </p>
          </div>
          <button
            onClick={() => setShowDocsMobile(false)}
            className="md:hidden p-2 hover:bg-[#1a1a1d] rounded-lg text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 space-y-3">
          {allDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                router.push(`/documents/${doc.id}/chat`);
                setShowDocsMobile(false);
              }}
              className={`p-3.5 rounded-xl cursor-pointer transition-all ${doc.id === documentId
                ? 'bg-[#2a3f5f] border-2 border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-[#18181c] border border-[#2a2a2f] hover:border-[#3a3a42] hover:bg-[#202026]'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-medium text-white text-sm truncate flex-1">
                  {doc.fileName}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc.id, doc.fileName);
                    }}
                    title="Download document"
                    className="p-1.5 hover:bg-[#2e2e36] rounded transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.id);
                    }}
                    title="Delete document"
                    className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ))}

          {allDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No documents yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#0d0d0f] min-w-0">
        {/* Chat Header */}
        <div className="px-4 py-4 md:px-8 md:py-5 border-b border-[#1f1f23] bg-[#0d0d0f]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              {/* Main Sidebar Toggle Button (Desktop Only) */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex mr-4 p-2 bg-[#131316] border border-[#1f1f23] rounded-lg hover:bg-[#1a1a1d] text-gray-400 hover:text-white transition-colors items-center shrink-0"
                title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>

              {/* Documents toggle for mobile */}
              <button
                onClick={() => setShowDocsMobile(true)}
                className="md:hidden mr-3 p-2 bg-[#131316] border border-[#1f1f23] rounded-lg hover:bg-[#1a1a1d] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Menu className="h-4 w-4" />
                <span className="text-xs font-semibold">Docs</span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg md:text-xl font-bold text-white truncate">
                    Document Chat
                  </h1>

                  {/* STOMP WebSocket Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isConnected
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                      : isConnecting
                        ? 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                        : 'bg-red-950/40 text-red-400 border-red-800/60'
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isConnected
                        ? 'bg-emerald-400 animate-pulse'
                        : isConnecting
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-red-400'
                        }`}
                    />
                    <span>
                      {isConnected
                        ? 'Live'
                        : isConnecting
                          ? 'Connecting...'
                          : 'Reconnecting...'}
                    </span>
                  </div>
                </div>

                {document && (
                  <p className="text-xs md:text-sm text-gray-400 truncate mt-1">
                    <span className="text-white font-medium">{document.fileName}</span>
                    {document.projectName && (
                      <span className="text-gray-500"> • {document.projectName}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 space-y-4">
          {messages.length === 0 && !isStreaming ? (
            <div className="text-center py-12 md:py-20">
              <div className="max-w-md mx-auto px-4">
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                  Start collaborating
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Discuss this document with your team or ask AI for insights in real-time
                </p>
                <div className="bg-[#131316] border border-[#1f1f23] rounded-xl p-4 text-left">
                  <p className="text-sm text-gray-300 mb-2">
                    💡 <strong>Tip:</strong> Activate AI mode
                  </p>
                  <p className="text-xs text-gray-500">
                    Click the <span className="text-blue-400 font-semibold">AI Mode</span> button or type{' '}
                    <code className="px-2 py-1 bg-[#1f1f23] rounded text-blue-400">
                      AI
                    </code>{' '}
                    followed by a space to ask questions
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              // Determine message type
              const isAiMessage =
                message.messageType === 'AI' ||
                message.role === 'assistant' ||
                message.senderName === 'AI Assistant' ||
                message.senderName === 'AI' ||
                message.messageType === 'ASSISTANT';

              // Get sender info from message
              const senderEmail =
                message.senderEmail || (message as any).email || (message as any).userEmail || '';
              const senderName =
                message.senderName ||
                (message as any).userName ||
                (message as any).sender ||
                (senderEmail ? senderEmail.split('@')[0] : 'User');

              // Get current user email
              const myEmail = user?.email || currentUserEmail || '';

              // Check if this is current user's message
              const isOwnMessage =
                !isAiMessage &&
                senderEmail !== '' &&
                myEmail !== '' &&
                senderEmail.toLowerCase().trim() === myEmail.toLowerCase().trim();

              // Check if we need to show the name
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const prevSenderEmail =
                prevMessage?.senderEmail || (prevMessage as any)?.email || '';
              const prevIsAi = prevMessage
                ? prevMessage.messageType === 'AI' ||
                prevMessage.role === 'assistant' ||
                prevMessage.messageType === 'ASSISTANT'
                : false;

              const showName =
                index === 0 ||
                prevSenderEmail.toLowerCase() !== senderEmail.toLowerCase() ||
                prevIsAi !== isAiMessage;

              return (
                <div
                  key={message.id || index}
                  className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  {/* Show sender name for others and AI */}
                  {showName && !isOwnMessage && (
                    <div className="flex items-center gap-2 mb-2">
                      {isAiMessage ? (
                        <>
                          <div className="h-5 w-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-300">
                            AI Assistant
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-300">
                            {senderName}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Show "You" label for own messages */}
                  {showName && isOwnMessage && (
                    <span className="text-xs font-semibold text-blue-300 mb-2 mr-1 block">
                      You
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-4 py-3 ${isAiMessage
                      ? 'bg-[#1a1a1f] border border-[#2a2a2f] rounded-tl-none max-w-[90%] md:max-w-[85%]'
                      : isOwnMessage
                        ? 'bg-blue-600 rounded-br-none max-w-[85%] md:max-w-[70%]'
                        : 'bg-[#1a1a1f] border border-[#2a2a2f] rounded-bl-none max-w-[85%] md:max-w-[70%]'
                      }`}
                  >
                    <div className="text-white text-sm leading-relaxed">
                      <MessageContent content={message.message || message.content} />
                    </div>
                    <p
                      className={`text-[10px] mt-2 ${isAiMessage
                        ? 'text-gray-500'
                        : isOwnMessage
                          ? 'text-blue-200'
                          : 'text-gray-500'
                        }`}
                    >
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* AI Thinking & Vector Search Indicator */}
          {isAiThinking && !isStreaming && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-300">AI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium animate-pulse border border-indigo-500/30">
                  Searching document & thinking...
                </span>
              </div>
              <div className="rounded-lg px-4 py-3 bg-[#16161b] border border-indigo-500/30 rounded-tl-none flex items-center gap-3 shadow-lg shadow-indigo-500/5">
                {/* <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> */}
                <span className="text-xs text-gray-300 font-medium">Klaro AI is searching document & thinking...</span>
                <span className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          {/* Live Typing & Token Streaming Bubble */}
          {isStreaming && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-300">AI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium animate-pulse border border-blue-500/30">
                  Streaming response...
                </span>
              </div>
              <div className="rounded-lg px-4 py-3 bg-[#1a1a1f] border border-blue-500/40 rounded-tl-none max-w-[90%] md:max-w-[85%] shadow-lg shadow-blue-500/5">
                {streamingChunk ? (
                  <div className="text-white text-sm leading-relaxed">
                    <MessageContent content={streamingChunk} />
                    <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1f1f23] px-4 py-4 md:px-8 md:py-6 bg-[#0d0d0f]">
          {isAiMode && (
            <div className="mb-4 px-4 py-3 bg-[#1a1a1f] border border-blue-500/50 rounded-lg flex items-center gap-3 animate-fade-in">
              {/* <Sparkles className="h-5 w-5 text-blue-400 shrink-0" /> */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">AI Mode Active</p>
                <p className="text-xs text-gray-400">
                  Your question will query this document with RAG and stream the AI answer live
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAiMode(false)}
                className="text-xs text-gray-400 hover:text-white transition-colors font-medium px-2 py-1 hover:bg-[#2a2a2f] rounded"
              >
                Disable AI Mode
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={
                isAiMode
                  ? 'Ask AI about the document...'
                  : "Type 'AI ' or click AI Mode to ask questions..."
              }
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 md:px-6 bg-[#131316] border border-[#2a2a2f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder:text-gray-500 text-sm transition-all"
            />

            {/* Quick AI Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsAiMode((prev) => !prev)}
              title={isAiMode ? 'Disable AI Mode' : 'Enable AI Mode'}
              className={`px-3 py-3 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 ${isAiMode
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#131316] border-[#2a2a2f] text-gray-400 hover:text-white hover:border-[#3a3a42]'
                }`}
            >
              <Sparkles className={`h-4 w-4 ${isAiMode ? 'text-white' : 'text-blue-400'}`} />
              <span className="hidden sm:inline">AI Mode: {isAiMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !inputMessage.trim()}
              className="px-4 py-3 md:px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAiMode ? (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Ask AI</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
