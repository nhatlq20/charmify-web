/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Patrick Hand"', 'cursive', 'sans-serif'],
        sans: ['"Nunito"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        doodle: ['"Patrick Hand"', 'cursive', 'sans-serif'],
      },
      colors: {
        doodle: {
          blue: '#49B6E5',
          navy: '#263D5B',
          canvas: '#FBF9F5',
          ink: '#111827',
          yellow: '#FDE68A',
          peach: '#FCA5A5',
          pink: '#FECDD3',
          sky: '#BAE6FD',
          mint: '#A7F3D0',
        },
      },
      boxShadow: {
        'sketch-sm': '2px 2px 0px #111827',
        'sketch': '3px 4px 0px #111827',
        'sketch-md': '4px 5px 0px #111827',
        'sketch-lg': '6px 7px 0px #111827',
        'sketch-xl': '8px 9px 0px #111827',
        'sketch-hover': '5px 6px 0px #111827',
        'sketch-active': '1px 2px 0px #111827',
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
