import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Hash, Calendar, ChevronRight } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { PageTransition } from '../components/PageTransition';
import { cn } from '../utils/cn';

export default function Home() {
  const { articles, searchQuery, selectedTag, setSelectedTag } = useBlogStore();

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => article.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [articles]);

  // Filter and sort articles (only show published articles on home page)
  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => article.status === 'published')
      .filter(article => {
        // 隐藏点踩数超过点赞数 10% 的文章
        const dislikeRatio = article.likes > 0 ? article.dislikes / article.likes : (article.dislikes > 0 ? 1 : 0);
        return dislikeRatio <= 0.1;
      })
      .filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              article.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.likes - a.likes); // Sort by likes descending by default
  }, [articles, searchQuery, selectedTag]);

  return (
    <PageTransition>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Tags & Filters */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="sticky top-24">
            <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Hash className="w-3 h-3" /> System_Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "text-xs font-mono px-3 py-1.5 rounded-none border transition-all duration-300",
                  selectedTag === null 
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                )}
              >
                ALL
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "text-xs font-mono px-3 py-1.5 rounded-none border transition-all duration-300",
                    selectedTag === tag 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Main Content: Article List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-mono text-white/80">
              <span className="text-cyan-500 mr-2">{'>'}</span> 
              {searchQuery ? `Search results for "\${searchQuery}"` : "Top Rated Logs"}
              <span className="animate-pulse ml-1">_</span>
            </h1>
            <span className="text-xs font-mono text-white/40">
              [ {filteredArticles.length} records found ]
            </span>
          </div>

          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <GlassCard className="text-center py-16 border-dashed border-white/20">
                <div className="text-white/30 font-mono">ERR: NO_RECORDS_FOUND</div>
              </GlassCard>
            ) : (
              filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/article/\${article.id}`} className="block h-full">
                    <GlassCard interactive className="group h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {article.title}
                          </h2>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-white/60 mb-6 line-clamp-2">
                          {article.summary}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1.5 text-neon-purple">
                            <Heart className="w-3.5 h-3.5" />
                            {article.likes}
                          </span>
                          <span className="flex items-center gap-1.5 text-cyan-500">
                            <Eye className="w-3.5 h-3.5" />
                            {article.views}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {article.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}