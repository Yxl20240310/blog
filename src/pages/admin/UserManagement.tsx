import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { KeyRound, Trash2, Users } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { users, resetUserPassword, deleteUser } = useStore();

  const handleResetPassword = (id: string, username: string) => {
    if (window.confirm(`确定要重置用户 "${username}" 的密码吗？\n重置后密码将变为: password123`)) {
      resetUserPassword(id);
      alert(`用户 "${username}" 密码已重置为: password123`);
    }
  };

  const handleDelete = (id: string, username: string) => {
    if (window.confirm(`确定要删除用户 "${username}" 吗？此操作不可恢复。`)) {
      deleteUser(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '从未登录 / NEVER';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-mono text-white flex items-center gap-3">
          <Users className="text-neon-blue" size={32} /> 
          用户管理 / USERS
        </h1>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-sm bg-white/5">
                <th className="p-4 font-medium">代号 / USERNAME</th>
                <th className="p-4 font-medium">注册时间 / CREATED</th>
                <th className="p-4 font-medium">最后登录 / LAST_LOGIN</th>
                <th className="p-4 font-medium text-right">操作 / ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-mono">
                    暂无用户数据_
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-neon-blue font-mono flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs border border-slate-700">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        {user.username}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">
                      {formatDate(user.lastLoginTime)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleResetPassword(user.id, user.username)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-neon-purple hover:bg-neon-purple/10 border border-slate-700 hover:border-neon-purple/50 rounded transition-all text-xs font-mono"
                          title="重置密码"
                        >
                          <KeyRound size={14} /> 重置
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.username)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="删除用户"
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

export default UserManagement;