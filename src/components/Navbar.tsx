import { Link } from 'react-router-dom';
import { Search, Terminal } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Terminal className="text-neon-cyan group-hover:text-neon-purple transition-colors" size={28} />
          <span className="font-mono text-xl font-bold tracking-wider text-white text-glow">
            NEXUS<span className="text-neon-cyan">_BLOG</span>
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-black/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan transition-all sm:text-sm font-mono"
            placeholder="搜索文章标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-neon-cyan hover:text-glow transition-all font-mono text-sm uppercase">
            Home
          </Link>
          <a href="#" className="text-gray-300 hover:text-neon-purple hover:text-glow transition-all font-mono text-sm uppercase">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
