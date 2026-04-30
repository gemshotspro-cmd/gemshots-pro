tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        mont: ["Montserrat", "system-ui", "sans-serif"],
      },
      colors: {
        dark: { DEFAULT: "#0a0a0a", light: "#1a1a1a" },
        grey: { DEFAULT: "#a0a0a0", dark: "#606060", light: "#d0d0d0" },
        accent: "#ffdf01",
        "accent-dark": "#009955",
        border: "#303030",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        36: "9rem",
      },
      letterSpacing: {
        wide: "0.05em",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "infinite-scroll": "infinite-scroll 22s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "infinite-scroll": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
};
