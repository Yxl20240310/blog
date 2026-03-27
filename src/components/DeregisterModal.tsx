import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, Trash2, X, FileText } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { Article } from '../store/mockData';
import { downloadArticlesAsZip } from '../utils/download';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

interface DeregisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeregisterModal: React.FC<DeregisterModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, articles, deregister } = useBlogStore();
  
  const userArticles = articles.filter(a => a.authorId === currentUser?.id);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(
    new Set(userArticles.map(a => a.id)) // 默认全选
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedArticles);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedArticles(newSet);
  };

  const handleDownloadAndDeregister = async () => {
    if (selectedArticles.size > 0) {
      setIsDownloading(true);
      const articlesToDownload = userArticles.filter(a => selectedArticles.has(a.id));
      await downloadArticlesAsZip(articlesToDownload);
      setIsDownloading(false);
    }
    
    // 无论是否下载，最后执行注销
    if (currentUser) {
      deregister(currentUser.id);
      window.location.href = '/'; // 强制刷新跳转回首页
    }
  };

  const handleDeregisterOnly = () => {
    if (window.confirm('Are you absolutely sure? All your data logs will be PERMANENTLY ERASED.')) {
      if (currentUser) {
        deregister(currentUser.id);
        window.location.href = '/';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          <GlassCard className="p-0 overflow-hidden flex flex-col max-h-[90vh] border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-red-500/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-mono font-bold tracking-widest">DEREGISTER_ACCOUNT</h2>
                    <p className="text-xs font-mono text-red-400/80 mt-1">WARNING: THIS ACTION IS IRREVERSIBLE</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {userArticles.length > 0 ? (
                <>
                  <p className="text-sm text-white/80 mb-4 leading-relaxed">
                    System detects you have <span className="text-cyan-400 font-bold">{userArticles.length}</span> data logs associated with your ID. 
                    Before permanently deleting your account, would you like to export them to your local device?
                  </p>
                  
                  <div className="space-y-2 border border-white/10 rounded-lg p-2 bg-black/30">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                      <span className="text-xs font-mono text-cyan-500">SELECT LOGS TO EXPORT</span>
                      <button 
                        onClick={() => setSelectedArticles(new Set(selectedArticles.size === userArticles.length ? [] : userArticles.map(a => a.id)))}
                        className="text-[10px] font-mono text-white/40 hover:text-white"
                      >
                        {selectedArticles.size === userArticles.length ? 'DESELECT_ALL' : 'SELECT_ALL'}
                      </button>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                      {userArticles.map(article => (
                        <label 
                          key={article.id} 
                          className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors \${
                            selectedArticles.has(article.id) ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={selectedArticles.has(article.id)}
                            onChange={() => toggleSelect(article.id)}
                            className="mt-1 bg-black/50 border-white/20 text-cyan-500 focus:ring-cyan-500/50 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-bold truncate flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-cyan-500" />
                              {article.title}
                            </div>
                            <div className="text-xs text-white/40 mt-1 flex gap-3">
                              <span>Status: {article.status.toUpperCase()}</span>
                              <span>Date: {article.date}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-white/60 mb-2">No data logs found associated with your account.</p>
                  <p className="text-sm text-white/60">Are you sure you want to proceed with account deletion?</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-end gap-4">
              <button 
                onClick={onClose}
                className="text-sm font-mono text-white/60 hover:text-white transition-colors order-3 sm:order-1 px-4"
              >
                CANCEL
              </button>
              
              <Button 
                variant="outline"
                onClick={handleDeregisterOnly}
                className="w-full sm:w-auto border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 order-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                DELETE_WITHOUT_EXPORT
              </Button>

              {userArticles.length > 0 && (
                <Button 
                  onClick={handleDownloadAndDeregister}
                  disabled={isDownloading || selectedArticles.size === 0}
                  className="w-full sm:w-auto order-1 sm:order-3"
                >
                  <Download className={`w-4 h-4 mr-2 \${isDownloading ? 'animate-bounce' : ''}`} />
                  {isDownloading ? 'EXPORTING...' : `EXPORT (\${selectedArticles.size}) & DELETE`}
                </Button>
              )}
            </div>

          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};