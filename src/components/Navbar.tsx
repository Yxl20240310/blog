import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Search, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NavbarProps {
  onSearch?: (keyword: string) => void;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showSearch = false }) => {
  const [keyword, setKeyword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userLogout } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
    } else {
      navigate(`/?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="text-neon-green group-hover:text-neon-blue transition-colors duration-300" size={28} />
            <span className="font-mono font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
              TECH_LOG
            </span>
          </Link>

          {/* Desktop Search & Nav */}
          <div className="hidden md:flex items-center gap-6">
            {showSearch && (
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-neon-blue transition-colors" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="block w-64 pl-10 pr-3 py-1.5 border border-slate-700 rounded-full leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-neon-blue focus:border-neon-blue focus:shadow-neon-blue sm:text-sm transition-all duration-300"
                  placeholder="搜索文章..."
                />
              </form>
            )}
            <div className="flex space-x-4 items-center">
              <Link to="/" className="text-slate-300 hover:text-neon-green hover:shadow-neon-green transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium">
                首页
              </Link>
              
              {currentUser ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2 text-neon-blue font-mono text-sm">
                    <UserIcon size={16} />
                    <span>{currentUser.username}</span>
                  </div>
                  <button 
                    onClick={userLogout}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="退出登录"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
                  <Link 
                    to="/login" 
                    className="text-slate-300 hover:text-neon-blue transition-colors text-sm font-mono"
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-3 py-1 bg-neon-green/20 text-neon-green border border-neon-green/50 rounded hover:bg-neon-green hover:text-cyber-black transition-all text-sm font-mono"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {showSearch && (
              <form onSubmit={handleSearch} className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-md bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-neon-blue"
                  placeholder="搜索文章..."
                />
              </form>
            )}
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-neon-green hover:bg-slate-800">
              首页
            </Link>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-neon-blue font-mono flex items-center gap-2">
                    <UserIcon size={16} /> {currentUser.username}
                  </div>
                  <button 
                    onClick={userLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-800 rounded-md font-mono"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link 
                    to="/login" 
                    className="block text-center py-2 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-800 font-mono"
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-center py-2 bg-neon-green/20 text-neon-green border border-neon-green/50 rounded-md hover:bg-neon-green hover:text-cyber-black font-mono"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;