import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Save, ArrowLeft, Tag as TagIcon, Layout, Globe, Lock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Editor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle } = useStore();
  
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    author: 'Admin',
    readTime: '5 min read',
    published: false,
    visibility: 'public' as 'public' | 'private' | 'partial',
    allowedUsers: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const article = articles.find(a => a.id === id);
      if (article) {
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          tags: article.tags.join(', '),
          author: article.author,
          readTime: article.readTime,
          published: article.published,
          visibility: article.visibility || 'public',
          allowedUsers: article.allowedUsers ? article.allowedUsers.join(', ') : ''
        });
      }
    }
  }, [id, isEditing, articles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const allowedUsersArray = formData.allowedUsers.split(',').map(u => u.trim()).filter(Boolean);
    
    const articleData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: tagsArray,
      author: formData.author,
      readTime: formData.readTime,
      published: formData.published,
      visibility: formData.visibility,
      allowedUsers: allowedUsersArray
    };

    if (isEditing && id) {
      updateArticle(id, articleData);
    } else {
      addArticle(articleData);
    }
    
    navigate('/admin');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold font-mono text-white">
            {isEditing ? '编辑文章 / EDIT_POST' : '新建文章 / NEW_POST'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-mono text-slate-400 mb-2">标题 / TITLE</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
              placeholder="输入文章标题..."
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-mono text-slate-400 mb-2">摘要 / EXCERPT</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all resize-none"
              placeholder="输入文章摘要..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-mono text-slate-400 mb-2 flex items-center gap-2">
                <TagIcon size={14} /> 标签 / TAGS (逗号分隔)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                placeholder="React, Frontend, Cyberpunk..."
              />
            </div>
            
            {/* Publish Status */}
            <div>
              <label className="block text-sm font-mono text-slate-400 mb-2 flex items-center gap-2">
                <Layout size={14} /> 状态 / STATUS
              </label>
              <div className="flex items-center h-[50px] bg-cyber-black border border-slate-700 rounded-lg px-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="w-5 h-5 accent-neon-green bg-slate-800 border-slate-700 rounded focus:ring-neon-green"
                  />
                  <span className="text-slate-300 font-mono text-sm">
                    {formData.published ? '立即发布 / PUBLISHED' : '存为草稿 / DRAFT'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visibility */}
            <div>
              <label className="block text-sm font-mono text-slate-400 mb-2 flex items-center gap-2">
                <Globe size={14} /> 可见度 / VISIBILITY
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-slate-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={handleChange}
                    className="accent-neon-blue"
                  />
                  <Globe size={14} className="text-neon-blue" /> 全局可见
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-slate-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={handleChange}
                    className="accent-neon-red"
                  />
                  <Lock size={14} className="text-neon-red" /> 仅自己
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-slate-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="partial"
                    checked={formData.visibility === 'partial'}
                    onChange={handleChange}
                    className="accent-neon-purple"
                  />
                  <Users size={14} className="text-neon-purple" /> 部分可见
                </label>
              </div>
            </div>

            {/* Allowed Users */}
            {formData.visibility === 'partial' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-mono text-slate-400 mb-2 flex items-center gap-2">
                  <Users size={14} /> 允许用户 / ALLOWED USERS (逗号分隔代号)
                </label>
                <input
                  type="text"
                  name="allowedUsers"
                  value={formData.allowedUsers}
                  onChange={handleChange}
                  className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                  placeholder="user1, user2..."
                />
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-mono text-slate-400 mb-2">正文 / CONTENT (支持 Markdown)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
              placeholder="## 引言..."
              required
            />
          </div>
          
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-lg text-slate-300 hover:bg-white/5 transition-colors font-mono"
          >
            取消 / CANCEL
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-lg font-bold hover:bg-neon-blue hover:text-white hover:shadow-neon-blue transition-all duration-300"
          >
            <Save size={18} /> 保存 / SAVE
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Editor;