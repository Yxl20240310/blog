import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UserPlus, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const UserRegister: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { registerUser, userLogin } = useStore();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致 / PASSWORDS_DO_NOT_MATCH');
      return;
    }

    if (username.length < 3) {
      setError('用户名至少需要3个字符 / USERNAME_TOO_SHORT');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符 / PASSWORD_TOO_SHORT');
      return;
    }

    const success = registerUser({ username, password });
    
    if (success) {
      // 注册成功后自动登录
      userLogin(username, password);
      navigate('/');
    } else {
      setError('用户名已被占用 / USERNAME_ALREADY_EXISTS');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-black">
      {/* Background Grid */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none z-[-1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[150px] pointer-events-none z-[-1]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <div className="glass p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyber-black rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <UserPlus className="text-neon-green" size={32} />
          </div>

          <div className="text-center mt-8 mb-10">
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">
              USER_REGISTER
            </h1>
            <p className="text-slate-400 font-mono text-sm">注册新账号 / Create New Account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all font-mono"
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
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all font-mono tracking-[0.2em]"
                placeholder="密码 / Password"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all font-mono tracking-[0.2em]"
                placeholder="确认密码 / Confirm Password"
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
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neon-green/20 border border-neon-green/50 text-neon-green rounded-xl font-bold hover:bg-neon-green hover:text-cyber-black hover:shadow-neon-green transition-all duration-300 group mt-4"
            >
              初始化协议 / INITIALIZE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-3">
            <Link to="/login" className="text-neon-blue hover:text-blue-400 font-mono text-sm transition-colors">
              已有账号？去登录 / Already have an account?
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

export default UserRegister;