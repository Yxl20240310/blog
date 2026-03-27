import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Terminal, AlertTriangle, UserPlus } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useBlogStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('ERR_MISMATCH: Passwords do not match');
      return;
    }

    if (username.trim() === '' || username.length < 3) {
      setError('ERR_INVALID: ID must be at least 3 characters');
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('blog_users') || '[]');
    const existingUser = users.find((u: any) => u.username === username);
    
    if (existingUser || username === 'admin') {
      setError('ERR_CONFLICT: ID already exists');
      return;
    }

    // Proceed with registration
    register({
      id: `u_\${Date.now()}`,
      username,
      password,
      role: 'user',
    });

    alert('REGISTRATION SUCCESSFUL. Please login.');
    navigate('/login');
  };

  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center">
        <GlassCard className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-mono text-white tracking-widest">INITIATE_USER</h1>
            <p className="text-xs font-mono text-white/40 mt-2">CREATE NEW CREDENTIALS</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> NEW_ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-colors"
                placeholder="Choose your ID..."
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

            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> CONFIRM_PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-colors"
                placeholder="Re-enter password..."
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 mt-4 text-lg">
              REGISTER_NOW
            </Button>
            
            <div className="text-center mt-6">
              <Link to="/login" className="text-xs font-mono text-cyan-500 hover:text-cyan-300 transition-colors border-b border-transparent hover:border-cyan-500 pb-0.5">
                ALREADY_HAVE_ACCESS? LOGIN
              </Link>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
}