import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllTags } from '../data/mockData';
import { ArrowRight, Flame, Tag as TagIcon, Clock, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';
  const selectedTag = searchParams.get('tag') || '';
  
  const { currentUser, isAdmin } = useStore();

  const storeArticles = useStore(state => state.articles);
  const publishedArticles = useMemo(() => {
    return storeArticles.filter(a => {
      // Must be published
      if (!a.published) return false;
      
      // Visibility Check
      // If admin, can see everything
      if (!isAdmin) {
        if (a.visibility === 'private') {
          return false; // Private is only for admin in this context (or the author, but we assume admin is author)
        }
        
        if (a.visibility === 'partial') {
          // If not logged in, or username not in allowed list
          if (!currentUser || !a.allowedUsers?.includes(currentUser.username)) {
            return false;
          }
        }
      }
      
      // Filter out if dislikes > 10% of likes
      const dislikes = a.dislikes || 0;
      if (a.likes > 0 && dislikes > a.likes * 0.1) {
        return false;
      }
      
      return true;
    });
  }, [storeArticles, currentUser, isAdmin]);
  
  const tags = useMemo(() => {
    const allTags = new Set<string>();
    publishedArticles.forEach(article => {
      article.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  }, [publishedArticles]);

  // 1. Find most liked article
  const topArticle = useMemo(() => {
    if (publishedArticles.length === 0) return null;
    return [...publishedArticles].sort((a, b) => b.likes - a.likes)[0];
  }, [publishedArticles]);

  // 2. Filter articles based on search and tag
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(article => {
      const matchKeyword = article.title.toLowerCase().includes(keyword.toLowerCase()) || 
                           article.excerpt.toLowerCase().includes(keyword.toLowerCase());
      const matchTag = selectedTag ? article.tags.includes(selectedTag) : true;
      return matchKeyword && matchTag;
    });
  }, [publishedArticles, keyword, selectedTag]);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };

  const handleArticleClick = (e: React.MouseEvent, articleId: string) => {
    if (!currentUser && !isAdmin) {
      e.preventDefault();
      alert('请先登录后查看文章详情 / PLEASE LOGIN TO VIEW DETAILS');
      // 可选：直接跳转到登录页
      // window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-20 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none z-[-1]" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Article Hero Section */}
        {topArticle && !keyword && !selectedTag && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple rounded-[2rem] blur opacity-30 animate-pulse"></div>
            <div className="relative bg-cyber-black border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl glass">
              <div className="flex items-center gap-2 text-neon-green mb-4 font-mono text-sm">
                <Flame size={18} className="animate-bounce" />
                <span>热门推荐 / TOP RATED</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {topArticle.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
                {topArticle.excerpt}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {topArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {topArticle.readTime}</span>
                </div>
                <Link 
                  to={`/article/${topArticle.id}`}
                  onClick={(e) => handleArticleClick(e, topArticle.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-full transition-all duration-300 hover:shadow-neon-blue hover:-translate-y-1 font-medium"
                >
                  阅读全文 <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* Filters and List Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <h2 className="text-2xl font-bold font-mono border-l-4 border-neon-purple pl-4">
              {keyword ? `搜索结果: ${keyword}` : '最新发布 / LATEST'}
            </h2>
            
            {/* Tag Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon size={18} className="text-slate-400 mr-2" />
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-all duration-300 ${
                    selectedTag === tag 
                      ? 'border-neon-purple bg-neon-purple/20 text-neon-purple shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Article Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/article/${article.id}`} onClick={(e) => handleArticleClick(e, article.id)} className="block h-full group">
                    <div className="h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-neon-green/50 hover:shadow-neon-green hover:-translate-y-2 flex flex-col glass">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-neon-green transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-6 flex-grow line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50 text-xs text-slate-500 font-mono">
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500" /> {article.likes}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 font-mono">_未找到匹配的文章_</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;