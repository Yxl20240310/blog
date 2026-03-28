import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Folder as FolderIcon, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const FolderManagement: React.FC = () => {
  const { folders, articles, addFolder, updateFolder, deleteFolder } = useStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName('');
  };

  const startEdit = (id: string, currentName: string) => {
    if (id === 'default') return;
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (!editingName.trim() || !editingId) {
      setEditingId(null);
      return;
    }
    updateFolder(editingId, editingName.trim());
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'default') return;
    if (window.confirm(`确定要删除分类 "${name}" 吗？\n该分类下的所有文章将被移动到"默认分类"。`)) {
      deleteFolder(id);
    }
  };

  const getArticleCount = (folderId: string) => {
    return articles.filter(a => a.folderId === folderId || (!a.folderId && folderId === 'default')).length;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-mono text-white flex items-center gap-3">
          <FolderIcon className="text-neon-green" size={32} /> 
          分类管理 / FOLDERS
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create new folder */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2">
              <Plus size={18} className="text-neon-green" /> 新建分类
            </h2>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all font-mono text-sm"
                  placeholder="分类名称..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neon-green/20 border border-neon-green/50 text-neon-green rounded-lg font-bold hover:bg-neon-green hover:text-cyber-black hover:shadow-neon-green transition-all duration-300"
              >
                添加分类 / ADD
              </button>
            </form>
          </div>
        </div>

        {/* Folder List */}
        <div className="lg:col-span-2 space-y-4">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${folder.id === 'default' ? 'bg-slate-800 text-slate-400' : 'bg-neon-green/10 text-neon-green'}`}>
                  <FolderIcon size={20} />
                </div>
                
                {editingId === folder.id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 bg-slate-900 border border-neon-green rounded px-3 py-1.5 text-white font-mono text-sm focus:outline-none"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-1.5 text-neon-green hover:bg-neon-green/20 rounded transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-bold text-white font-mono flex items-center gap-2">
                      {folder.name}
                      {folder.id === 'default' && (
                        <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded-full border border-slate-700">内置</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      包含 {getArticleCount(folder.id)} 篇文章
                    </div>
                  </div>
                )}
              </div>

              {!editingId && folder.id !== 'default' && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(folder.id, folder.name)}
                    className="p-2 text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded transition-colors"
                    title="重命名"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(folder.id, folder.name)}
                    className="p-2 text-slate-400 hover:text-neon-red hover:bg-neon-red/10 rounded transition-colors"
                    title="删除分类"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderManagement;