import { create } from 'zustand';
import { mockArticles, mockComments, Article, Comment } from './mockData';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'user' | 'admin';
  lastLogin?: string;
}

interface BlogState {
  articles: Article[];
  comments: Comment[];
  searchQuery: string;
  selectedTag: string | null;
  isAdmin: boolean;
  currentUser: User | null;
  
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  
  // Auth Actions
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  
  // Admin Actions
  addArticle: (article: Omit<Article, 'id' | 'likes' | 'dislikes' | 'views' | 'date'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  
  // Interaction Actions
  voteArticle: (id: string, type: 'like' | 'dislike') => void;
}

// 尝试从 localStorage 获取初始数据
const getInitialArticles = () => {
  const stored = localStorage.getItem('blog_articles');
  return stored ? JSON.parse(stored) : mockArticles;
};

const getInitialUser = (): User | null => {
  const stored = localStorage.getItem('blog_current_user');
  return stored ? JSON.parse(stored) : null;
};

export const useBlogStore = create<BlogState>((set) => ({
  articles: getInitialArticles(),
  comments: mockComments,
  searchQuery: '',
  selectedTag: null,
  currentUser: getInitialUser(),
  isAdmin: getInitialUser()?.role === 'admin',

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

  login: (user) => set(() => {
    const loginTime = new Date().toISOString();
    const updatedUser = { ...user, lastLogin: loginTime };
    
    // 更新本地存储中该用户的最后登录时间
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = loginTime;
      localStorage.setItem('blog_users', JSON.stringify(users));
    }

    localStorage.setItem('blog_current_user', JSON.stringify(updatedUser));
    return { currentUser: updatedUser, isAdmin: updatedUser.role === 'admin' };
  }),

  logout: () => set(() => {
    localStorage.removeItem('blog_current_user');
    return { currentUser: null, isAdmin: false };
  }),

  register: (user) => {
    // 模拟注册，将用户信息存入 localStorage 中（实际应在后端保存）
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    users.push(user);
    localStorage.setItem('blog_users', JSON.stringify(users));
  },

  addArticle: (articleData) => set((state) => {
    const newArticle: Article = {
      ...articleData,
      id: `a\${Date.now()}`,
      likes: 0,
      dislikes: 0,
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

  resetUserPassword: (userId, newPassword) => {
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('blog_users', JSON.stringify(users));
    }
  },

  voteArticle: (id, type) => set((state) => {
    const newArticles = state.articles.map((article) => {
      if (article.id === id) {
        return {
          ...article,
          likes: type === 'like' ? article.likes + 1 : article.likes,
          dislikes: type === 'dislike' ? article.dislikes + 1 : article.dislikes,
        };
      }
      return article;
    });
    localStorage.setItem('blog_articles', JSON.stringify(newArticles));
    return { articles: newArticles };
  }),
}));
