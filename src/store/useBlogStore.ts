import { create } from 'zustand';
import { mockArticles, mockComments, Article, Comment } from './mockData';

interface BlogState {
  articles: Article[];
  comments: Comment[];
  searchQuery: string;
  selectedTag: string | null;
  
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  articles: mockArticles,
  comments: mockComments,
  searchQuery: '',
  selectedTag: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  
  addComment: (commentData) => set((state) => ({
    comments: [
      ...state.comments,
      {
        ...commentData,
        id: `c\${Date.now()}`,
        date: new Date().toISOString(),
      },
    ],
  })),
}));
