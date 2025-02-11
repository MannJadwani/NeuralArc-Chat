import { useState } from 'react';
import { Model, availableModels } from '@/app/types';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = availableModels.find(model => model.id === selectedModel) || availableModels[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentModel.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
          <div className="p-2 space-y-1">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full flex flex-col items-start p-3 rounded-lg text-left transition-colors duration-200
                  ${selectedModel === model.id 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                disabled={!model.isAvailable}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {model.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {model.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 