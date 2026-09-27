/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        prussian: {
          DEFAULT: '#031130',
          dark: '#010818',
          light: '#071b4a',
        },
        salesport: {
          DEFAULT: '#185DF1',
          hover: '#134ec9',
          light: '#3b78f5',
          glow: 'rgba(24, 93, 241, 0.45)',
        },
        alice: {
          DEFAULT: '#F3F7FE',
          muted: '#C4D4F5',
          subtle: 'rgba(243, 247, 254, 0.08)',
        },
        brand: {
          dark: '#000000',
          night: '#020614',
          surface: '#050D24',
          card: '#081330',
          border: 'rgba(24, 93, 241, 0.25)',
          'border-active': 'rgba(24, 93, 241, 0.65)',
        },
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(circle at 50% 50%, #185DF1 0%, #031130 65%, #000000 100%)',
        'salesport-glow': 'radial-gradient(ellipse at top, #185DF1 0%, #031130 50%, #000000 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
