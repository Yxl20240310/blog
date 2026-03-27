import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Globe, FileText, Settings, AlertTriangle, Users, Terminal, Key, Folder as FolderIcon, MoreVertical } from 'lucide-react';
import { useBlogStore, User, Folder } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function AdminDashboard() {
  const { articles, folders, deleteArticle, updateArticle, resetUserPassword, addFolder, updateFolder, deleteFolder } = useBlogStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'articles' | 'users'>('articles');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`WARNING: Are you sure you want to delete "\${title}"?\nThis action cannot be undone.`)) {
      deleteArticle(id);
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateArticle(id, { status: newStatus });
  };

  const handleResetPassword = (user: User) => {
    const newPassword = prompt(`Enter new password for user \${user.username}:`);
    if (newPassword) {
      resetUserPassword(user.id, newPassword);
      alert(`Password for \${user.username} has been reset successfully.`);
    }
  };

  // Folder Actions
  const handleAddFolder = () => {
    const name = prompt('Enter new folder name:');
    if (name && name.trim()) {
      addFolder(name.trim());
    }
  };

  const handleEditFolder = (folder: Folder) => {
    const name = prompt('Edit folder name:', folder.name);
    if (name && name.trim() && name !== folder.name) {
      updateFolder(folder.id, name.trim());
    }
  };

  const handleDeleteFolder = (folder: Folder) => {
    if (window.confirm(`Delete folder "\${folder.name}"?\nArticles inside will NOT be deleted, but will be moved to root.`)) {
      deleteFolder(folder.id);
      if (selectedFolder === folder.id) {
        setSelectedFolder(null);
      }
    }
  };

  const users: User[] = JSON.parse(localStorage.getItem('blog_users') || '[]');

  // Filter articles by folder
  const displayedArticles = selectedFolder 
    ? articles.filter(a => a.folderId === selectedFolder)
    : articles;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-mono text-white flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-cyan-500" />
              SYSTEM_DASHBOARD
            </h1>
            <p className="text-sm font-mono text-white/40">Manage your data logs and system users.</p>
          </div>
          {activeTab === 'articles' && (
            <Button onClick={() => navigate('/admin/editor')} className="gap-2">
              <Plus className="w-4 h-4" /> NEW_LOG
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all \${
              activeTab === 'articles' 
                ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" /> DATA_LOGS
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all \${
              activeTab === 'users' 
                ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> USERS
          </button>
        </div>

        {activeTab === 'articles' ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Sidebar - Folders */}
            <div className="w-full md:w-64 flex-shrink-0">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono text-cyan-500">DIRECTORIES</span>
                  <button onClick={handleAddFolder} className="text-white/40 hover:text-cyan-400 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  <div 
                    onClick={() => setSelectedFolder(null)}
                    className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors text-sm font-mono \${
                      selectedFolder === null ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <FolderIcon className="w-4 h-4" /> All Logs
                    <span className="ml-auto text-[10px] opacity-50">{articles.length}</span>
                  </div>
                  
                  {folders.map(folder => {
                    const count = articles.filter(a => a.folderId === folder.id).length;
                    return (
                      <div 
                        key={folder.id}
                        className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors text-sm font-mono \${
                          selectedFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-2 flex-1 truncate"
                          onClick={() => setSelectedFolder(folder.id)}
                        >
                          <FolderIcon className="w-4 h-4 text-cyan-500/70" /> 
                          <span className="truncate">{folder.name}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white/30 group-hover:hidden">{count}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleEditFolder(folder); }} className="text-white/40 hover:text-cyan-400">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }} className="text-white/40 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] opacity-50 group-hover:hidden ml-2">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* Main Content - Articles List */}
            <div className="flex-1">
              <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-xs font-mono text-white/50 uppercase">
                        <th className="p-4">Title / Summary</th>
                        <th className="p-4 w-32">Status</th>
                        <th className="p-4 w-32">Metrics</th>
                        <th className="p-4 w-40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {displayedArticles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-white/30 font-mono">
                            NO_RECORDS_FOUND
                          </td>
                        </tr>
                      ) : (
                        displayedArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4">
                              <div className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                {article.title}
                              </div>
                              <div className="text-xs text-white/40 line-clamp-1">
                                {article.summary}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono border \${
                                article.status === 'published' 
                                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                  : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                              }`}>
                                {article.status === 'published' ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                {article.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-mono text-white/40">
                              <div>V: {article.views}</div>
                              <div>L: {article.likes}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => toggleStatus(article.id, article.status)}
                                  className="p-2 text-white/40 hover:text-white transition-colors"
                                  title={article.status === 'published' ? "Unpublish" : "Publish"}
                                >
                                  {article.status === 'published' ? <AlertTriangle className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                </button>
                                <button 
                                  onClick={() => navigate(`/admin/editor/\${article.id}`)}
                                  className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(article.id, article.title)}
                                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          </div>
        ) : (
          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs font-mono text-white/50 uppercase">
                    <th className="p-4">User ID</th>
                    <th className="p-4 w-32">Role</th>
                    <th className="p-4 w-48">Last Login</th>
                    <th className="p-4 w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/30 font-mono">
                        NO_USERS_FOUND
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4 text-cyan-500" />
                            {user.username}
                          </div>
                          <div className="text-[10px] text-white/30 font-mono mt-1">ID: {user.id}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono border \${
                            user.role === 'admin' 
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                              : 'bg-white/5 border-white/10 text-white/60'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-white/40">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'NEVER'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleResetPassword(user)}
                              className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
                              title="Reset Password"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </PageTransition>
  );
}