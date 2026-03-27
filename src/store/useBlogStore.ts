import { create } from 'zustand';
import { mockArticles, mockComments, Article, Comment } from './mockData';

interface BlogState {
  articles: Article[];
  comments: Comment[];
  searchQuery: string;
  selectedTag: string | null;
  isAdmin: boolean;
  
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  
  // Admin Actions
  login: () => void;
  logout: () => void;
  addArticle: (article: Omit<Article, 'id' | 'likes' | 'views' | 'date'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
}

// 尝试从 localStorage 获取初始数据，如果没有则使用 mockData
const getInitialArticles = () => {
  const stored = localStorage.getItem('blog_articles');
  return stored ? JSON.parse(stored) : mockArticles;
};

const getInitialAdminState = () => {
  return localStorage.getItem('blog_admin') === 'true';
};

export const useBlogStore = create<BlogState>((set) => ({
  articles: getInitialArticles(),
  comments: mockComments,
  searchQuery: '',
  selectedTag: null,
  isAdmin: getInitialAdminState(),

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

  login: () => set(() => {
    localStorage.setItem('blog_admin', 'true');
    return { isAdmin: true };
  }),

  logout: () => set(() => {
    localStorage.removeItem('blog_admin');
    return { isAdmin: false };
  }),

  addArticle: (articleData) => set((state) => {
    const newArticle: Article = {
      ...articleData,
      id: `a\${Date.now()}`,
      likes: 0,
      views: 0,
      date: new Date().toISOString().split('T')[0],
    };
    const newArticles = [newArticle, ...state.articles];
    localStorage.setItem('blog_articles', JSON.stringify(newArticles));
    return { articles: newArticles };
  }),

  updateArticle: (id, updates) => set((state) => {
    const newArticles = state.articles.map((article) => 
      article.id === id ? { ...article, ...updates } : article
    );
    localStorage.setItem('blog_articles', JSON.stringify(newArticles));
    return { articles: newArticles };
  }),

  deleteArticle: (id) => set((state) => {
    const newArticles = state.articles.filter((article) => article.id !== id);
    localStorage.setItem('blog_articles', JSON.stringify(newArticles));
    return { articles: newArticles };
  }),
}));
