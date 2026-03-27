import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Terminal, Lock, Settings } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { cn } from '../utils/cn';

export const Navbar = () => {
  const { searchQuery, setSearchQuery, isAdmin, logout } = useBlogStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          <Terminal className="w-6 h-6 group-hover:animate-pulse-slow" />
          <span className="font-mono font-bold text-xl tracking-tighter text-glow">
            SYS.LOG
          </span>
        </Link>

        {isHome && (
          <div className="flex-1 max-w-md ml-8 relative group hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data logs..."
              className={cn(
                "w-full bg-white/5 border border-white/10 rounded-none py-2 pl-10 pr-4",
                "text-sm font-mono text-white placeholder:text-white/30",
                "focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-black/50",
                "transition-all duration-300"
              )}
            />
            {/* Cyberpunk accent corner */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/0 group-focus-within:border-cyan-500/100 transition-all duration-300" />
          </div>
        )}

        <div className="flex items-center ml-auto gap-4">
          {isAdmin ? (
            <>
              <Link 
                to="/admin"
                className="text-xs font-mono text-cyan-500 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 border border-cyan-500/30 hover:border-cyan-500 rounded bg-cyan-500/10 transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                ADMIN_PANEL
              </Link>
              <button
                onClick={logout}
                className="text-xs font-mono text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className="text-xs font-mono text-white/30 hover:text-cyan-500 flex items-center gap-1.5 transition-colors"
              title="Admin Login"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
