import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-mono tracking-wider transition-all duration-300 relative overflow-hidden focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    outline: "bg-transparent border border-white/20 text-white/80 hover:border-white/50 hover:text-white",
    ghost: "bg-transparent text-white/60 hover:text-cyan-400 hover:bg-white/5",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-cyan-500/20 translate-y-full hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </button>
  );
};
