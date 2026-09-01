/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020D07",
        surface: "#0B1F12",
        primary: "#16A34A",
        secondary: "#4ADE80",
        whiteAlt: "#FFFFFF",
        highlight: "#10B981",
        textPrimary: "#FFFFFF",
        textSecondary: "#A3B8A8",
        border: "#1A3325",
        cta: "#22C55E",
        ctaHover: "#86EFAC",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};
export default config;
