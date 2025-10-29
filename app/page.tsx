'use client';

import { useState } from 'react';
import { AutocompleteSearch } from '@/components/autocomplete-search';
import { ChatInterface } from '@/components/chat-interface';
import { Question } from '@/lib/data';
import { ChatMessage } from '@/lib/types';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSelectQuestion = (question: Question) => {
    const newMessage: ChatMessage = {
      id: `${question.id}-${Date.now()}`,
      questionId: question.id,
      question: question.question,
      answer: question.answer,
      category: question.category,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      const container = document.querySelector('[data-chat-container]');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Chat Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Ask questions and engage in discussions with nested comments
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <AutocompleteSearch onSelectQuestion={handleSelectQuestion} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full">
          <div
            data-chat-container
            className="h-full bg-white dark:bg-gray-900 shadow-lg rounded-t-lg overflow-hidden"
          >
            <ChatInterface messages={messages} />
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 14, TanStack Query, and shadcn/ui • {messages.length} questions asked
          </p>
        </div>
      </footer>
    </div>
  );
}
