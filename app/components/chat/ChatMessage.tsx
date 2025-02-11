import { Message } from "@/app/types";
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors duration-200 rounded hover:bg-gray-700/50"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function ChapterView({ chapters }: { chapters: { title: string; content: string }[] }) {
  return (
    <div className="mt-4 space-y-4">
      {chapters.map((chapter, index) => (
        <div 
          key={index}
          className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {chapter.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {chapter.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="relative w-10 h-10">
          <Image
            src="/logo.png"
            alt="NeuralArc AI"
            width={40}
            height={40}
            className="rounded-xl"
            priority
          />
        </div>
      )}
      <div
        className={`px-6 py-4 rounded-2xl shadow-sm max-w-7xl ${
          isUser
            ? 'bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white max-w-xl ml-4'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-4'
        }`}
      >
        <div className="space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              code(props) {
                const {children, className, ...rest} = props;
                return (
                  <code 
                    className={`${className || ''} ${!className ? 'px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm' : ''}`} 
                    {...rest}
                  >
                    {children}
                  </code>
                );
              },
              pre(props) {
                const code = props.children?.toString() || '';
                return (
                  <div className="relative mt-4 rounded-lg overflow-hidden bg-gray-900">
                    <CopyButton text={code} />
                    <pre className="p-4 overflow-x-auto text-white">
                      {props.children}
                    </pre>
                  </div>
                );
              },
              a({ href, children }) {
                return (
                  <a 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {children}
                  </a>
                );
              },
              p({ children }) {
                return <p className="leading-relaxed whitespace-pre-wrap">{children}</p>;
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.chapters && <ChapterView chapters={message.chapters} />}
        
        <div className={`text-xs mt-2 ${
          isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-gray-700 dark:text-white text-sm font-semibold">You</span>
        </div>
      )}
    </div>
  );
} 