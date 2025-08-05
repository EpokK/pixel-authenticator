/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
      },
      colors: {
        'retro': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'pixel': {
          'bg': '#0a0a0f',
          'surface': '#1a1a2e',
          'primary': '#0f1419',
          'secondary': '#1e2328',
          'accent': '#ff2a6d',
          'text': '#e1e5e9',
          'muted': '#7e8993',
          'green': '#01ff89',
          'yellow': '#fff01f',
          'orange': '#ff6800',
          'red': '#ff073a',
          'purple': '#bf15ff',
          'cyan': '#00e5ff',
          'pink': '#ff2a92',
          'blue': '#2196f3',
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-lg': '8px 8px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-inset': 'inset 2px 2px 0px rgba(255, 255, 255, 0.1), inset -2px -2px 0px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'pixel': '0px',
      },
      animation: {
        'pixel-bounce': 'pixelBounce 0.6s ease-in-out infinite alternate',
        'pixel-pulse': 'pixelPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 2s linear infinite',
      },
      keyframes: {
        pixelBounce: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        pixelPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}