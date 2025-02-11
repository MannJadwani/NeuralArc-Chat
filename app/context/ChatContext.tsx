'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Message, Model } from '@/app/types';
import { generateGeminiChatResponse, generateGeminiCodeResponse } from '@/app/services/gemini';
import { parseMarkdownCodeBlocks } from '@/app/utils/markdown';

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isLoading: boolean;
  currentModel: Model;
  setCurrentModel: (model: Model) => void;
  streamingMessage: string;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  savedChats: { id: string; title: string; messages: Message[]; timestamp: number }[];
}

const STORAGE_KEY = 'neuralarc-chats';
const CURRENT_CHAT_KEY = 'neuralarc-current-chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model>({
    id: 'gemini-flash-2.0',
    name: 'Gemini Flash 2.0',
    description: "Google's most capable model for text, code, and analysis",
    isAvailable: true
  });
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedChats, setSavedChats] = useState<{ id: string; title: string; messages: Message[]; timestamp: number }[]>([]);

  // Load saved chats from local storage
  useEffect(() => {
    const savedChatsData = localStorage.getItem(STORAGE_KEY);
    if (savedChatsData) {
      setSavedChats(JSON.parse(savedChatsData));
    }

    // Load current chat if exists
    const currentChatId = localStorage.getItem(CURRENT_CHAT_KEY);
    if (currentChatId) {
      const savedChats = JSON.parse(savedChatsData || '[]');
      const currentChat = savedChats.find((chat: any) => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      }
    }
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedChats));
  }, [savedChats]);

  // Save current chat whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const chatId = Date.now().toString();
      const title = messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '');
      
      setSavedChats(prev => {
        const existingChatIndex = prev.findIndex(chat => 
          JSON.stringify(chat.messages) === JSON.stringify(messages)
        );

        if (existingChatIndex !== -1) {
          // Update existing chat
          const updatedChats = [...prev];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            messages,
            timestamp: Date.now()
          };
          return updatedChats;
        } else {
          // Create new chat
          const newChat = {
            id: chatId,
            title,
            messages,
            timestamp: Date.now()
          };
          localStorage.setItem(CURRENT_CHAT_KEY, chatId);
          return [...prev, newChat];
        }
      });
    }
  }, [messages]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
    setError(null);
    localStorage.removeItem(CURRENT_CHAT_KEY);
  }, []);

  const loadChat = useCallback((chatId: string) => {
    const chat = savedChats.find(chat => chat.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      localStorage.setItem(CURRENT_CHAT_KEY, chatId);
    }
  }, [savedChats]);

  const deleteChat = useCallback((chatId: string) => {
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
    if (localStorage.getItem(CURRENT_CHAT_KEY) === chatId) {
      localStorage.removeItem(CURRENT_CHAT_KEY);
      setMessages([]);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      model: currentModel.id
    };
    addMessage(userMessage);

    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to Gemini format with proper typing
      const chatHistory: { role: 'user' | 'assistant'; content: string }[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Add the new message
      chatHistory.push({
        role: 'user',
        content
      });

      // Determine if this is a code-related query
      const isCodeQuery = content.toLowerCase().includes('code') ||
        content.toLowerCase().includes('function') ||
        content.toLowerCase().includes('programming') ||
        messages.some(msg => msg.codeBlocks?.length);

      // Get the response
      const response = isCodeQuery
        ? await generateGeminiCodeResponse(content, {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }, setStreamingMessage)
        : await generateGeminiChatResponse(chatHistory, {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }, setStreamingMessage);

      // Parse code blocks if present
      const codeBlocks = parseMarkdownCodeBlocks(response);

      // Create AI message
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: Date.now(),
        model: currentModel.id,
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined
      };

      addMessage(aiMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your message');
      console.error('Chat Error:', err);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  }, [messages, currentModel, addMessage]);

  const value = {
    messages,
    addMessage,
    clearMessages,
    isLoading,
    currentModel,
    setCurrentModel,
    streamingMessage,
    error,
    sendMessage,
    loadChat,
    deleteChat,
    savedChats
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 