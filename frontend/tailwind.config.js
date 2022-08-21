const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        flagstaff: ['Flagstaff', 'serif'],
        safeguard: ['Safeguard', 'serif'],
      },
      colors: {
        brown: {
          primary: '#31180F',
          light: '#C48C0A',
          350: '#AB521F',
          450: '#602200',
          500: '#4D3118',
          800: 'rgb(27, 5, 9)',
          scrollbar: '#8f703f',
          1000: '#140905',
        },
        gold: {
          50: '#E5B016',
          70: '#DDA247',
          100: '#D69C44',
          200: '#A97436',
          300: '#9E5908',
          500: '#6C3E15',
        },
        yellow: {
          primary: '#FDF424',
          150: '#FFB342',
        },
        blue: {
          150: '#39A0BF',
        },

        red: {
          350: '#D04648',
          450: '#863335',
        },
        green: {
          120: '#919b5d',
          150: '#6E992A',
          350: '#6DAA2C',
          450: '#4B781C',
        },
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('tailwind-scrollbar'),
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    },
  ],
}
