/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#a538ff"
      }
    },
  },
  plugins: [],
  corePlugins: {
    backgroundOpacity: true,
  },
}

