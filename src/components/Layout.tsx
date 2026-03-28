import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showSearch={isHome} />
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 glass py-8 text-center text-slate-500 font-mono text-sm relative z-10 flex flex-col items-center gap-2">
        <p>© {new Date().getFullYear()} TECH_LOG. All systems operational.</p>
        <Link to="/admin" className="hover:text-neon-purple transition-colors text-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span>
          进入控制台 / Admin Panel
        </Link>
      </footer>
    </div>
  );
};

export default Layout;