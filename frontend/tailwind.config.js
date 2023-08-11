/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d6efd",
        secondary: "#1677ff",
      },
      backgroundImage: {
        gradient:
          "linear-gradient(90deg, #6C63FF 0%, #C100D4 50%, #82ECEE 100%)",
      },
      animation: {
        popup: "popup ease-in-out forwards 3s",
      },
      keyframes: {
        popup: {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  } 
}