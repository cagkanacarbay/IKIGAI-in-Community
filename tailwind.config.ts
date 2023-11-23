// import type { Config } from 'tailwindcss'
import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(15px)',
      },
    },
  },
  plugins: [],
  variants: {},
});

