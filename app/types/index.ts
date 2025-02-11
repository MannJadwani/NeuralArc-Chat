export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface Chapter {
  title: string;
  content: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'ai' | 'user';
  timestamp: number;
  model?: string;
  codeBlocks?: CodeBlock[];
  chapters?: Chapter[];
}

export interface SavedChat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

export const availableModels: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    isAvailable: true
  },
  {
    id: 'gemini-flash-2.0',
    name: 'Gemini Flash 2.0',
    description: "Google's most capable model for text, code, and analysis",
    isAvailable: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
    description: 'Fast and efficient for most tasks',
    isAvailable: true
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced reasoning and analysis',
    isAvailable: true
  }
]; 