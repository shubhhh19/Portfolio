/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          terminal: {
            dark: '#0a0a0b',
            darker: '#000000',
            header: '#1a1a1b',
            green: '#00ff88',
            blue: '#0066ff',
            purple: '#6600ff',
            yellow: '#ffff00',
            red: '#ff3366',
            text: '#e5e5e7',
            dim: '#9ca3af',
          },
          glass: {
            bg: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.1)',
          }
        },
        fontFamily: {
          mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
        },
        backdropBlur: {
          'glass': '12px',
          'glass-strong': '20px',
          'glass-light': '8px',
        },
        animation: {
          'blink': 'blink 1s infinite',
          'float': 'float 6s ease-in-out infinite',
          'loading-dots': 'loading-dots 1.4s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'marquee': 'marquee 20s linear infinite',
        },
        keyframes: {
          blink: {
            '0%, 50%': { opacity: '1' },
            '51%, 100%': { opacity: '0' },
          },
          float: {
            '0%, 100%': { 
              transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' 
            },
            '50%': { 
              transform: 'translateY(-10px) rotateX(5deg) rotateY(5deg)' 
            },
          },
          glow: {
            '0%': { 
              boxShadow: '0 0 5px rgba(0, 255, 136, 0.5)' 
            },
            '100%': { 
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.8)' 
            },
          },
          marquee: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'terminal-pattern': 'linear-gradient(90deg, rgba(0,255,136,0.05) 0%, transparent 50%, rgba(0,255,136,0.05) 100%)',
        },
        boxShadow: {
          'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          'glass-strong': '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          'terminal': '0 0 20px rgba(0, 255, 136, 0.3)',
          'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
          'glow-blue': '0 0 20px rgba(0, 102, 255, 0.5)',
        },
        transitionTimingFunction: {
          'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
      },
    },
    plugins: [],
  };