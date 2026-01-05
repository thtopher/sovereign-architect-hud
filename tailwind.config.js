/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark fantasy game theme - improved contrast
        'game-dark': '#0f1419',
        'game-darker': '#0a0e14',
        'game-panel': '#1c2333',
        'game-border': '#3d4663',
        'game-gold': '#f4d03f',
        'game-red': '#ef4444',
        'game-green': '#22c55e',
        'game-blue': '#3b82f6',
        'game-purple': '#a855f7',
        'stat-s-plus': '#ff6b6b',
        'stat-s': '#ff8c42',
        'stat-a-plus': '#ffd93d',
        'stat-a': '#6bcf7f',
        'stat-c': '#95a5a6',
      },
      fontFamily: {
        'game': ['"Cinzel"', 'serif'],
        'mono': ['"Courier New"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
