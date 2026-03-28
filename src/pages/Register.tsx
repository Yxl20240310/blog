import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Terminal, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerUser } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userLogin = useAppStore(state => state.userLogin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('PASSWORDS_DO_NOT_MATCH');
      return;
    }

    if (password.length < 6) {
      setError('PASSWORD_TOO_WEAK (Min 6 chars)');
      return;
    }

    const result = registerUser(username, password);
    if (result.success && result.user) {
      userLogin(result.user);
      navigate('/');
    } else {
      setError(`REGISTRATION_FAILED: ${result.error}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl border border-neon-purple/30 shadow-glow-purple">
          <div className="flex flex-col items-center justify-center mb-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center border border-neon-purple/50 shadow-glow-purple">
              <ShieldAlert className="text-neon-purple w-8 h-8" />
            </div>
            <h1 className="text-2xl font-mono font-bold text-white text-glow">
              NEW_USER_REGISTRATION
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Create a new identity on the network
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
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono"
                  placeholder="DESIRED_USERNAME"
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
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono"
                  placeholder="SECURE_PASSWORD"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono"
                  placeholder="CONFIRM_PASSWORD"
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
              className="w-full py-3 px-4 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-md font-mono hover:bg-neon-purple hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)]"
            >
              CREATE_IDENTITY
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-400 font-mono border-t border-white/10 pt-6">
            <p>Already registered? <Link to="/login" className="text-neon-purple hover:text-white transition-colors">Login here</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}