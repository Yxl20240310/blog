import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { articles, deleteArticle, updateArticle } = useStore();

  const togglePublish = (id: string, currentStatus: boolean) => {
    updateArticle(id, { published: !currentStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      deleteArticle(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-mono text-white">仪表盘 / DASHBOARD</h1>
        <Link 
          to="/admin/editor" 
          className="flex items-center gap-2 px-4 py-2 bg-neon-green/20 border border-neon-green/50 text-neon-green rounded-lg hover:bg-neon-green hover:text-cyber-black transition-all font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <Plus size={18} /> 新建文章
        </Link>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-sm bg-white/5">
                <th className="p-4 font-medium">标题 / TITLE</th>
                <th className="p-4 font-medium">状态 / STATUS</th>
                <th className="p-4 font-medium">日期 / DATE</th>
                <th className="p-4 font-medium">点赞 / LIKES</th>
                <th className="p-4 font-medium text-right">操作 / ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    暂无文章数据_
                  </td>
                </tr>
              ) : (
                articles.map((article, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={article.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-slate-200 line-clamp-1" title={article.title}>
                        {article.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{article.excerpt}</div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => togglePublish(article.id, article.published)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                          article.published 
                            ? 'bg-neon-green/10 text-neon-green border-neon-green/30 hover:bg-neon-green/20' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {article.published ? <><Eye size={12} /> 已发布</> : <><EyeOff size={12} /> 草稿</>}
                      </button>
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{article.date}</td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{article.likes}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/editor/${article.id}`}
                          className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;