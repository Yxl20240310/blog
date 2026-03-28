import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, User, Calendar, Flame, ThumbsDown, Download } from 'lucide-react';
import { useStore } from '../store/useStore';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { articles, comments, addComment, likeArticle, dislikeArticle, currentUser, isAdmin } = useStore();
  
  const article = articles.find(a => {
    if (a.id !== id) return false;
    
    // Admin bypasses checks
    if (isAdmin) return true;
    
    if (!a.published) return false;
    if (a.visibility === 'private') return false;
    if (a.visibility === 'partial') {
      if (!currentUser || !a.allowedUsers?.includes(currentUser.username)) return false;
    }
    
    return true;
  });
  
  const [newComment, setNewComment] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState<'like' | 'dislike' | null>(null);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-mono text-neon-purple mb-4">404_NOT_FOUND</h2>
          <Link to="/" className="text-neon-blue hover:underline">返回首页 / RETURN_HOME</Link>
        </div>
      </div>
    );
  }

  const articleComments = comments.filter(c => c.articleId === id);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || (!currentUser && !isAdmin)) return;

    addComment({
      articleId: article.id,
      username: isAdmin ? 'Admin' : currentUser!.username,
      content: newComment,
    });

    setNewComment('');
  };

  const triggerParticles = (e: React.MouseEvent, type: 'like' | 'dislike') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      color: type === 'like' ? '#10B981' : '#EF4444' // neon-green or neon-red
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleLike = (e: React.MouseEvent) => {
    if (hasVoted) return;
    likeArticle(article.id);
    setHasVoted(true);
    setVoteType('like');
    triggerParticles(e, 'like');
  };

  const handleDislike = (e: React.MouseEvent) => {
    if (hasVoted) return;
    dislikeArticle(article.id);
    setHasVoted(true);
    setVoteType('dislike');
    triggerParticles(e, 'dislike');
  };

  const handleDownload = () => {
    // 构建 Markdown 内容
    const markdownContent = `
# ${article.title}

> ${article.excerpt}

**作者:** ${article.author}  
**日期:** ${article.date}  
**标签:** ${article.tags.join(', ')}

---

${article.content}
    `.trim();

    // 创建 Blob 和下载链接
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title}.md`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none z-[-1]" />
      
      {/* Article Header */}
      <div className="w-full border-b border-white/10 bg-slate-900/50 backdrop-blur-md pt-12 pb-8 px-4">
        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-neon-green transition-colors font-mono text-sm">
              <ArrowLeft size={16} /> 返回列表 / BACK
            </Link>
            
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded hover:bg-neon-blue/20 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all text-xs font-mono group"
              title="下载 Markdown 源码"
            >
              <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              下载文章 / DL
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-400 font-mono">
            <span className="flex items-center gap-2"><User size={16} /> {article.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> {article.date}</span>
            <span className="flex items-center gap-2 text-neon-green"><Flame size={16} /> {article.likes} Likes</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-neon-blue prose-pre:bg-cyber-black prose-pre:border prose-pre:border-slate-800"
        >
          {/* A simple way to render markdown text, since we don't have a markdown parser, we just use split */}
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-l-4 border-neon-blue pl-4">{paragraph.replace('## ', '')}</h2>;
            } else if (paragraph.startsWith('```')) {
              const code = paragraph.split('\n').slice(1, -1).join('\n');
              return (
                <div key={index} className="relative group my-6">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <pre className="relative bg-cyber-black p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    <code className="font-mono text-sm text-neon-green">{code}</code>
                  </pre>
                </div>
              );
            } else if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 my-4 text-slate-300">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^-\s|^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}</li>
                  ))}
                </ul>
              );
            } else {
              return <p key={index} className="text-slate-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-800 text-neon-purple px-1.5 py-0.5 rounded text-sm">$1</code>') }} />;
            }
          })}
        </motion.article>

        {/* Voting Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex items-center justify-center gap-6 relative"
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                opacity: 1, 
                x: 0, 
                y: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: 0,
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                scale: 0
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`
              }}
            />
          ))}

          <motion.button
            onClick={handleLike}
            disabled={hasVoted}
            whileHover={!hasVoted ? { scale: 1.05 } : {}}
            whileTap={!hasVoted ? { scale: 0.95 } : {}}
            animate={voteType === 'like' ? {
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            } : {}}
            className={`relative flex items-center gap-2 px-8 py-4 rounded-full font-mono transition-all duration-300 overflow-hidden ${
              hasVoted && voteType !== 'like'
                ? 'bg-slate-800/50 text-slate-600 border border-slate-700/50 cursor-not-allowed' 
                : voteType === 'like'
                  ? 'bg-neon-green/20 text-neon-green border-2 border-neon-green shadow-neon-green z-10'
                  : 'bg-slate-900 text-neon-green border border-neon-green/30 hover:bg-neon-green/10 hover:border-neon-green/80 hover:shadow-neon-green group'
            }`}
          >
            {voteType === 'like' && (
              <span className="absolute inset-0 bg-neon-green opacity-20 animate-ping-fast rounded-full" />
            )}
            <Flame 
              size={24} 
              className={voteType === 'like' ? 'fill-neon-green animate-pulse' : 'group-hover:animate-bounce'} 
            />
            <span className="text-lg font-bold">{article.likes}</span>
          </motion.button>
          
          <motion.button
            onClick={handleDislike}
            disabled={hasVoted}
            whileHover={!hasVoted ? { scale: 1.05 } : {}}
            whileTap={!hasVoted ? { scale: 0.95 } : {}}
            animate={voteType === 'dislike' ? {
              scale: [1, 1.2, 1],
              x: [0, -5, 5, -5, 0],
              transition: { duration: 0.4 }
            } : {}}
            className={`relative flex items-center gap-2 px-8 py-4 rounded-full font-mono transition-all duration-300 overflow-hidden ${
              hasVoted && voteType !== 'dislike'
                ? 'bg-slate-800/50 text-slate-600 border border-slate-700/50 cursor-not-allowed' 
                : voteType === 'dislike'
                  ? 'bg-neon-red/20 text-neon-red border-2 border-neon-red shadow-neon-red z-10 animate-glitch'
                  : 'bg-slate-900 text-neon-red border border-neon-red/30 hover:bg-neon-red/10 hover:border-neon-red/80 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] group'
            }`}
          >
            {voteType === 'dislike' && (
              <span className="absolute inset-0 bg-neon-red opacity-20 animate-ping-fast rounded-full" />
            )}
            <ThumbsDown 
              size={24} 
              className={voteType === 'dislike' ? 'fill-neon-red' : 'group-hover:-translate-y-1 transition-transform'} 
            />
            <span className="text-lg font-bold">{article.dislikes || 0}</span>
          </motion.button>
        </motion.div>

        {/* Comments Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-white/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-neon-purple" size={24} />
            <h3 className="text-2xl font-bold font-mono">互动评论 / COMMENTS ({articleComments.length})</h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-12 glass p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="mb-4">
              <textarea
                placeholder="输入你想说的话... / Enter your message..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all min-h-[120px] resize-y"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-400">
                以 <span className="text-neon-blue">{isAdmin ? 'Admin' : currentUser?.username}</span> 的身份留言
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-neon-purple text-white rounded-lg font-medium hover:bg-purple-500 hover:shadow-neon-purple transition-all duration-300 group"
              >
                发送 / SEND <Send size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {articleComments.length > 0 ? (
              articleComments.map((comment) => (
                <div key={comment.id} className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-neon-blue font-mono flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                      {comment.username}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{comment.date}</span>
                  </div>
                  <p className="text-slate-300 pl-10 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 font-mono">
                暂无评论，快来抢沙发吧_
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ArticleDetail;