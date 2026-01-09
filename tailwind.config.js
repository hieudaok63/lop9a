/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      colors: {
        "cute-pink": "#FFE5E5",
        "cute-peach": "#FFD1D1",
        "cute-text": "#7C444B",
        "cute-accent": "#FF9EAA",
      },
    },
  },
  plugins: [],
};
