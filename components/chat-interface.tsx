'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { CommentSystem } from '@/components/comment-system';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
}

export function ChatInterface({ messages }: ChatInterfaceProps) {
  const [stickyHeader, setStickyHeader] = useState<string | null>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      let currentMessageId: string | null = null;
      
      for (const [id, ref] of Object.entries(messageRefs.current)) {
        if (!ref) continue;
        
        const rect = ref.getBoundingClientRect();
        const relativeTop = rect.top - containerTop;
        
        if (relativeTop <= 100 && relativeTop + rect.height > 100) {
          currentMessageId = id;
          break;
        }
      }

      setStickyHeader(currentMessageId);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-lg">No questions selected yet</p>
          <p className="text-sm">Use the search bar above to find and select questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {stickyHeader && (
        <div className="sticky top-0 z-10 bg-blue-600 text-white px-6 py-3 shadow-md border-b border-blue-700">
          <p className="font-medium text-sm">
            {messages.find((m) => m.id === stickyHeader)?.question}
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className="h-full overflow-y-auto px-4 py-6 space-y-8"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            ref={(el) => {
              messageRefs.current[message.id] = el;
            }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <div className="max-w-[80%]">
                <Card className="bg-blue-600 text-black border-blue-700">
                  <div className="p-4">
                    <p className="text-sm font-medium mb-1text-sm font-medium text-blue-600 dark:text-blue-400">You</p>
                    <p>{message.question}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[80%] w-full">
                <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="p-4 space-y-3">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      AI Assistant
                    </p>
                    <p className="leading-relaxed">{message.answer}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {message.category}
                      </span>
                      <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Card>

                <div className="mt-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <CommentSystem questionId={message.questionId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
