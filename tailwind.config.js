/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'space-900': '#0b1222',
        'space-800': '#0f1831',
        'space-700': '#122045',
        // Vision UI inspired accents
        'accent-cyan': '#21d4fd',
        'accent-lime': '#35d28a',
        'accent-magenta': '#9f7aea',
        'vui-primary': '#4318ff',
        'vui-dark': '#0f123b',
        'vui-card': 'rgba(6, 11, 40, 0.74)'
      },
      boxShadow: {
        glow: '0 0 25px rgba(33, 212, 253, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(168, 255, 96, 0.18)'
      },
      backgroundImage: {
        'stars-gradient': 'radial-gradient(1000px 500px at 10% 10%, rgba(33,212,253,0.10), transparent 60%), radial-gradient(900px 450px at 90% 15%, rgba(159,122,234,0.12), transparent 60%), radial-gradient(800px 400px at 50% 100%, rgba(53,210,138,0.10), transparent 60%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};


