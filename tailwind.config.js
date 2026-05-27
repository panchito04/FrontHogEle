// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan1: {
          500: "#2a5b56",  // tono más claro dentro de los oscuros
          600: "#234c48",  // un poco más oscuro
          700: "#1c3e3a",  // oscuro
          800: "#14312c",  // aún más oscuro
          900: "#0f2621",  // tono final muy oscuro, casi negro con matiz cyan
        },
        ocean1: {
          500: "#4dd1c3", // tono más claro que el 600
          600: "#35c3a8", // color principal
          700: "#2ea69a", // más oscuro
          800: "#268880", // aún más oscuro
        },
        green1:{
          500: "##22751B",
          600: "#1B5716",
          700: "#143F11",
          800: "#10300D"
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { 
            transform: 'translateY(16px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        fadeOut: {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(16px)'
          },
        },
      },
    },
  },
  plugins: [],
}