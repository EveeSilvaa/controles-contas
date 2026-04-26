/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#1C1C28',
          hover: '#2A2A3C',
          active: '#353548',
          border: '#2E2E42',
          text: '#9898B8',
          'text-active': '#F0F0FF',
        },
        brand: {
          DEFAULT: '#22D68A',
          50: '#EDFBF4',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#22D68A',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#0D0D1A',
          muted: '#6B6B88',
          faint: '#AEAEC2',
        },
        danger: {
          DEFAULT: '#FF4D4D',
          light: '#FFF1F1',
          dark: '#CC0000',
        },
        warning: {
          DEFAULT: '#F5A623',
          light: '#FFF8EC',
          dark: '#CC7A00',
        },
        info: {
          DEFAULT: '#4F8EF7',
          light: '#EEF4FF',
          dark: '#1A5CC8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
        'brand': '0 4px 14px rgba(34,214,138,0.3)',
      },
    },
  },
  plugins: [],
}
