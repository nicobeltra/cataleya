import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        white: '#fafaf8',
        cream: '#f4f0eb',
        rose: '#b88a85',
        'rose-soft': '#d4b5b0',
        'rose-pale': '#f5ebe8',
        gray: '#8a8580',
        line: '#e5e0db',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-jost)', 'sans-serif'],
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
        fadeUp: 'fadeUp 1s ease forwards',
      },
      keyframes: {
        scroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
