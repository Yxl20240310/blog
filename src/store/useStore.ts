import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment, Article, User, articles as initialArticles } from '../data/mockData';

interface StoreState {
  // Users
  users: User[];
  currentUser: User | null;
  registerUser: (user: Omit<User, 'id' | 'createdAt'>) => boolean;
  userLogin: (username: string, password: string) => boolean;
  userLogout: () => void;
  resetUserPassword: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  
  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'likes' | 'dislikes' | 'date'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  dislikeArticle: (id: string) => void;
  
  // Admin Auth
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Users
      users: [],
      currentUser: null,
      registerUser: (userData) => {
        const { users } = get();
        if (users.some((u) => u.username === userData.username)) {
          return false; // Username exists
        }
        set((state) => ({
          users: [
            ...state.users,
            {
              ...userData,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return true;
      },
      userLogin: (username, password) => {
        const { users } = get();
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
          const now = new Date().toISOString();
          const updatedUser = { ...user, lastLoginTime: now };
          
          set((state) => ({ 
            currentUser: updatedUser,
            users: state.users.map(u => u.id === user.id ? updatedUser : u)
          }));
          return true;
        }
        return false;
      },
      userLogout: () => set({ currentUser: null }),
      resetUserPassword: (userId) => {
        set((state) => ({
          users: state.users.map(u => 
            u.id === userId ? { ...u, password: 'password123' } : u
          )
        }));
      },
      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter(u => u.id !== userId)
        }));
      },

      // Comments
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

      // Initialize with mock data, ensure published flag and dislikes exist
      articles: initialArticles.map(a => ({ 
        ...a, 
        published: a.published ?? true,
        dislikes: a.dislikes ?? 0 
      })),
      
      addArticle: (articleData) =>
        set((state) => ({
          articles: [
            {
              ...articleData,
              id: Math.random().toString(36).substring(7),
              likes: 0,
              dislikes: 0,
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

      likeArticle: (id) => 
        set((state) => ({
          articles: state.articles.map(a => 
            a.id === id ? { ...a, likes: a.likes + 1 } : a
          )
        })),

      dislikeArticle: (id) => 
        set((state) => ({
          articles: state.articles.map(a => 
            a.id === id ? { ...a, dislikes: (a.dislikes || 0) + 1 } : a
          )
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