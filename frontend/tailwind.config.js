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
          red: '#D32F2F',
          redLight: '#FFEBEE',
          green: '#388E3C',
          greenLight: '#E8F5E9',
          blue: '#0288D1',
          blueLight: '#E1F5FE',
          yellow: '#FBC02D',
          yellowLight: '#FFFDE7',
          silver: '#607D8B',
          silverLight: '#ECEFF1',
          bg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-left': 'slide-left 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
