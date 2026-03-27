import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Terminal, AlertTriangle } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, isAdmin } = useBlogStore();

  // 如果已经登录，直接跳转后台
  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 简单的硬编码演示，实际项目应调用后端 API
    if (username === 'admin' && password === 'admin123') {
      login();
      navigate('/admin');
    } else {
      setError('AUTH_FAILED: Invalid credentials');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <GlassCard className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-mono text-white tracking-widest">SYSTEM_LOGIN</h1>
            <p className="text-xs font-mono text-white/40 mt-2">ADMINISTRATOR ACCESS ONLY</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> USER_ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-colors"
                placeholder="Enter admin ID..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-4 text-lg">
              AUTHENTICATE
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-[10px] font-mono text-white/20">
                HINT: ID=admin, PWD=admin123
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
}