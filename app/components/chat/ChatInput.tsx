import { useState } from 'react';
import { DragHandle } from '../ui/DragHandle';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const [height, setHeight] = useState(64); // Default height

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const handleResize = (delta: number) => {
    setHeight((prevHeight) => {
      const newHeight = prevHeight - delta; // Subtract delta because dragging up should increase height
      return Math.min(Math.max(64, newHeight), 400); // Min: 64px, Max: 400px
    });
  };

  return (
    <div>
      <DragHandle direction="vertical" onResize={handleResize} />
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-start">
            <textarea
              style={{ height: `${height}px` }}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={disabled}
              className={`w-full px-6 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-gray-400/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 resize-none ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="absolute right-4 top-4 p-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 