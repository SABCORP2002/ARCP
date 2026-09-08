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
        // Light theme, sky-blue accent.
        background: "#F6F9FC",
        surface: "#FFFFFF",
        surfaceAlt: "#EEF4FA",
        primary: "#0284C7",
        secondary: "#0C4A6E",
        whiteAlt: "#FFFFFF",
        highlight: "#0284C7",
        sky: "#0EA5E9",
        ink: "#0C4A6E",
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        border: "#E2E8F0",
        cta: "#0284C7",
        ctaHover: "#0369A1",
        success: "#16A34A",
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
