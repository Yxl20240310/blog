import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Eye, Heart, MessageSquare, Send } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, comments, addComment } = useBlogStore();
  
  const article = articles.find(a => a.id === id);
  const articleComments = comments.filter(c => c.articleId === id);

  const [newComment, setNewComment] = useState('');

  if (!article) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-4xl font-mono text-cyan-500 mb-4">404</h1>
          <p className="text-white/60 mb-8 font-mono">ERR: LOG_NOT_FOUND</p>
          <Button onClick={() => navigate('/')}>RETURN_TO_BASE</Button>
        </div>
      </PageTransition>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const { currentUser } = useBlogStore.getState();
    
    addComment({
      articleId: article.id,
      author: currentUser?.username || 'Anonymous_Geek',
      content: newComment.trim(),
    });
    
    setNewComment('');
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto pb-20">
        {/* Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-mono text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          [ BACK_TO_MAIN ]
        </Link>

        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-white/40 border-y border-white/10 py-4">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-2 text-cyan-500">
              <Eye className="w-4 h-4" />
              {article.views} VIEWS
            </span>
            <span className="flex items-center gap-2 text-neon-purple">
              <Heart className="w-4 h-4" />
              {article.likes} LIKES
            </span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-cyan max-w-none mb-16 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/60">
              #{tag}
            </span>
          ))}
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h3 className="text-2xl font-mono text-white flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-cyan-500" />
            COMMUNICATIONS
            <span className="text-sm text-white/40 ml-auto">[{articleComments.length} MESSAGES]</span>
          </h3>

          <GlassCard className="p-6">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="ENTER_YOUR_MESSAGE..."
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                  TRANSMIT <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </GlassCard>

          <div className="space-y-4">
            {articleComments.map((comment, index) => (
              <GlassCard key={comment.id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-mono text-cyan-400 text-sm">
                    @{comment.author}
                  </div>
                  <div className="text-xs font-mono text-white/30">
                    {new Date(comment.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}