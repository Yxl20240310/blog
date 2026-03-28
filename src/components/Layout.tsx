import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
      <footer className="border-t border-white/10 glass py-8 text-center text-slate-500 font-mono text-sm relative z-10">
        <p>© {new Date().getFullYear()} TECH_LOG. All systems operational.</p>
      </footer>
    </div>
  );
};

export default Layout;