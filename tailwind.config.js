/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slate-800': 'rgb(30 41 59)',
        black: 'rgb(0,0,0)',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255,255,255,0.7)',
        card: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: []
});
