import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Velours rouge profond — rideau
        velvet: {
          50: "#fbf1f3",
          100: "#f6dde2",
          200: "#ecb4be",
          300: "#dd8090",
          400: "#c95066",
          500: "#a82a44",
          600: "#891b33",
          700: "#6e1429",
          800: "#4a0d1c",
          900: "#2d0811",
          950: "#180408",
        },
        // Or marquise
        gold: {
          50: "#fdf8ec",
          100: "#faedc8",
          200: "#f4d889",
          300: "#ecbe4a",
          400: "#dfa122",
          500: "#c7841a",
          600: "#a36315",
          700: "#7b4811",
          800: "#522f0c",
          900: "#2f1a07",
        },
        // Ivoire / papier playbill
        ivory: {
          50: "#fbf8f1",
          100: "#f5efe0",
          200: "#ebe1c4",
          300: "#dccc9b",
          400: "#c4ae6f",
          500: "#a08a4d",
          600: "#7a683a",
        },
        // Noir scène
        ink: {
          50: "#f4f3f0",
          100: "#dcd9d2",
          400: "#5a5651",
          700: "#262320",
          800: "#1a1815",
          900: "#100e0c",
          950: "#08070a",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        marquee: ['"Big Shoulders Display"', "Impact", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        playbill: "0 25px 50px -12px rgba(24,4,8,0.6), 0 0 0 1px rgba(244,216,137,0.08)",
        ticket: "0 18px 40px -10px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(244,216,137,0.12)",
        marquee: "0 0 20px rgba(252,211,77,0.5), 0 0 60px rgba(252,211,77,0.25)",
      },
      backgroundImage: {
        "velvet-tex":
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, transparent 1px, transparent 6px, rgba(0,0,0,0.18) 7px)",
        "paper-grain":
          "radial-gradient(circle at 30% 20%, rgba(160,138,77,0.05) 0, transparent 50%), radial-gradient(circle at 80% 80%, rgba(160,138,77,0.05) 0, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
