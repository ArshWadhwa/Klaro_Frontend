'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Loader2, FileText, Sparkles, User, Bot, Download, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { documentsApi } from '@/lib/api/documents.api';
import { useAuthStore } from '@/lib/stores/authStore';
import { useSidebarStore } from '@/lib/stores/sidebarStore';
import toast from 'react-hot-toast';

export default function DocumentChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = Number(params.id);
  const { user } = useAuthStore(); // Get current user
  const { isCollapsed, toggleSidebar, expandSidebar } = useSidebarStore();
  
  const [document, setDocument] = useState<any>(null);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDoc, setIsFetchingDoc] = useState(true);
  const [isAiMode, setIsAiMode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Current user's email for identifying own messages
  const currentUserEmail = user?.email || '';

  useEffect(() => {
    fetchAllDocuments();
    fetchChatHistory();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchChatHistory();
    }, 3000);
    
    return () => {
      clearInterval(interval);
      // Restore sidebar when leaving the chat page
      expandSidebar();
    };
  }, [documentId]);

  const fetchAllDocuments = async () => {
    try {
      const currentDoc = await documentsApi.getDocumentById(documentId);

      const data = await documentsApi.getProjectDocuments(currentDoc.projectId);
      // Fetch all documents user has access to
      // const data = await documentsApi.getUserDocuments();
      console.log('📄 Fetched documents:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setAllDocuments(data);
        // Find current document from the list
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

  const fetchChatHistory = async () => {
    try {
      const history = await documentsApi.getChatHistory(documentId);
      setMessages(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // ONLY activate AI mode when user types exactly "AI " (AI + space) at the beginning
    // and AI mode is NOT already active
    if (!isAiMode && value.toLowerCase() === 'ai ') {
      setIsAiMode(true);
      setInputMessage(''); // Clear the "AI " text, user will type their question
      return;
    }
    
    // If user clears input while in AI mode, exit AI mode
    if (isAiMode && value === '') {
      setIsAiMode(false);
    }
    
    // Normal input update
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
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    const wasAiMode = isAiMode; // Save AI mode state before clearing
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to backend with aiMode flag
      await documentsApi.chatWithDocument(documentId, messageToSend, wasAiMode);
      
      // Refresh chat history to get the saved messages
      await fetchChatHistory();
      
      if (wasAiMode) {
        setIsAiMode(false);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setInputMessage(messageToSend); // Restore message on error
    } finally {
      setIsLoading(false);
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
    <div className="flex h-[calc(100vh-120px)] gap-0 -mx-6 -my-6">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-[45px] left-2 z-50 p-2 bg-[#131316] border border-[#1f1f23] rounded-lg hover:bg-[#1a1a1d] transition-colors group"
        title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
        ) : (
          <PanelLeftClose className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Left Sidebar - Documents List */}
      <div className="w-80 bg-[#0d0d0f] border-r border-[#1f1f23] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1f1f23]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Documents</h2>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload documents from project pages
          </p>
        </div>

        {/* Documents List */}
     <div
  ref={chatContainerRef}
  className="flex-1 overflow-y-auto px-8 py-6 space-y-4"
>
          {allDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/documents/${doc.id}/chat`)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                doc.id === documentId
                  ? 'bg-[#2a3f5f] border-2 border-blue-500'
                  : 'bg-[#3a4a5f] border-2 border-transparent hover:border-[#4a5a6f]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm truncate flex-1">
                  {doc.fileName}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc.id, doc.fileName);
                    }}
                    className="p-1.5 hover:bg-[#4a5a6f] rounded transition-colors"
                  >
                    <Download className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.id);
                    }}
                    className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
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
      <div className="flex-1 flex flex-col bg-[#0d0d0f]">
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-[#1f1f23]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-2">
                Document Chat
              </h1>
              {document && (
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">{document.fileName}</span>
                  {document.projectName && (
                    <span className="text-gray-500"> • {document.projectName}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start collaborating
                </h3>
                <p className="text-gray-400 mb-6">
                  Discuss this document with your team or ask AI for insights
                </p>
                <div className="bg-[#131316] border border-[#1f1f23] rounded-xl p-4 text-left">
                  <p className="text-sm text-gray-300 mb-2">💡 <strong>Tip:</strong> Activate AI mode</p>
                  <p className="text-xs text-gray-500">
                    Type <code className="px-2 py-1 bg-[#1f1f23] rounded text-blue-400">AI</code> followed by a space to chat with AI about the document
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              // Determine message type
              const isAiMessage = message.messageType === 'AI' || 
                                 message.role === 'assistant' || 
                                 message.senderName === 'AI' ||
                                 message.messageType === 'ASSISTANT';
              
              // Get sender info from message
              const senderEmail = message.senderEmail || message.email || message.userEmail || '';
              const senderName = message.senderName || 
                               message.userName || 
                               message.sender || 
                               (senderEmail ? senderEmail.split('@')[0] : 'User');
              
              // Get current user email
              const myEmail = user?.email || currentUserEmail || '';
              
              // Check if this is current user's message
              const isOwnMessage = !isAiMessage && 
                                  senderEmail !== '' && 
                                  myEmail !== '' &&
                                  senderEmail.toLowerCase().trim() === myEmail.toLowerCase().trim();
              
              // Check if we need to show the name
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const prevSenderEmail = (prevMessage?.senderEmail || prevMessage?.email || '');
              const prevIsAi = prevMessage ? (
                prevMessage.messageType === 'AI' || 
                prevMessage.role === 'assistant' ||
                prevMessage.messageType === 'ASSISTANT'
              ) : false;
              
              const showName = index === 0 || 
                              prevSenderEmail.toLowerCase() !== senderEmail.toLowerCase() || 
                              prevIsAi !== isAiMessage;
              
              return (
                <div 
                  key={message.id || index} 
                  className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  {/* Show sender name for others and AI */}
                  {showName && !isOwnMessage && (
                    <div className="flex items-center gap-2 mb-1">
                      {isAiMessage ? (
                        <>
                          <div className="h-5 w-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-purple-400">AI Assistant</span>
                        </>
                      ) : (
                        <>
                          <div className="h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-emerald-400">{senderName}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Show "You" label for own messages */}
                  {showName && isOwnMessage && (
                    <span className="text-xs font-medium text-blue-400 mb-1 mr-1">You</span>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      isAiMessage
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 rounded-tl-sm'
                        : isOwnMessage
                          ? 'bg-blue-600 rounded-br-sm'
                          : 'bg-[#2a2a2f] rounded-bl-sm'
                    }`}
                  >
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message || message.content}
                    </p>
                    <p className={`text-[10px] mt-1 ${
                      isAiMessage ? 'text-purple-300' : 
                      isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          
          {isLoading && (
            <div className={`flex flex-col ${isAiMode ? 'items-start' : 'items-end'}`}>
              {isAiMode ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-400">AI is thinking...</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-medium text-blue-400 mb-1 mr-1">Sending...</span>
                  <div className="bg-blue-600 rounded-2xl rounded-br-sm px-4 py-2.5">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                </>
              )}
            </div>
          )}
          
        </div>

        {/* Input Area */}
        <div className="border-t border-[#1f1f23] px-8 py-6">
          {isAiMode && (
            <div className="mb-4 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-blue-500/50 rounded-xl flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">AI Mode Activated</p>
                <p className="text-xs text-gray-400">Ask AI anything about this document</p>
              </div>
              <button
                onClick={() => {
                  setIsAiMode(false);
                  setInputMessage('');
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder={isAiMode ? "Ask AI about the document..." : "Type 'AI ' to activate AI mode or chat with team..."}
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-[#131316] border border-[#1f1f23] text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`px-8 py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                isAiMode
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isAiMode ? (
                <>
                  <Sparkles className="h-5 w-5" />
                  Ask AI
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
