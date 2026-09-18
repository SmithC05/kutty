/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070b14',
        surface: '#0d1424',
        // Keep the existing token names so every scene stays compatible,
        // but shift the visual system from warm gold to cinematic blue.
        primary: {
          light: '#bfdbfe', // blue-200
          DEFAULT: '#2563eb', // blue-600
          dark: '#1d4ed8', // blue-700
        },
        gold: {
          light: '#dbeafe', // blue-100
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1e40af', // blue-800
        },
        aurora: {
          green: '#10b981', // emerald-500
          blue: '#3b82f6', // blue-500
          purple: '#8b5cf6', // violet-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cursive: ['"Alex Brush"', '"Dancing Script"', 'cursive'],
        quote: ['"Playfair Display"', 'serif'],
        numbers: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 15s ease infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}
