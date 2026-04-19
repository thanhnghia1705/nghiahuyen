import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff8fa",
          100: "#fff0f4",
          200: "#ffdfe8",
          300: "#f9c8d8",
          400: "#ef9db8",
          500: "#dc7197",
          600: "#c44c76",
          700: "#a3365f",
          800: "#7e2b4b",
          900: "#532033"
        },
        sand: {
          50: "#fffdf9",
          100: "#fff8ef",
          200: "#f7eddc",
          300: "#ead7b3",
          400: "#d7b981",
          500: "#c59d58",
          600: "#ac8041",
          700: "#8d6636",
          800: "#73532e",
          900: "#5f4528"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(220, 113, 151, 0.20)",
        soft: "0 16px 50px rgba(83, 32, 51, 0.08)"
      },
      backgroundImage: {
        "romance-grid":
          "radial-gradient(circle at top left, rgba(239,157,184,0.25), transparent 30%), radial-gradient(circle at top right, rgba(197,157,88,0.10), transparent 25%), linear-gradient(180deg, #fffdfb 0%, #fff8fa 40%, #fffaf7 100%)"
      },
      animation: {
        shimmer: "shimmer 2.4s ease-in-out infinite",
        floaty: "floaty 8s ease-in-out infinite"
      },
      keyframes: {
        shimmer: {
          "0%,100%": { opacity: "0.8", transform: "translateY(0px)" },
          "50%": { opacity: "1", transform: "translateY(-6px)" }
        },
        floaty: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
