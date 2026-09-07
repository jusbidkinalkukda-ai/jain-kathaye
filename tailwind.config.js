/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jain: {
          maroon: '#8F2018',
          'maroon-dark': '#6E1610',
          'maroon-light': '#AA291F',
          cream: '#FFF8EC',
          'cream-light': '#FFFDF8',
          'cream-warm': '#F7EEDB',
          gold: '#E7B83D',
          'gold-dark': '#C9981E',
          'yellow-soft': '#FFF0B8',
          text: '#3D342F',
          muted: '#817872',
          border: '#E9E0D5',
          green: '#216A43',
          'green-dark': '#184E31',
          ochre: '#A44E18',
          saffron: '#EE7314',
        }
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        heading: ['"Rozha One"', '"Noto Sans Devanagari"', 'serif'],
        sans: ['"Inter"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'jain-card': '0 4px 20px -2px rgba(143, 32, 24, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'jain-elevated': '0 12px 30px -4px rgba(143, 32, 24, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'jain-glow': '0 0 25px rgba(231, 184, 61, 0.35)',
      },
      borderRadius: {
        'jain': '1.25rem',
        'jain-lg': '1.75rem',
        'jain-xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
