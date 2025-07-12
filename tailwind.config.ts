import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          hover: '#4338ca', // indigo-700
        },
        success: '#22c55e', // green-500
        warning: '#f59e0b', // amber-500
        danger: '#dc2626', // red-600
        surface: '#ffffff',
        'glass-bg': 'rgba(255, 255, 255, 0.4)',
      },
    },
  },
  plugins: [typography],
};
export default config; 