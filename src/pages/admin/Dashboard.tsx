import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Database, LogOut, Users, FileText, KeyRound, Globe, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticles, deleteArticle, updateArticle, Article, getUsers, User, resetUserPassword, ArticleVisibility } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import clsx from 'clsx';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'users'>('articles');
  
  const navigate = useNavigate();
  const { isAdminAuthenticated, adminLogout } = useAppStore();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAdminAuthenticated, navigate, activeTab]);

  const loadData = () => {
    if (activeTab === 'articles') {
      setArticles(getArticles().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else {
      setUsers(getUsers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete article: "${title}"?`)) {
      deleteArticle(id);
      loadData();
    }
  };

  const handleResetPassword = (userId: string, username: string) => {
    const newPassword = window.prompt(`Enter new password for user "${username}":`, "123456");
    if (newPassword) {
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }
      if (resetUserPassword(userId, newPassword)) {
        alert(`Password for "${username}" has been successfully reset.`);
      } else {
        alert("Failed to reset password.");
      }
    }
  };

  const handleVisibilityToggle = (id: string, currentVisibility: ArticleVisibility | undefined) => {
    const nextVisibility: Record<string, ArticleVisibility> = {
      'public': 'restricted',
      'restricted': 'private',
      'private': 'public'
    };
    
    const newVisibility = nextVisibility[currentVisibility || 'public'];
    updateArticle(id, { visibility: newVisibility });
    loadData();
  };

  const getVisibilityIcon = (visibility?: ArticleVisibility) => {
    switch(visibility) {
      case 'private': return <Lock size={14} className="text-red-400" />;
      case 'restricted': return <ShieldAlert size={14} className="text-orange-400" />;
      case 'public':
      default: return <Globe size={14} className="text-neon-cyan" />;
    }
  };

  const getVisibilityLabel = (visibility?: ArticleVisibility) => {
    switch(visibility) {
      case 'private': return 'PRIVATE';
      case 'restricted': return 'RESTRICTED';
      case 'public':
      default: return 'PUBLIC';
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  if (!isAdminAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-neon-cyan">
          <Database size={28} />
          <div>
            <h1 className="text-3xl font-bold font-mono text-glow">SYSTEM_DASHBOARD</h1>
            <p className="text-gray-400 font-mono text-sm">Manage network entities</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 border border-white/10 rounded-md font-mono hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('articles')}
          className={clsx(
            "flex items-center gap-2 px-6 py-2 rounded-md font-mono transition-all",
            activeTab === 'articles' 
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-glow-cyan" 
              : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
          )}
        >
          <FileText size={18} />
          ARTICLES
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={clsx(
            "flex items-center gap-2 px-6 py-2 rounded-md font-mono transition-all",
            activeTab === 'users' 
              ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50 shadow-glow-purple" 
              : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
          )}
        >
          <Users size={18} />
          USERS
        </button>
      </div>

      {/* Content Area */}
      <div className="glass-panel rounded-xl overflow-hidden">
        
        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="p-4 border-b border-white/10 flex justify-end bg-black/20">
              <Link 
                to="/admin/editor"
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-md font-mono hover:bg-neon-cyan hover:text-black transition-all shadow-glow-cyan text-sm"
              >
                <Plus size={16} />
                NEW_ARTICLE
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40">
                    <th className="px-6 py-4 font-mono text-neon-cyan text-sm">TITLE</th>
                    <th className="px-6 py-4 font-mono text-neon-cyan text-sm">VISIBILITY</th>
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
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleVisibilityToggle(article.id, article.visibility)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 transition-colors text-xs font-mono text-gray-400 group-hover:border-white/20"
                          title="Click to toggle visibility"
                        >
                          {getVisibilityIcon(article.visibility)}
                          {getVisibilityLabel(article.visibility)}
                        </button>
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
                          onClick={() => handleDeleteArticle(article.id, article.title)}
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
                        NO_ARTICLES_FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-4 font-mono text-neon-purple text-sm">USERNAME</th>
                  <th className="px-6 py-4 font-mono text-neon-purple text-sm">REGISTERED_AT</th>
                  <th className="px-6 py-4 font-mono text-neon-purple text-sm">LAST_LOGIN</th>
                  <th className="px-6 py-4 font-mono text-neon-purple text-sm text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center border border-neon-purple/30">
                          <User size={14} className="text-neon-purple" />
                        </div>
                        <span className="font-medium text-white font-mono">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                      {user.lastLoginTime ? (
                        <span className="text-neon-cyan">{new Date(user.lastLoginTime).toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-600">NEVER_LOGGED_IN</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleResetPassword(user.id, user.username)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-colors text-xs font-mono border border-orange-500/30"
                        title="Reset Password"
                      >
                        <KeyRound size={14} />
                        RESET_PWD
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-mono">
                      NO_USERS_FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
