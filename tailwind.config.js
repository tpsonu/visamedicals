/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cff0ff',
          200: '#a6e5ff',
          300: '#67d3ff',
          400: '#22baff',
          500: '#009dff',
          600: '#007adb',
          700: '#0061b4',
          800: '#005294',
          900: '#064478',
          950: '#042b4f',
        },
        medical: {
          teal: '#0d9488',
          emerald: '#059669',
          cyan: '#0891b2',
          blue: '#2563eb',
          indigo: '#4f46e5',
          rose: '#e11d48',
          amber: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
