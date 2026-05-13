import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#FAF7F2",
        ink: "#11131A",
        slate2: "#5B6072",
        accent: "#3B3BFF",
        accent2: "#E8FF5B",
        sage: "#7A9E7E"
      },
      fontFamily: {
        display: ["ui-serif", "Georgia", "Cambria", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
