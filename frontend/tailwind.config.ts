import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        feature: {
          primary: "var(--color-feature-primary-bg)",
          secondary: "var(--color-feature-secondary-bg)",
        },
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
        },
      },
      borderRadius: {
        card: "29px",
      },
    },
  },
  plugins: [],
};

export default config;
