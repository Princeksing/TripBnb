/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF385C',
          'pink-dark': '#E31C5F',
          dark: '#222222',
          gray: '#717171',
          light: '#F7F7F7',
          border: '#DDDDDD',
          muted: '#B0B0B0',
        },
      },
      fontFamily: {
        sans: [
          'Circular',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 6px 16px rgba(0, 0, 0, 0.12)',
        search: '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
        nav: '0 1px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
