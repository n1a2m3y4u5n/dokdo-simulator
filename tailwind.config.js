/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: { 950: '#030d1a', 900: '#050f1e', 800: '#081728', 700: '#0d2040' },
        teal: { 400: '#2dd4bf', 500: '#00d4aa', 600: '#00bfa0' },
        cyan: { 400: '#22d3ee', 500: '#0ab4ee' },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
