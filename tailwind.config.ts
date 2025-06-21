// tailwind.config.ts
import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide"; // <-- 1. IMPORT DI ATAS

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [
    scrollbarHide, // <-- 2. GUNAKAN VARIABELNYA DI SINI
  ],
};
export default config;
