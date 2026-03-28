import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ThumbsDown, Terminal, User, Clock, Send, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticleById, getCommentsByArticleId, addComment, likeArticle, dislikeArticle, Article, Comment } from '@/lib/mockData';
import clsx from 'clsx';
import ReactionButton from '@/components/ReactionButton';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      if (foundArticle) {
        setArticle(foundArticle);
        setComments(getCommentsByArticleId(id));
      } else {
        // Article not found
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!article) return null;

  const handleLike = () => {
    if (isLiked || isDisliked || !id) return;
    likeArticle(id);
    setArticle(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    setIsLiked(true);
  };

  const handleDislike = () => {
    if (isLiked || isDisliked || !id) return;
    dislikeArticle(id);
    setArticle(prev => prev ? { ...prev, dislikes: (prev.dislikes || 0) + 1 } : null);
    setIsDisliked(true);
  };

  const handleDownload = () => {
    if (!article) return;
    
    // Construct the markdown content
    const content = `# ${article.title}\n\n`
      + `> Date: ${new Date(article.createdAt).toLocaleString()}\n`
      + `> Tags: ${article.tags.join(', ')}\n\n`
      + `${article.summary}\n\n`
      + `---\n\n`
      + `${article.content}`;

    // Create blob and download link
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Clean up filename
    const safeTitle = article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.href = url;
    link.download = `${safeTitle || 'article'}.md`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim() || !username.trim()) return;
    
    const added = addComment({
      articleId: id,
      username: username.trim(),
      text: newComment.trim()
    });
    
    setComments([added, ...comments]);
    setNewComment('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-12 pb-12"
    >
      {/* Navigation Back & Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan font-mono transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          RETURN_TO_PREVIOUS
        </button>
        
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-glow-cyan transition-all font-mono text-sm"
          title="Download Article"
        >
          <Download size={16} />
          EXPORT_DATA
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex gap-3">
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-full text-xs font-mono shadow-glow-cyan">
              #{tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-mono leading-tight text-white">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm font-mono text-gray-500 border-b border-white/10 pb-8">
          <span className="flex items-center gap-2">
            <Clock size={16} />
            {new Date(article.createdAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-2 text-neon-purple">
            <Heart size={16} />
            {article.likes} LIKES
          </span>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-invert prose-lg max-w-none prose-headings:font-mono prose-headings:text-neon-cyan prose-a:text-neon-purple hover:prose-a:text-glow">
        <div className="glass-panel p-8 rounded-2xl whitespace-pre-wrap leading-relaxed text-gray-300">
          {article.content}
        </div>
      </article>

      {/* Interaction Bar */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-12 border-t border-white/10">
        <ReactionButton 
          type="like"
          count={article.likes}
          isActive={isLiked}
          isDisabled={isLiked || isDisliked}
          onClick={handleLike}
        />

        <ReactionButton 
          type="dislike"
          count={article.dislikes || 0}
          isActive={isDisliked}
          isDisabled={isLiked || isDisliked}
          onClick={handleDislike}
        />
      </div>

      {/* Comments Section */}
      <section className="space-y-8 pt-12 border-t border-white/10">
        <div className="flex items-center gap-2 text-neon-cyan font-mono">
          <Terminal size={24} />
          <h2 className="text-2xl font-bold">终端通讯 / COMMENTS ({comments.length})</h2>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="glass-panel rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                required
                placeholder="代号 / NICKNAME"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2 relative">
              <input
                type="text"
                required
                placeholder="输入信息... / ENTER MESSAGE..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="block w-full pl-4 pr-12 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors font-mono text-sm"
              />
              <button 
                type="submit"
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-xl p-5 border-l-2 border-l-neon-cyan/50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-neon-cyan font-bold">{comment.username}</span>
                  <span className="text-xs text-gray-600">@SYS_NODE</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {comment.text}
              </p>
            </motion.div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-mono">
              [ 系统提示：暂无通讯记录 / NO COMMUNICATIONS YET ]
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
