import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "15": "15px",
      },
      container: {
        center: true,
        padding: "1.5rem",
      },
      screens: {
        "2xl": "1440px",
        xl: "1280px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
      },
      colors: {
        background: {
          DEFAULT: "rgba(var(--color-background))",
        },
        "admin-bg": "rgba(var(--color-admin-bg))",
        primary: {
          DEFAULT: "rgba(var(--color-primary))",
          blue: "rgba(var(--color-primary-blue))",
          green: "rgba(var(--color-primary-green))",
          red: "rgba(var(--color-primary-red))",
          border: "rgba(var(--color-primary-border))",
        },
        red: {
          DEFAULT: "#ff0000",
        },
        blue: {
          DEFAULT: "#0000ff",
        },
        green: {
          DEFAULT: "#00ff00",
        },
        neutral: {
          DEFAULT: "#F5F5F5",
        },
        text: {
          DEFAULT: "rgba(var(--color-text))",
          100: "rgba(var(--color-text-100))",
          200: "rgba(var(--color-text-200))",
          300: "rgba(var(--color-text-300))",
        },
        link: "rgba(var(--color-link))",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(15deg)" },
          "50%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out both",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        ring: "ring 0.6s ease-in-out infinite",
      },
    },
  },
  // eslint-disable-next-line
  plugins: [
    require("tailwindcss-react-aria-components")({ prefix: "rac" }),
    require("tailwind-scrollbar-hide"),
  ],
} satisfies Config;
