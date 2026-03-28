import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LogIn, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const UserLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { userLogin } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLogin(username, password)) {
      navigate('/');
    } else {
      setError('用户名或密码错误 / INVALID_CREDENTIALS');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-black">
      {/* Background Grid */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none z-[-1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[150px] pointer-events-none z-[-1]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <div className="glass p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyber-black rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <LogIn className="text-neon-blue" size={32} />
          </div>

          <div className="text-center mt-8 mb-10">
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">
              USER_LOGIN
            </h1>
            <p className="text-slate-400 font-mono text-sm">欢迎回来 / Welcome Back</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-mono"
                placeholder="代号 / Username"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-mono tracking-[0.2em]"
                placeholder="密码 / Password"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono text-center mt-2 animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-xl font-bold hover:bg-neon-blue hover:text-white hover:shadow-neon-blue transition-all duration-300 group mt-4"
            >
              建立连接 / CONNECT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-3">
            <Link to="/register" className="text-neon-green hover:text-green-400 font-mono text-sm transition-colors">
              没有账号？去注册 / Create an account
            </Link>
            <Link to="/" className="text-slate-500 hover:text-slate-300 font-mono text-xs transition-colors flex items-center justify-center gap-1">
              <Home size={12} /> 返回首页 / Return to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;