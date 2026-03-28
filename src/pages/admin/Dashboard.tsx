import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Database, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticles, deleteArticle, Article } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    setArticles(getArticles().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [isAuthenticated, navigate]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete article: "${title}"?`)) {
      deleteArticle(id);
      setArticles(getArticles().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-neon-cyan">
          <Database size={28} />
          <div>
            <h1 className="text-3xl font-bold font-mono text-glow">SYSTEM_DASHBOARD</h1>
            <p className="text-gray-400 font-mono text-sm">Manage articles and content</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/editor"
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-md font-mono hover:bg-neon-purple hover:text-white transition-all shadow-glow-purple"
          >
            <Plus size={18} />
            NEW_ARTICLE
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 border border-white/10 rounded-md font-mono hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Articles List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="px-6 py-4 font-mono text-neon-cyan text-sm">TITLE</th>
                <th className="px-6 py-4 font-mono text-neon-cyan text-sm">DATE</th>
                <th className="px-6 py-4 font-mono text-neon-cyan text-sm">LIKES</th>
                <th className="px-6 py-4 font-mono text-neon-cyan text-sm text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={article.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link to={`/article/${article.id}`} className="font-medium text-white hover:text-neon-cyan transition-colors line-clamp-1">
                      {article.title}
                    </Link>
                    <div className="flex gap-2 mt-1">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 font-mono">#{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neon-purple font-mono text-sm">
                    {article.likes}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      to={`/admin/editor/${article.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id, article.title)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-mono">
                    NO_DATA_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
