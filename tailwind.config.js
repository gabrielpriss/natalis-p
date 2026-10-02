/** Mesma configuração que antes ficava inline no <head> para o Tailwind via CDN. */
module.exports = {
  content: ['./public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          blue: '#2d4255',
          cyan: '#4e6d80',
          slate: '#8ba0b0',
          light: '#edf3f7',
          dark: '#1a2535',
        },
      },
    },
  },
};
