export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 mt-20">
      {/* Bloque Advertencia Nicotina */}
      <div className="bg-[#1a0505] border-y border-red-900/30 p-6 flex items-start gap-4 justify-center">
        <span className="text-red-500 text-xl">🔞</span>
        <p className="text-gray-300 text-sm max-w-4xl leading-relaxed">
          <strong className="text-white">Este producto contiene nicotina, una sustancia adictiva.</strong> Prohibida su venta a menores de edad. No recomendado para mujeres embarazadas o personas con afecciones médicas.
        </p>
      </div>

      {/* Enlaces y Columnas */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Info Marca */}
        <div className="col-span-1 md:col-span-2">
          <span className="text-2xl font-black italic text-white mb-4 block">
            NEON<span className="text-neonGreen">VAPE</span>
          </span>
          <p className="text-gray-500 text-sm max-w-sm">
            Tu tienda premium en vapeo. Entregas ultra rápidas en Colombia y tecnología de punta en cada puff.
          </p>
        </div>

        {/* Tienda */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">TIENDA</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-neonGreen transition-colors">Catálogo</a></li>
            <li><a href="#" className="hover:text-neonGreen transition-colors">Beneficios</a></li>
          </ul>
        </div>

        {/* Legal y Redes */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">LEGAL</h4>
          <ul className="space-y-3 text-sm text-gray-500 mb-6">
            <li><a href="#" className="hover:text-neonGreen transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-neonGreen transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-neonGreen transition-colors">Política de Envíos</a></li>
          </ul>
          
          <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">SÍGUENOS</h4>
          
          {/* Íconos redondos SVG Nativos (Libres de errores) */}
          <div className="flex gap-4">
            {/* Ícono de Instagram */}
            <a href="#" className="p-2 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-white transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            
            {/* Ícono de Chat/Mensaje (Similar al del video) */}
            <a href="#" className="p-2 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-white transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-900 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} NeonVape Colombia. Todos los derechos reservados.
      </div>
    </footer>
  );
}