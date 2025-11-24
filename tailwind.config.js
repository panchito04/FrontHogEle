// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { 
            transform: 'translate(-50%, 100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translate(-50%, 0)',
            opacity: '1'
          },
        },
        fadeOut: {
          '0%': { 
            opacity: '1'
          },
          '100%': { 
            opacity: '0',
            transform: 'translate(-50%, 20px)'
          },
        },
      },
    },
  },
  plugins: [],
}