import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Terminal, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('授权拒绝 / ACCESS_DENIED');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none z-[-1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[150px] pointer-events-none z-[-1]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyber-black rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Lock className="text-neon-purple" size={32} />
          </div>

          <div className="text-center mt-8 mb-10">
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">
              SYSTEM_LOGIN
            </h1>
            <p className="text-slate-400 font-mono text-sm">请输入管理员密码 / Enter Admin Password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white text-center tracking-[0.5em] focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs font-mono text-center mt-3 animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neon-purple/20 border border-neon-purple/50 text-neon-purple rounded-xl font-bold hover:bg-neon-purple hover:text-white hover:shadow-neon-purple transition-all duration-300 group"
            >
              验证身份 / AUTHENTICATE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-slate-500 hover:text-slate-300 font-mono text-xs transition-colors flex items-center justify-center gap-1">
              <Terminal size={12} /> 返回前台 / Return to Frontend
            </Link>
          </div>
          
          <div className="mt-4 text-center text-slate-600 text-xs font-mono">
            提示: 密码是 admin123
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;