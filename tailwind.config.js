/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          light: '#3a8463',
          dark: '#1e4d38',
        },
        secondary: {
          DEFAULT: '#40916C',
          light: '#52a882',
          dark: '#2f6e52',
        },
        accent: {
          DEFAULT: '#74C69D',
          light: '#9dd8bb',
          dark: '#52b385',
        },
        background: '#F5FBF7',
        surface: '#D8F3DC',
        surfaceLight: '#edfaf0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(45,106,79,0.08)',
        cardHover: '0 8px 40px rgba(45,106,79,0.18)',
        glow: '0 0 24px rgba(116,198,157,0.3)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #74C69D 100%)',
        'card-gradient': 'linear-gradient(145deg, #D8F3DC 0%, #F5FBF7 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 0.4s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'cart-pop': 'cartPop 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(116,198,157,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(116,198,157,0)' },
        },
        cartPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
