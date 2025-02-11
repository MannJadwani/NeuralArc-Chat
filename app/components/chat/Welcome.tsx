import { SuggestedPrompt } from '@/app/types';
import Image from 'next/image';

interface WelcomeProps {
  onSelectPrompt: (prompt: string) => void;
  suggestedPrompts: SuggestedPrompt[];
}

export function Welcome({ onSelectPrompt, suggestedPrompts }: WelcomeProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to NeuralArc Chat</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose a prompt or start typing to begin your conversation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.prompt)}
            className="group p-4 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-200 text-left space-y-2 hover:shadow-lg"
          >
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
              {prompt.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {prompt.description}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="relative w-16 h-16">
          <Image
            src="/logo.png"
            alt="NeuralArc Logo"
            width={64}
            height={64}
            className="rounded-2xl"
            priority
          />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Powered by NeuralArc</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Advanced AI to assist with your development needs</p>
        </div>
      </div>
    </div>
  );
} 