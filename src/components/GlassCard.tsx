import React from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  interactive = false,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden",
        interactive && "transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer group",
        className
      )}
      {...props}
    >
      {/* Subtle corner accent for tech vibe */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </div>
  );
};
