import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Download, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { getArticles, deleteUserAccount, Article } from '@/lib/mockData';
import clsx from 'clsx';

export default function Profile() {
  const { currentUser, userLogout } = useAppStore();
  const navigate = useNavigate();
  
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // For demonstration, let's pretend ALL articles belong to the current user if they have no authorId yet
    // In a real app, you would strictly filter by a.authorId === currentUser.id
    const articles = getArticles().filter(a => a.authorId === currentUser.id || !a.authorId);
    setUserArticles(articles);
  }, [currentUser, navigate]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedForDownload);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedForDownload(newSet);
  };

  const selectAll = () => {
    if (selectedForDownload.size === userArticles.length) {
      setSelectedForDownload(new Set());
    } else {
      setSelectedForDownload(new Set(userArticles.map(a => a.id)));
    }
  };

  const handleDownloadSelected = () => {
    if (selectedForDownload.size === 0) return;
    
    const articlesToDownload = userArticles.filter(a => selectedForDownload.has(a.id));
    
    // Trigger download for each selected article
    articlesToDownload.forEach(article => {
      const content = `# ${article.title}\n\n> Date: ${new Date(article.createdAt).toLocaleString()}\n> Status: ${article.status || 'published'}\n\n${article.summary}\n\n---\n\n${article.content}`;
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeTitle = article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.href = url;
      link.download = `${safeTitle || 'article'}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleConfirmDelete = () => {
    if (!currentUser) return;
    
    if (window.confirm('WARNING: This action is irreversible. All your data will be permanently purged from the system. Proceed?')) {
      deleteUserAccount(currentUser.id);
      userLogout();
      navigate('/');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4 pb-6 border-b border-white/10">
        <div className="w-16 h-16 rounded-full bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/30">
          <User size={32} className="text-neon-cyan" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-mono text-white text-glow">USER_PROFILE</h1>
          <p className="text-gray-400 font-mono text-sm">ID: {currentUser.username} | SYSTEM_NODE_ACTIVE</p>
        </div>
      </header>

      <div className="glass-panel p-8 rounded-xl border border-red-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <ShieldAlert size={24} className="text-red-500" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">DANGER_ZONE: ACCOUNT_DELETION</h2>
              <p className="text-gray-400 text-sm mt-1">
                Initiating account deletion will permanently remove your identity from the network.
              </p>
            </div>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2.5 bg-red-500/20 text-red-500 border border-red-500/50 rounded font-mono hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              INITIATE_PURGE_SEQUENCE
            </button>
          </div>
        </div>
      </div>

      {/* Export & Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-card border border-red-500/50 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-red-500/5">
                <h3 className="text-xl font-bold text-red-500 font-mono flex items-center gap-2">
                  <ShieldAlert size={20} />
                  DATA_RETENTION_WARNING
                </h3>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <p className="text-gray-300">
                  System analysis indicates you have <strong className="text-neon-cyan">{userArticles.length}</strong> active or drafted data nodes (articles). Do you wish to export them to local storage before final deletion?
                </p>

                {userArticles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-gray-400">SELECT_NODES_FOR_EXPORT:</span>
                      <button 
                        onClick={selectAll}
                        className="text-xs font-mono text-neon-cyan hover:text-white transition-colors"
                      >
                        {selectedForDownload.size === userArticles.length ? 'DESELECT_ALL' : 'SELECT_ALL'}
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                      {userArticles.map(article => (
                        <div 
                          key={article.id}
                          onClick={() => toggleSelect(article.id)}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded cursor-pointer border transition-all",
                            selectedForDownload.has(article.id)
                              ? "bg-neon-cyan/10 border-neon-cyan/50 text-white"
                              : "bg-black/30 border-white/5 text-gray-400 hover:bg-white/5"
                          )}
                        >
                          <div className={clsx(
                            "w-4 h-4 rounded-sm border flex items-center justify-center shrink-0",
                            selectedForDownload.has(article.id) ? "border-neon-cyan bg-neon-cyan" : "border-gray-500"
                          )}>
                            {selectedForDownload.has(article.id) && <div className="w-2 h-2 bg-black rounded-sm" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{article.title}</p>
                            <p className="text-xs opacity-70 font-mono">
                              {article.status === 'draft' ? '[DRAFT]' : '[PUBLISHED]'} | {new Date(article.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedForDownload.size === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded font-mono hover:bg-neon-cyan hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  EXPORT_SELECTED ({selectedForDownload.size})
                </button>
                
                <button
                  onClick={handleConfirmDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/20 text-red-500 border border-red-500/50 rounded font-mono hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                  CONFIRM_PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}