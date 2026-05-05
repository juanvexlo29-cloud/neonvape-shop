/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul oscuro casi negro para el fondo, idéntico al video
        dark: "#0B0F19",
        // Verde neón característico
        neonGreen: "#10b981",
        // Morado profundo para detalles
        neonPurple: "#9333ea",
        // Rojo para alertas
        neonRed: "#ef4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Animación para que la cinta se mueva suavemente
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