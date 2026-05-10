export default function Footer() {
  return (
    <footer className="bg-[#030308] border-t border-white/10 pt-16">
      
      {/* ── ENLACES Y COLUMNAS ── */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Info Marca */}
        <div className="col-span-1 md:col-span-2">
          <span 
            className="text-3xl text-white tracking-widest mb-4 block"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            FÉNIX<span className="text-phoenix-gold font-bold">.</span>
          </span>
          <p className="text-white/40 text-sm font-light max-w-sm leading-relaxed">
            Tu experiencia premium definitiva en vapeo. Entregas ultra rápidas en Colombia y tecnología de punta en cada puff.
          </p>
        </div>

        {/* Tienda */}
        <div>
          <h4 className="text-white font-black uppercase tracking-[0.2em] mb-6 text-[10px]">TIENDA</h4>
          <ul className="space-y-4 text-sm text-white/50 font-light">
            <li><a href="#" className="hover:text-phoenix-gold transition-colors">Catálogo</a></li>
            <li><a href="#" className="hover:text-phoenix-gold transition-colors">Beneficios</a></li>
          </ul>
        </div>

        {/* Legal y Redes */}
        <div>
          <h4 className="text-white font-black uppercase tracking-[0.2em] mb-6 text-[10px]">LEGAL</h4>
          <ul className="space-y-4 text-sm text-white/50 font-light mb-8">
            <li><a href="#" className="hover:text-phoenix-gold transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-phoenix-gold transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-phoenix-gold transition-colors">Política de Envíos</a></li>
          </ul>
          
          <h4 className="text-white font-black uppercase tracking-[0.2em] mb-6 text-[10px]">SÍGUENOS</h4>
          
          {/* Íconos (Estilo Luxury Glassmorphism optimizado) */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/10 rounded-full text-white/50 hover:text-phoenix-gold hover:border-phoenix-gold/50 transition-all flex items-center justify-center bg-white/2 hover:bg-phoenix-gold/10" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            
            <a href="#" className="w-10 h-10 border border-white/10 rounded-full text-white/50 hover:text-phoenix-gold hover:border-phoenix-gold/50 transition-all flex items-center justify-center bg-white/2 hover:bg-phoenix-gold/10" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── COPYRIGHT ── */}
      <div className="border-t border-white/5 py-6 text-center text-[10px] uppercase tracking-widest text-white/30 font-bold bg-black/20">
        © {new Date().getFullYear()} Neón Vapes Colombia. Todos los derechos reservados.
      </div>
    </footer>
  );
}
