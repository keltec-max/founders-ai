/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f11',
        panel: '#151719',
        text: '#f1f0eb',
        muted: '#abaeae',
        gold: '#d6b779',
        line: '#303335',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      spacing: {
        'section': '100px',
      },
    },
  },
  plugins: [],
}
