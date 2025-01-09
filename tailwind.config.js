/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      keyframes: {
        scaleIn: {
          '0%': { 
            transform: 'translate(0, 20%) scale(var(--viewport-scale))',
            opacity: '0' 
          },
          '70%': { 
            transform: 'translate(0, -52%) scale(var(--viewport-scale))',
            opacity: '1' 
          },
          '100%': { 
            transform: 'translate(0, -50%) scale(var(--viewport-scale))',
            opacity: '1' 
          },
        },
        scaleOut: {
          '0%': { 
            transform: 'translate(0, -50%) scale(var(--viewport-scale))',
            opacity: '1' 
          },
          '100%': { 
            transform: 'translate(0, 20%) scale(var(--viewport-scale))',
            opacity: '0' 
          },
        },
        slideInRight: {
          '0%': { transform: 'translate(100%, -50%)' },
          '100%': { transform: 'translate(0, -50%)' },
        },
        slideOutRight: {
          '0%': { transform: 'translate(0, -50%)' },
          '100%': { transform: 'translate(100%, -50%)' },
        },
      },
      animation: {
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        "scale-out": "scaleOut 0.3s ease-out",
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

