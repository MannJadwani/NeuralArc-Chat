"use client"

import { useState } from "react";
import { Message, SuggestedPrompt, availableModels } from "./types";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { ChatMessage } from "./components/chat/ChatMessage";
import { ChatInput } from "./components/chat/ChatInput";
import { Welcome } from "./components/chat/Welcome";
import { useRouter } from 'next/navigation';
import { useChat } from './context/ChatContext';

const demoChats = {
  codeDemo: {
    title: "Code Review Example",
    messages: [
      {
        id: "1",
        content: "Can you help me understand this React code?",
        sender: "user" as const,
        timestamp: Date.now() - 5000,
        model: "gpt-4"
      },
      {
        id: "2",
        content: "I'll help you understand this React component. Let's break it down:",
        sender: "ai" as const,
        timestamp: Date.now() - 4000,
        model: "gpt-4",
        codeBlocks: [
          {
            language: "typescript",
            filename: "Counter.tsx",
            code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4">
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
    </div>
  );
}`
          }
        ]
      }
    ]
  },
  chaptersDemo: {
    title: "Learning React Hooks",
    messages: [
      {
        id: "1",
        content: "Can you teach me about React hooks?",
        sender: "user" as const,
        timestamp: Date.now() - 3000,
        model: "gpt-4"
      },
      {
        id: "2",
        content: "I'll guide you through React hooks with a structured learning path:",
        sender: "ai" as const,
        timestamp: Date.now() - 2000,
        model: "gpt-4",
        chapters: [
          {
            title: "1. Introduction to Hooks",
            content: "Hooks are functions that allow you to 'hook into' React state and lifecycle features from function components. They were introduced in React 16.8 to allow you to use state and other React features without writing a class component."
          },
          {
            title: "2. useState Hook",
            content: "The useState hook lets you add state to functional components. It returns an array with two elements: the current state value and a function to update it."
          },
          {
            title: "3. useEffect Hook",
            content: "useEffect lets you perform side effects in function components. It serves a similar purpose to componentDidMount, componentDidUpdate, and componentWillUnmount in React classes."
          }
        ]
      }
    ]
  }
};

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: '1',
    title: '💻 Code Review',
    description: 'Get feedback on your code',
    prompt: 'Can you review my code and suggest improvements?'
  },
  {
    id: '2',
    title: '🐛 Debug Help',
    description: 'Find and fix issues',
    prompt: 'I need help debugging this error in my code:'
  },
  {
    id: '3',
    title: '📚 Learn Concepts',
    description: 'Understand programming concepts',
    prompt: 'Can you explain how async/await works in JavaScript?'
  },
  {
    id: '4',
    title: '🚀 Project Ideas',
    description: 'Get inspiration for coding projects',
    prompt: 'Suggest some project ideas to help me learn React.'
  }
];

export default function Home() {
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const {
    messages,
    addMessage,
    clearMessages,
    isLoading,
    currentModel,
    setCurrentModel,
    error,
    sendMessage,
    streamingMessage
  } = useChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const startNewChat = () => {
    clearMessages();
    setIsSidebarOpen(false);
  };

  const loadDemoChat = (chatKey: keyof typeof demoChats) => {
    clearMessages();
    demoChats[chatKey].messages.forEach(message => addMessage(message));
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    router.push('/auth');
  };

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar
        onNewChat={startNewChat}
        isSidebarOpen={isSidebarOpen}
        onLoadDemo={loadDemoChat}
        demoChats={demoChats}
      />

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedModel={currentModel.id}
          onModelChange={handleModelChange}
          isAuthenticated={isAuthenticated}
          user={user || undefined}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <Welcome
                suggestedPrompts={suggestedPrompts}
                onSelectPrompt={setInputMessage}
              />
            ) : (
              <>
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {streamingMessage && (
                  <ChatMessage
                    message={{
                      id: 'streaming',
                      content: streamingMessage,
                      sender: 'ai',
                      timestamp: Date.now(),
                      model: currentModel.id
                    }}
                  />
                )}
              </>
            )}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                {error}
              </div>
            )}
            {isLoading && !streamingMessage && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </div>
        </main>

        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
