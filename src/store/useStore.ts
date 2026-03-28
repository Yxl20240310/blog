import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment, Article, articles as initialArticles } from '../data/mockData';

interface StoreState {
  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  
  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'likes' | 'date'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Admin Auth
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
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

      // Initialize with mock data, ensure published flag exists
      articles: initialArticles.map(a => ({ ...a, published: a.published ?? true })),
      
      addArticle: (articleData) =>
        set((state) => ({
          articles: [
            {
              ...articleData,
              id: Math.random().toString(36).substring(7),
              likes: 0,
              date: new Date().toISOString().split('T')[0],
            },
            ...state.articles,
          ],
        })),
        
      updateArticle: (id, articleData) =>
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id ? { ...article, ...articleData } : article
          ),
        })),
        
      deleteArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
          // Optionally delete associated comments
          comments: state.comments.filter((comment) => comment.articleId !== id),
        })),

      isAdmin: false,
      login: (password) => {
        // Simple mock authentication
        if (password === 'admin123') {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'tech-blog-storage',
    }
  )
);