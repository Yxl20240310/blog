import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

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
  isAuthenticated: localStorage.getItem('admin_auth') === 'true',
  login: () => {
    localStorage.setItem('admin_auth', 'true');
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('admin_auth');
    set({ isAuthenticated: false });
  }
}));
