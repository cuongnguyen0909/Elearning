import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        lightBg: 'rgb(232,246,255)', // light blue pastel
        lightText: '#333333', // dark text
        lightAccent: '#00bcd4', // accent color for buttons, etc.
        lightButton: '#0288d1' // button color
      },
      fontFamily: {
        Poppins: ['var(--font-Poppins)'],
        Josefin: ['var(--font-Josefin)']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      screens: {
        '1000px': '1000px',
        '1100px': '1100px',
        '1200px': '1200px',
        '1300px': '1300px',
        '1500px': '1500px',
        '800px': '800px',
        '400px': '400px'
      }
    }
  },
  plugins: []
}
export default config