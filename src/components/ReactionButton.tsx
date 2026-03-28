import { useState } from 'react';
import { Heart, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ReactionButtonProps {
  type: 'like' | 'dislike';
  count: number;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function ReactionButton({ type, count, isActive, isDisabled, onClick }: ReactionButtonProps) {
  const [clickEffect, setClickEffect] = useState(false);

  const isLike = type === 'like';
  const Icon = isLike ? Heart : ThumbsDown;
  
  const baseColorClass = isLike ? 'neon-purple' : 'orange-500';
  const glowClass = isLike ? 'shadow-glow-purple' : 'shadow-[0_0_15px_rgba(249,115,22,0.4)]';
  const textGlowClass = isLike ? 'text-glow-purple' : 'text-glow-orange';

  const handleClick = () => {
    if (isDisabled) return;
    setClickEffect(true);
    onClick();
    setTimeout(() => setClickEffect(false), 1000);
  };

  // Particles for the explosion effect
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 360
    };
  });

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        className={clsx(
          "relative flex items-center gap-3 px-8 py-4 rounded-full font-mono text-lg transition-all duration-300 overflow-hidden z-10",
          isActive 
            ? `bg-${baseColorClass}/20 text-${baseColorClass} border border-${baseColorClass} ${glowClass} ${textGlowClass}`
            : isDisabled 
              ? "opacity-40 cursor-not-allowed glass-panel text-gray-500" 
              : `glass-panel text-white hover:border-${baseColorClass}/50 hover:text-${baseColorClass} hover:${glowClass}`
        )}
      >
        {/* Background sweep animation on active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: 0.2 }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-${baseColorClass} to-transparent -z-10 skew-x-12`}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={isActive ? {
            scale: [1, 1.2, 1],
            rotate: isLike ? [0, -10, 10, 0] : [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Icon size={24} className={clsx(isActive && `fill-${baseColorClass}`)} />
        </motion.div>
        
        <span className="relative z-10 font-bold tracking-wider">
          {isLike 
            ? (isActive ? 'SYNCHRONIZED' : 'INITIALIZE_SYNC') 
            : (isActive ? 'CONNECTION_SEVERED' : 'SEVER_CONNECTION')
          } 
          <span className="ml-2 opacity-80">[{count}]</span>
        </span>
      </motion.button>

      {/* Explosion Particles */}
      <AnimatePresence>
        {clickEffect && (
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: particle.scale, 
                  opacity: 0,
                  rotate: particle.rotation
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={clsx(
                  "absolute w-2 h-2 rounded-sm",
                  isLike ? "bg-neon-purple shadow-[0_0_8px_#B026FF]" : "bg-orange-500 shadow-[0_0_8px_#f97316]"
                )}
                style={{
                  clipPath: i % 2 === 0 
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
                    : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' // Square
                }}
              />
            ))}
            
            {/* Expanding Ring */}
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0.8, borderWidth: '4px' }}
              animate={{ width: 150, height: 150, opacity: 0, borderWidth: '0px' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={clsx(
                "absolute rounded-full",
                isLike ? "border-neon-purple" : "border-orange-500"
              )}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}