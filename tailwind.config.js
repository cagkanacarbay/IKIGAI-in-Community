/** 
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(15px)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        'tldraw-menu-hover-gray': '#E3E6E8',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/forms'), require('tailwindcss-animated')],
});