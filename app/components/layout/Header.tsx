import { ThemeToggle } from '../ui/ThemeToggle';
import { ModelSelector } from '../ui/ModelSelector';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
  };
  onSignOut?: () => void;
}

export function Header({ 
  onToggleSidebar, 
  selectedModel, 
  onModelChange,
  isAuthenticated = false,
  user,
  onSignOut
}: HeaderProps) {
  return (
    <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="NeuralArc Logo"
                width={40}
                height={40}
                className="rounded-xl"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">NeuralArc</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </div>
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 