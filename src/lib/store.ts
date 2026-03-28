import { create } from 'zustand';
import { User } from './mockData';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  
  isAdminAuthenticated: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
  
  currentUser: User | null;
  userLogin: (user: User) => void;
  userLogout: () => void;
}

const getStoredUser = (): User | null => {
  const data = localStorage.getItem('current_user');
  return data ? JSON.parse(data) : null;
};

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedTags: [],
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag]
  })),
  clearFilters: () => set({ searchQuery: '', selectedTags: [] }),
  
  // Admin Authentication
  isAdminAuthenticated: localStorage.getItem('admin_auth') === 'true',
  adminLogin: () => {
    localStorage.setItem('admin_auth', 'true');
    set({ isAdminAuthenticated: true });
  },
  adminLogout: () => {
    localStorage.removeItem('admin_auth');
    set({ isAdminAuthenticated: false });
  },
  
  // User Authentication
  currentUser: getStoredUser(),
  userLogin: (user) => {
    localStorage.setItem('current_user', JSON.stringify(user));
    set({ currentUser: user });
  },
  userLogout: () => {
    localStorage.removeItem('current_user');
    set({ currentUser: null });
  }
}));
