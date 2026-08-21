export interface ChatMessage {
  id?: number | string;
  content: string;
  message?: string;
  senderEmail?: string;
  senderName?: string;
  role?: 'user' | 'assistant' | string;
  messageType?: 'USER' | 'AI' | 'ASSISTANT' | string;
  createdAt?: string;
}

export type WebSocketMessageType = 'CHUNK' | 'DONE' | 'CHAT' | 'ERROR' | 'TYPING';

export interface WebSocketMessagePayload {
  type: WebSocketMessageType;
  id?: number | string;
  content?: string;
  message?: string;
  senderEmail?: string;
  senderName?: string;
  role?: string;
  messageType?: string;
  createdAt?: string;
}
