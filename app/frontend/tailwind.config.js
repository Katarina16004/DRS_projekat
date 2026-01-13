/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'green-dark': '#54C571',
        'green-light': '#C3FDB8',
        'blue-dark': '#82CAFF',
        'blue-light': '#BDEDFF',
        'yellow-light': '#FFF8C6',
        'yellow-dark': '#EDE275',
        'pink-light': '#F9B7FF',
        'pink-dark': '#D462FF',
      },
    },
  },
  plugins: [],
};
