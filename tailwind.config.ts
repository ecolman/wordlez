import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in-out": "fade-in-out 1500ms ease-in-out 1",
        "forward-flip": "forward-flip 300ms linear 1",
        "h-shake": "horizontal-shaking 300ms ease-in 2",
        pop: "pop 100ms ease-in 1",
      },
      colors: {
        "tile-bg": "rgb(var(--tile-bg-rgb))",
        "tile-border": "rgb(var(--tile-border-rgb))",
        "tile-text": "rgb(var(--tile-text-rgb))",

        "tile-filled-border": "rgb(var(--tile-filled-border-rgb))",

        "tile-used-border": "rgba(var(--tile-used-border-rgba))",
        "tile-used-text": "rgb(var(--tile-used-text-rgb))",

        "in-word": "rgb(var(--in-word-rgb))",
        match: "rgb(var(--match-rgb))",
        "no-match": "rgb(var(--no-match-rgb))",

        "key-bg": "rgb(var(--key-bg-rgb))",
        "key-text": "rgb(var(--key-text-rgb))",

        "toast-bg": "rgb(var(--toast-bg-rgb))",
        "toast-text": "rgb(var(--toast-text-rgb))",
      },
      keyframes: {
        "fade-in-out": {
          "0%": { opacity: "0" },
          "25%": { opacity: "0.5" },
          "50%": { opacity: "1" },
          "75%": { opacity: "0.5" },
          "100%": { opacity: "0" },
        },
        "forward-flip": {
          "0%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        "horizontal-shaking": {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(4px)" },
          "50%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
          "100%": { transform: "translateX(0)" },
        },
        pop: {
          "50%": { transform: "scale(1.2)" },
        },
      },
      screens: {
        short: { raw: "(max-height: 600px)" },
        tall: { raw: "(min-height: 650px)" },
      },
    },
  },
  plugins: [],
  safelist: [
    "cursor-pointer",
    "delay-[300ms]",
    "delay-[600ms]",
    "delay-[900ms]",
    "delay-[1200ms]",
    "grid-cols-5",
    "grid-rows-5",
    "grid-cols-6",
    "grid-rows-6",
    "grid-cols-7",
    "grid-rows-7",
    "grid-cols-8",
    "grid-rows-8",
    "grid-cols-9",
    "grid-rows-9",
    "grid-cols-10",
    "grid-rows-10",
  ],
};
export default config;
