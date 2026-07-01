import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('در حال بارگذاری...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const steps = [
      { progress: 20, text: 'بارگذاری تنظیمات...', delay: 400 },
      { progress: 40, text: 'اتصال به API...', delay: 800 },
      { progress: 60, text: 'بررسی احراز هویت...', delay: 1200 },
      { progress: 80, text: 'آماده‌سازی داده‌ها...', delay: 1600 },
      { progress: 100, text: 'آماده!', delay: 2000 },
    ];

    steps.forEach(({ progress: p, text, delay }) => {
      setTimeout(() => {
        setProgress(p);
        setStatusText(text);
      }, delay);
    });

    // Complete after min duration
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, minDuration);
  }, [minDuration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Logo Container */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />

        {/* Main logo circle */}
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-2xl flex items-center justify-center">
          {/* Inner highlight */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent" />

          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-spin-slow" />

          {/* M Letter */}
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <defs>
              <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
              <filter id="splashGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M20 75 L20 25 L35 50 L50 25 L65 50 L80 25 L80 75"
              fill="none"
              stroke="url(#splashGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#splashGlow)"
            />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
          Meta Online Service
        </h1>
        <p className="text-blue-200/80 text-sm">
          خدمات آنلاین میتا
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 z-10">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-blue-200/60 text-xs mt-3">
          {statusText}
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex items-center gap-1 mt-8 z-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default SplashScreen;
