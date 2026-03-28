import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Terminal, Type, Hash, FileText, AlignLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticleById, addArticle, updateArticle, ArticleVisibility } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<ArticleVisibility>('public');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      const article = getArticleById(id);
      if (article) {
        setTitle(article.title);
        setSummary(article.summary);
        setContent(article.content);
        setTagsInput(article.tags.join(', '));
        setVisibility(article.visibility || 'public');
      } else {
        navigate('/admin');
      }
    }
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !summary.trim()) return;

    setIsSaving(true);
    
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const articleData = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      tags,
      visibility
    };

    setTimeout(() => {
      if (id) {
        updateArticle(id, articleData);
      } else {
        addArticle(articleData);
      }
      setIsSaving(false);
      navigate('/admin');
    }, 500); // Simulate network request
  };

  if (!isAuthenticated) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3 text-neon-purple">
            <Terminal size={28} />
            <div>
              <h1 className="text-3xl font-bold font-mono text-glow">
                {id ? 'EDIT_NODE' : 'CREATE_NODE'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 rounded-xl space-y-6">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-neon-cyan flex items-center gap-2">
              <Type size={16} />
              TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all text-xl font-bold"
              placeholder="Enter article title..."
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-neon-cyan flex items-center gap-2">
              <AlignLeft size={16} />
              SUMMARY
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="block w-full px-4 py-3 border border-white/10 rounded-md bg-black/50 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all resize-none"
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* Tags and Visibility in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-neon-cyan flex items-center gap-2">
                <Hash size={16} />
                TAGS (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="block w-full px-4 py-3 border border-white/10 rounded-md bg-black/50 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono text-sm"
                placeholder="e.g. Technology, Web3, AI"
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <label className="text-sm font-mono text-neon-cyan flex items-center gap-2">
                <Eye size={16} />
                VISIBILITY
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ArticleVisibility)}
                className="block w-full px-4 py-3 border border-white/10 rounded-md bg-black/50 text-gray-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono text-sm"
              >
                <option value="public">PUBLIC (Everyone)</option>
                <option value="restricted">RESTRICTED (Logged-in only)</option>
                <option value="private">PRIVATE (Admin only)</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-neon-cyan flex items-center gap-2">
              <FileText size={16} />
              CONTENT (Markdown supported)
            </label>
            <textarea
              required
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full px-4 py-4 border border-white/10 rounded-md bg-black/50 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono leading-relaxed"
              placeholder="Write your content here..."
            />
          </div>

        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-md font-mono text-gray-400 border border-white/10 hover:bg-white/5 transition-all"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-md font-mono hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? 'SAVING...' : 'COMMIT_CHANGES'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
