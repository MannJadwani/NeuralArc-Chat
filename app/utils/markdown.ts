import { CodeBlock } from '@/app/types';

export function parseMarkdownCodeBlocks(markdown: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const [, language = 'text', code] = match;
    codeBlocks.push({
      language: language.toLowerCase(),
      code: code.trim()
    });
  }

  return codeBlocks;
} 