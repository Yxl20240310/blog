import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Calendar, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticles, Article } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import clsx from 'clsx';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { searchQuery, selectedTags, toggleTag } = useAppStore();

  useEffect(() => {
    // Load articles on mount
    setArticles(getArticles());
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => {
        const matchesSearch = 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = 
          selectedTags.length === 0 || 
          selectedTags.every(tag => article.tags.includes(tag));
        
        return matchesSearch && matchesTags;
      })
      .sort((a, b) => b.likes - a.likes); // Sort by likes descending
  }, [articles, searchQuery, selectedTags]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple text-glow"
        >
          探索未来科技边界
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          在这里，我们记录关于量子计算、人工智能、Web3以及赛博朋克未来的前沿思考与技术探索。
        </motion.p>
      </section>

      {/* Tags Filter */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neon-cyan font-mono mb-4">
          <Hash size={20} />
          <h2 className="text-xl font-semibold">标签筛选 / TAGS</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {allTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={clsx(
                  "px-4 py-1.5 rounded-full font-mono text-sm border transition-all duration-300",
                  isSelected 
                    ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan"
                    : "bg-black/40 border-white/10 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Articles List */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-neon-purple font-mono mb-6 border-b border-white/10 pb-2">
          <Heart size={20} />
          <h2 className="text-xl font-semibold">热门文章 / POPULAR</h2>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-xl">
            <p className="text-gray-500 font-mono">未找到匹配的文章 / NO RESULTS FOUND</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Link to={`/article/${article.id}`} className="block group">
                  <article className="glass-panel glass-panel-hover rounded-xl p-6 relative overflow-hidden">
                    {/* Decorative side accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold font-mono text-white group-hover:text-neon-cyan transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center gap-6 pt-4 text-xs font-mono text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-neon-purple">
                            <Heart size={14} className="fill-neon-purple/20" />
                            {article.likes} LIKES
                          </span>
                          <div className="flex gap-2">
                            {article.tags.map(tag => (
                              <span key={tag} className="text-neon-cyan/70">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/50 transition-all text-gray-400 group-hover:text-neon-cyan group-hover:shadow-glow-cyan shrink-0">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
