/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0eff8',
          100: '#e0dff1',
          200: '#c1bee3',
          300: '#a29dd5',
          400: '#837cc7',
          500: '#514d9f',
          600: '#413e7f',
          700: '#312e5f',
          800: '#211f40',
          900: '#110f20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
