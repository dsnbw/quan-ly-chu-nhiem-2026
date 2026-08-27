/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#bce2ff',
          300: '#8ecfff',
          400: '#58b2ff',
          500: '#2f8fff',
          600: '#196df5',
          700: '#1254e1',
          800: '#1444b6',
          900: '#163c8f',
          950: '#112557',
        },
        edu: {
          blue: '#196df5',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6',
          slate: '#475569',
        }
      }
    },
  },
  plugins: [],
}
