import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '../data/mockData';

interface StoreState {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      comments: [],
      addComment: (comment) =>
        set((state) => ({
          comments: [
            ...state.comments,
            {
              ...comment,
              id: Math.random().toString(36).substring(7),
              date: new Date().toISOString().split('T')[0],
            },
          ],
        })),
    }),
    {
      name: 'tech-blog-storage',
    }
  )
);