import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Globe, FileText, Settings, AlertTriangle } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function AdminDashboard() {
  const { articles, deleteArticle, updateArticle } = useBlogStore();
  const navigate = useNavigate();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`WARNING: Are you sure you want to delete "\${title}"?\nThis action cannot be undone.`)) {
      deleteArticle(id);
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateArticle(id, { status: newStatus });
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-mono text-white flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-cyan-500" />
              SYSTEM_DASHBOARD
            </h1>
            <p className="text-sm font-mono text-white/40">Manage your data logs and transmissions.</p>
          </div>
          <Button onClick={() => navigate('/admin/editor')} className="gap-2">
            <Plus className="w-4 h-4" /> NEW_LOG
          </Button>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-mono text-white/50 uppercase">
                  <th className="p-4">Title / Summary</th>
                  <th className="p-4 w-32">Status</th>
                  <th className="p-4 w-32">Metrics</th>
                  <th className="p-4 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/30 font-mono">
                      NO_RECORDS_FOUND
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          {article.title}
                        </div>
                        <div className="text-xs text-white/40 line-clamp-1">
                          {article.summary}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono border \${
                          article.status === 'published' 
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                            : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        }`}>
                          {article.status === 'published' ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {article.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-white/40">
                        <div>V: {article.views}</div>
                        <div>L: {article.likes}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleStatus(article.id, article.status)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                            title={article.status === 'published' ? "Unpublish" : "Publish"}
                          >
                            {article.status === 'published' ? <AlertTriangle className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/editor/\${article.id}`)}
                            className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id, article.title)}
                            className="p-2 text-white/40 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}