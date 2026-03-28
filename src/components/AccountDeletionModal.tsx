import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, Trash2, X, CheckSquare, Square } from 'lucide-react';
import JSZip from 'jszip';
import { Article } from '../data/mockData';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userArticles: Article[];
}

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userArticles
}) => {
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);

  // When modal opens, select all by default if there are articles
  useEffect(() => {
    if (isOpen && userArticles.length > 0) {
      setSelectedArticles(new Set(userArticles.map(a => a.id)));
    } else {
      setSelectedArticles(new Set());
    }
  }, [isOpen, userArticles]);

  const toggleSelectAll = () => {
    if (selectedArticles.size === userArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(userArticles.map(a => a.id)));
    }
  };

  const toggleSelectArticle = (id: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  };

  const generateMarkdownContent = (article: Article) => {
    return `
# ${article.title}

> ${article.excerpt}

**作者:** ${article.author}  
**日期:** ${article.date}  
**状态:** ${article.published ? '已发布' : '草稿'}
**标签:** ${article.tags.join(', ')}

---

${article.content}
    `.trim();
  };

  const handleDownload = async () => {
    if (selectedArticles.size === 0) return;
    
    setIsDownloading(true);
    try {
      if (selectedArticles.size === 1) {
        // Single file download
        const articleId = Array.from(selectedArticles)[0];
        const article = userArticles.find(a => a.id === articleId);
        if (!article) return;
        
        const markdownContent = generateMarkdownContent(article);
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article.title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Multiple files zip download
        const zip = new JSZip();
        
        userArticles.forEach(article => {
          if (selectedArticles.has(article.id)) {
            const markdownContent = generateMarkdownContent(article);
            // Replace invalid characters in filename
            const safeTitle = article.title.replace(/[\\/:*?"<>|]/g, '-');
            zip.file(`${safeTitle}.md`, markdownContent);
          }
        });
        
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my_articles_backup.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-cyber-black border border-neon-red/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-red-500/5">
              <div className="flex items-center gap-3 text-neon-red">
                <AlertTriangle size={28} className="animate-pulse" />
                <h2 className="text-xl font-bold font-mono">注销账号 / DELETE_ACCOUNT</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <p className="text-slate-300 mb-6 leading-relaxed">
                警告：注销账号是一个不可逆的操作。您的个人信息、评论以及名下的所有文章都将被永久删除。
              </p>

              {userArticles.length > 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-white font-bold flex items-center gap-2">
                        发现您的文章资产
                        <span className="bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full text-xs font-mono">
                          {userArticles.length} 篇
                        </span>
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">在永久删除前，您可以选择将它们下载到本地备份。</p>
                    </div>
                    <button
                      onClick={toggleSelectAll}
                      className="text-neon-blue hover:text-blue-400 text-sm font-mono flex items-center gap-1"
                    >
                      {selectedArticles.size === userArticles.length ? '取消全选' : '全选'}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {userArticles.map(article => (
                      <div 
                        key={article.id}
                        onClick={() => toggleSelectArticle(article.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                          selectedArticles.has(article.id) 
                            ? 'bg-neon-blue/10 border-neon-blue/30' 
                            : 'bg-slate-800/50 border-transparent hover:bg-slate-800'
                        }`}
                      >
                        <div className={`text-${selectedArticles.has(article.id) ? 'neon-blue' : 'slate-500'}`}>
                          {selectedArticles.has(article.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-200 text-sm font-medium truncate">
                            {article.title}
                          </div>
                          <div className="text-slate-500 text-xs mt-1 flex items-center gap-2 font-mono">
                            <span className={article.published ? 'text-neon-green' : 'text-slate-400'}>
                              {article.published ? '已发布' : '草稿'}
                            </span>
                            <span>•</span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedArticles.size > 0 && (
                    <div className="mt-6">
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-lg font-bold hover:bg-neon-blue hover:text-white hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={18} />
                        {isDownloading 
                          ? '正在打包下载... / PACKAGING...' 
                          : `下载选中的 ${selectedArticles.size} 篇文章 / DOWNLOAD_SELECTED`
                        }
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500 font-mono text-sm">
                  未发现您名下的文章资产_
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-slate-900/80 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors font-mono"
              >
                取消 / CANCEL
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 px-6 py-2.5 bg-neon-red/20 border border-neon-red/50 text-neon-red rounded-lg font-bold hover:bg-neon-red hover:text-white hover:shadow-neon-red transition-all duration-300"
              >
                <Trash2 size={18} /> 确认注销 / CONFIRM_DELETE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountDeletionModal;