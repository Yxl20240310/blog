import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Globe, ArrowLeft, Terminal } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle } = useBlogStore();
  
  const isEditing = Boolean(id);
  const existingArticle = isEditing ? articles.find(a => a.id === id) : null;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // 初始化编辑数据
  useEffect(() => {
    if (isEditing && existingArticle) {
      setTitle(existingArticle.title);
      setSummary(existingArticle.summary);
      setContent(existingArticle.content);
      setTagsInput(existingArticle.tags.join(', '));
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
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}