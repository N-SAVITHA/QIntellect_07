/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2f6aec",
        myGreen: '#008000',
        myRed: '#FF0000',
        myOrange: "#ffa500"
      }
    },
  },
  plugins: [],
}

