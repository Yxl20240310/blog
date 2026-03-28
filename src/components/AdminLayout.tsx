import React from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Terminal, LogOut, LayoutDashboard, FileText, Users, Folder } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAdmin, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-cyber-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 glass flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="text-neon-purple group-hover:text-neon-blue transition-colors duration-300" size={24} />
            <span className="font-mono font-bold text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              ADMIN_PANEL
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono ${
              isActive('/admin') 
                ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-neon-purple'
            }`}
          >
            <LayoutDashboard size={18} /> 仪表盘 / Dashboard
          </Link>
          <Link 
            to="/admin/editor" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono ${
              isActive('/admin/editor') 
                ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-neon-green'
            }`}
          >
            <FileText size={18} /> 新建文章 / New Post
          </Link>
          <Link 
            to="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono ${
              isActive('/admin/users') 
                ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-neon-blue'
            }`}
          >
            <Users size={18} /> 用户管理 / Users
          </Link>
          <Link 
            to="/admin/folders" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono ${
              isActive('/admin/folders') 
                ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-neon-purple'
            }`}
          >
            <Folder size={18} /> 分类管理 / Folders
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-mono"
          >
            <LogOut size={18} /> 退出登录 / Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Background Grid */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none z-[-1]" />
        
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;