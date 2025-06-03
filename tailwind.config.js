/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "burnt-sienna": "#F47251",
        "alice-blue": "#EBF5FC",
        "vermilion": "#EF3934",
        "saffron": "#EEBA2B"
      }
    },
  },
  plugins: [],
}

