export interface Comment {
  id: string;
  questionId: number;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  votes: number;
  replies?: Comment[];
}

export interface ChatMessage {
  id: string;
  questionId: number;
  question: string;
  answer: string;
  category: string;
  timestamp: Date;
}

export type SortOption = 'newest' | 'oldest' | 'most-voted';
