/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo ultra oscuro de Fénix
        dark: "#030308",
        // Dorado oficial de la marca
        'phoenix-gold': "#D4AF37",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Añadimos la fuente elegante para los títulos
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}