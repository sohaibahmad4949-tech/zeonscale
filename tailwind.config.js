export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)', ink: 'var(--ink)', muted: 'rgb(var(--muted-rgb) / <alpha-value>)', line: 'var(--line)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)', brand2: 'var(--brand2)', navy: '#050b1f',
      },
      fontFamily: { display: ['Sora', 'system-ui', 'sans-serif'], sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'] },
    },
  },
}
