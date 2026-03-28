import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Database, LogOut, Users, FileText, KeyRound, Globe, Lock, ShieldAlert, Folder, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticles, deleteArticle, updateArticle, Article, getUsers, User, resetUserPassword, ArticleVisibility, getCategories, Category, addCategory, updateCategory, deleteCategory } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import clsx from 'clsx';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'users' | 'categories'>('articles');
  
  // Category Edit State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');

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
    } else if (activeTab === 'users') {
      setUsers(getUsers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else if (activeTab === 'categories') {
      setCategories(getCategories().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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

  // --- Category Management ---
  const handleAddCategory = () => {
    setEditingCategoryId('new');
    setEditCategoryName('');
    setEditCategoryDesc('');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDesc(category.description);
  };

  const handleSaveCategory = () => {
    if (!editCategoryName.trim()) return;
    
    if (editingCategoryId === 'new') {
      addCategory({
        name: editCategoryName.trim(),
        description: editCategoryDesc.trim()
      });
    } else if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: editCategoryName.trim(),
        description: editCategoryDesc.trim()
      });
    }
    
    setEditingCategoryId(null);
    loadData();
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete folder: "${name}"? Articles in this folder will become uncategorized.`)) {
      deleteCategory(id);
      loadData();
    }
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
        <button
          onClick={() => setActiveTab('categories')}
          className={clsx(
            "flex items-center gap-2 px-6 py-2 rounded-md font-mono transition-all",
            activeTab === 'categories' 
              ? "bg-orange-500/20 text-orange-500 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
              : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
          )}
        >
          <Folder size={18} />
          FOLDERS
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="p-4 border-b border-white/10 flex justify-end bg-black/20">
              <button 
                onClick={handleAddCategory}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 border border-orange-500/50 rounded-md font-mono hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_10px_rgba(249,115,22,0.3)] text-sm"
              >
                <Plus size={16} />
                NEW_FOLDER
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40">
                    <th className="px-6 py-4 font-mono text-orange-500 text-sm">FOLDER_NAME</th>
                    <th className="px-6 py-4 font-mono text-orange-500 text-sm">DESCRIPTION</th>
                    <th className="px-6 py-4 font-mono text-orange-500 text-sm">CREATED_AT</th>
                    <th className="px-6 py-4 font-mono text-orange-500 text-sm text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {editingCategoryId === 'new' && (
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-black/50 border border-white/20 rounded text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                          placeholder="Folder Name"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={editCategoryDesc}
                          onChange={(e) => setEditCategoryDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-black/50 border border-white/20 rounded text-gray-300 text-sm focus:outline-none focus:border-orange-500"
                          placeholder="Description (Optional)"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">NOW</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={handleSaveCategory} className="inline-flex items-center justify-center w-8 h-8 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingCategoryId(null)} className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white transition-colors">
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  )}
                  {categories.map((cat, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={cat.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      {editingCategoryId === cat.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/50 border border-white/20 rounded text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                              autoFocus
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={editCategoryDesc}
                              onChange={(e) => setEditCategoryDesc(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/50 border border-white/20 rounded text-gray-300 text-sm focus:outline-none focus:border-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={handleSaveCategory} className="inline-flex items-center justify-center w-8 h-8 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                              <Save size={16} />
                            </button>
                            <button onClick={() => setEditingCategoryId(null)} className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white transition-colors">
                              <X size={16} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Folder size={16} className="text-orange-500" />
                              <span className="font-medium text-white">{cat.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {cat.description || '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditCategory(cat)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                  {categories.length === 0 && editingCategoryId !== 'new' && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-mono">
                        NO_FOLDERS_FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
