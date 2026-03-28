import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, User, Calendar, Flame } from 'lucide-react';
import { articles } from '../data/mockData';
import { useStore } from '../store/useStore';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);
  
  const { comments, addComment } = useStore();
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

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
    if (!newComment.trim() || !username.trim()) return;

    addComment({
      articleId: article.id,
      username: username,
      content: newComment,
    });

    setNewComment('');
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none z-[-1]" />
      
      {/* Article Header */}
      <div className="w-full border-b border-white/10 bg-slate-900/50 backdrop-blur-md pt-12 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-neon-green transition-colors mb-8 font-mono text-sm">
            <ArrowLeft size={16} /> 返回列表 / BACK
          </Link>
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
              <input
                type="text"
                placeholder="代号 / Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full md:w-1/2 bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="输入你想说的话... / Enter your message..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-cyber-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all min-h-[120px] resize-y"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-neon-purple text-white rounded-lg font-medium hover:bg-purple-500 hover:shadow-neon-purple transition-all duration-300 group"
            >
              发送 / SEND <Send size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
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