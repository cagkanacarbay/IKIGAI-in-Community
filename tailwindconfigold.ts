/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
import withMT from "@material-tailwind/react/utils/withMT";


module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js'
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
  plugins: [require('flowbite/plugin')],  
  variants: {},
});

