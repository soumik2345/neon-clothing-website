/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neon: {
          black: "#050505",
          dark: "#121212",
          card: "#ffffff",
          border: "#e5e5e5",
          muted: "#737373",
        },
      },
    },
  },
  plugins: [],
};
