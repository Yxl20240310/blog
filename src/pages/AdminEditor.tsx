import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Globe, ArrowLeft, Terminal, Lock, Users, Eye, Folder as FolderIcon } from 'lucide-react';
import { useBlogStore, User } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, folders, addArticle, updateArticle } = useBlogStore();
  
  const isEditing = Boolean(id);
  const existingArticle = isEditing ? articles.find(a => a.id === id) : null;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'restricted'>('public');
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [folderId, setFolderId] = useState<string>('');

  // 获取所有注册用户用于选择
  const allUsers: User[] = JSON.parse(localStorage.getItem('blog_users') || '[]');

  // 初始化编辑数据
  useEffect(() => {
    if (isEditing && existingArticle) {
      setTitle(existingArticle.title);
      setSummary(existingArticle.summary);
      setContent(existingArticle.content);
      setTagsInput(existingArticle.tags.join(', '));
      setVisibility(existingArticle.visibility || 'public');
      setAllowedUsers(existingArticle.allowedUsers || []);
      setFolderId(existingArticle.folderId || '');
    } else if (isEditing && !existingArticle) {
      navigate('/admin'); // 找不到文章返回后台
    }
  }, [isEditing, existingArticle, navigate]);

  const handleSave = (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      alert("Title and Content are required.");
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const articleData = {
      title,
      summary: summary || content.substring(0, 100) + '...',
      content,
      tags,
      status,
      visibility,
      allowedUsers: visibility === 'restricted' ? allowedUsers : undefined,
      folderId: folderId || null,
    };

    if (isEditing && id) {
      updateArticle(id, articleData);
    } else {
      addArticle(articleData);
    }

    navigate('/admin');
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 text-white/40 hover:text-cyan-400 hover:bg-white/5 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-mono text-white flex items-center gap-3">
              <Terminal className="w-6 h-6 text-cyan-500" />
              {isEditing ? 'EDIT_LOG' : 'NEW_LOG'}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSave('draft')}
              className="gap-2"
            >
              <Save className="w-4 h-4" /> SAVE_DRAFT
            </Button>
            <Button 
              onClick={() => handleSave('published')}
              className="gap-2"
            >
              <Globe className="w-4 h-4" /> PUBLISH
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="LOG_TITLE..."
                className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-0 mb-6"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter markdown content here..."
                className="w-full h-[500px] bg-black/30 border border-white/10 rounded-md p-4 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              />
            </GlassCard>
          </div>

          {/* Sidebar Meta */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-mono text-cyan-500 mb-2">SUMMARY</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-500 mb-2">TAGS (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, CSS, Web3..."
                  className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-500 mb-2">DIRECTORY</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderIcon className="w-4 h-4 text-white/40" />
                  </div>
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="">-- Root (No Folder) --</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-500 mb-3">VISIBILITY</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                      className="text-cyan-500 bg-black/50 border-white/20 focus:ring-cyan-500/50 focus:ring-offset-black"
                    />
                    <Eye className="w-4 h-4 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-sm text-white">Public</span>
                      <span className="text-[10px] text-white/40 font-mono">Visible to everyone</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-2 rounded border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="private"
                      checked={visibility === 'private'}
                      onChange={() => setVisibility('private')}
                      className="text-cyan-500 bg-black/50 border-white/20 focus:ring-cyan-500/50 focus:ring-offset-black"
                    />
                    <Lock className="w-4 h-4 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-sm text-white">Private</span>
                      <span className="text-[10px] text-white/40 font-mono">Only visible to you (Admin)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="restricted"
                      checked={visibility === 'restricted'}
                      onChange={() => setVisibility('restricted')}
                      className="text-cyan-500 bg-black/50 border-white/20 focus:ring-cyan-500/50 focus:ring-offset-black"
                    />
                    <Users className="w-4 h-4 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-sm text-white">Restricted</span>
                      <span className="text-[10px] text-white/40 font-mono">Visible to selected users</span>
                    </div>
                  </label>
                </div>
              </div>

              {visibility === 'restricted' && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-md">
                  <label className="block text-[10px] font-mono text-cyan-500 mb-2 uppercase">Select Allowed Users</label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {allUsers.filter(u => u.role !== 'admin').length === 0 ? (
                      <div className="text-xs text-white/40 italic">No registered users found.</div>
                    ) : (
                      allUsers.filter(u => u.role !== 'admin').map(user => (
                        <label key={user.id} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={allowedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAllowedUsers([...allowedUsers, user.id]);
                              } else {
                                setAllowedUsers(allowedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-black"
                          />
                          {user.username}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}