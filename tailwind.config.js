/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'body': ['']
      },
    }
  },
  variants: {
    extend: {
      display: ['group-hover']
    }
  },
  plugins: []
};

