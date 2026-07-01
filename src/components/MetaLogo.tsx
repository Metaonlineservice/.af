import React from 'react';

interface MetaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'w-8 h-8', text: 'text-sm', letter: 'text-lg' },
  md: { container: 'w-12 h-12', text: 'text-base', letter: 'text-2xl' },
  lg: { container: 'w-20 h-20', text: 'text-xl', letter: 'text-4xl' },
  xl: { container: 'w-32 h-32', text: 'text-2xl', letter: 'text-6xl' },
};

export function MetaLogo({ size = 'md', animated = false, showText = true, className = '' }: MetaLogoProps) {
  const sizes = SIZE_MAP[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizes.container} relative flex items-center justify-center`}>
        {/* Background gradient circle */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg ${animated ? 'animate-pulse' : ''}`}
        />

        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

        {/* M Letter */}
        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-20 h-20'}`}
          >
            {/* M shape with gradient */}
            <defs>
              <linearGradient id="metaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stylized M */}
            <path
              d="M20 75 L20 25 L35 50 L50 25 L65 50 L80 25 L80 75"
              fill="none"
              stroke="url(#metaGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Left vertical stroke */}
            <path
              d="M20 75 L20 25"
              fill="none"
              stroke="url(#metaGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Right vertical stroke */}
            <path
              d="M80 75 L80 25"
              fill="none"
              stroke="url(#metaGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </svg>
        </div>

        {/* Animated ring for splash */}
        {animated && (
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow" />
        )}
      </div>

      {showText && (
        <div className="mt-2 text-center">
          <p className={`font-bold text-slate-900 dark:text-white ${sizes.text}`}>
            Meta
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Online Service
          </p>
        </div>
      )}
    </div>
  );
}

// SVG-only version for favicon/icon use
export function MetaLogoSVG({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="metaGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#metaGradIcon)" />
      <path
        d="M20 75 L20 25 L35 50 L50 25 L65 50 L80 25 L80 75"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Compact logo for headers
export function MetaLogoCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 relative flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-md">
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          <path
            d="M20 75 L20 25 L35 50 L50 25 L65 50 L80 25 L80 75"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="hidden sm:block">
        <p className="font-bold text-slate-900 dark:text-white text-sm leading-none">Meta</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">Online Service</p>
      </div>
    </div>
  );
}

export default MetaLogo;
