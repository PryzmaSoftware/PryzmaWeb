module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1, transform: "translate(0px,0px)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        grow: {
          "0%": { height: 0 },
          "100%": { height: "100%" },
        },
        move: {
          "0%": { backgroundPosition: "left" },
          "50%": { backgroundPosition: "right" },
          "100%": { backgroundPosition: "left" },
        },
        height: {
          "0%": { height: "0%" },
          "100%": { height: "100vh", minHeight: "fit", maxHeight: "fit" },
        },
      },
      animation: {
        fadeInUpFast: "fadeInUp 0.2s ease-in-out forwards",
        fadeInUp: "fadeInUp 0.5s ease-in-out forwards",
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        grow: "grow 0.2s linear forwards",
        move: "move 8s linear infinite",
        height: "height 2s ease forwards",
      },
    },
    screens: {
      xs: "500px",
      sm: "600px",
      md: "768px",
      steps: "700px",
      precisionHome: "930px",
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar-hide"),
  ],
};
