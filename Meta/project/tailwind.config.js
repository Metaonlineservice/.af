/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      vazir: ['Vazirmatn', 'sans-serif'],
    },
    extend: {
      colors: {
        gold: {
          50: '#fffbe6',
          100: '#fef3cd',
          200: '#fce29a',
          300: '#f5d67a',
          400: '#d4af37',
          500: '#c5a028',
          600: '#b8960f',
          700: '#997a08',
          800: '#7a5f07',
          900: '#5c4705',
        },
        slate: {
          850: '#1a2234',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'zoom-pulse': 'zoomPulse 1.8s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'pingSlow 2s cubic-bezier(0,0,0.2,1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'chat-bounce': 'chatBounce 1s ease-in-out 3',
        'header-wave': 'headerWave 4s ease-in-out infinite',
        'particle': 'particle 3s ease-in-out infinite',
        'typing': 'typing 1.5s steps(3) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        zoomPulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37,211,102,0.5)' },
          '50%': { transform: 'scale(1.15)', boxShadow: '0 0 0 12px rgba(37,211,102,0)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pingSlow: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.3)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chatBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        headerWave: {
          '0%, 100%': { transform: 'translateY(0) scaleX(1)' },
          '50%': { transform: 'translateY(-4px) scaleX(1.05)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px) translateX(20px)', opacity: '0' },
        },
        typing: {
          '0%': { content: '""' },
          '33%': { content: '"."' },
          '66%': { content: '".."' },
          '100%': { content: '"..."' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
