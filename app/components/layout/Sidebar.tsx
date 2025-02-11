import { SavedChat, Message } from '@/app/types';
import { useState } from 'react';
import { DragHandle } from '../ui/DragHandle';

interface SidebarProps {
  onNewChat: () => void;
  isSidebarOpen: boolean;
  onLoadDemo: (chatKey: "codeDemo" | "chaptersDemo") => void;
  demoChats: {
    codeDemo: {
      title: string;
      messages: Message[];
    };
    chaptersDemo: {
      title: string;
      messages: Message[];
    };
  };
}

export function Sidebar({ onNewChat, isSidebarOpen, onLoadDemo, demoChats }: SidebarProps) {
  const [width, setWidth] = useState(288); // 72 * 4 = 288px (default width)

  const handleResize = (delta: number) => {
    setWidth((prevWidth) => {
      const newWidth = prevWidth + delta;
      return Math.min(Math.max(200, newWidth), 600); // Min: 200px, Max: 600px
    });
  };

  return (
    <div className="flex h-full">
      <div 
        style={{ width: `${width}px` }}
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out z-20 md:relative md:translate-x-0`}
      >
        <div className="p-6 space-y-6">
          <button
            onClick={onNewChat}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2">
              Demo Chats
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => onLoadDemo('codeDemo')}
                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-left flex items-center space-x-2"
              >
                <span>💻</span>
                <span>{demoChats.codeDemo.title}</span>
              </button>
              <button
                onClick={() => onLoadDemo('chaptersDemo')}
                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-left flex items-center space-x-2"
              >
                <span>📚</span>
                <span>{demoChats.chaptersDemo.title}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <DragHandle onResize={handleResize} />
    </div>
  );
} 