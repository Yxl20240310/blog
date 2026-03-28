import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userLogin = useAppStore(state => state.userLogin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = loginUser(username, password);
    if (result.success && result.user) {
      userLogin(result.user);
      navigate('/');
    } else {
      setError(`ACCESS_DENIED: ${result.error}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl border border-neon-cyan/30 shadow-glow-cyan">
          <div className="flex flex-col items-center justify-center mb-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/50 shadow-glow-cyan">
              <Terminal className="text-neon-cyan w-8 h-8" />
            </div>
            <h1 className="text-2xl font-mono font-bold text-white text-glow">
              USER_LOGIN
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Enter your credentials to access the network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono"
                  placeholder="USERNAME"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono"
                  placeholder="PASSWORD"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm font-mono mt-2 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-md font-mono hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
            >
              INITIALIZE_SESSION
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-400 font-mono border-t border-white/10 pt-6">
            <p>Don't have an account? <Link to="/register" className="text-neon-cyan hover:text-white transition-colors">Register here</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}