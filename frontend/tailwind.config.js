/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7C9A74",
        darkPrimary: "#6E8C66",
        lightBg: "#F6F4EF",
        textPrimary: "#3A3A3A",
        textSecondary: "#8C8C8C",
      },
    },
  },
  plugins: [],
}
