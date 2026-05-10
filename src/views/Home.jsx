import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { 
  BadgeCheck, 
  Clock, 
  HeadphonesIcon, 
  ArrowRight, 
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function Home({ products = [], onAddToCart, onViewProduct, onViewBenefits, favorites = [], onToggleFavorite, onViewCatalog }) {
  const topProducts = products.slice(0, 4);

  return (
    <div className="bg-[#030308] min-h-screen animate-fade-in flex flex-col">
      
      {/* ── ESTILOS ANIMADOS EXCLUSIVOS PARA HOME ── */}
      <style>{`
        /* Animación de resplandor para el fondo de la sección de ubicación */
        @keyframes goldShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-gold-shift {
          background: linear-gradient(270deg, #030308 0%, rgba(212,175,55,0.08) 50%, #030308 100%);
          background-size: 200% 200%;
          animation: goldShift 12s ease infinite;
        }
      `}</style>

      {/* ── 1. HERO SECTION ── */}
      <Hero 
        onViewCatalog={onViewCatalog} 
        onViewBenefits={onViewBenefits} 
      />

      {/* ── 2. CINTA DE OFERTAS ── */}
      <div className="bg-black/40 border-y border-phoenix-gold/20 py-4 overflow-hidden relative">
        <div className="flex animate-marquee-infinite text-white/80 font-black tracking-widest text-[10px] sm:text-xs uppercase">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              <span className="mx-12 flex items-center gap-2">
                <span className="text-phoenix-gold">✦</span> ENVÍO GRATIS DESDE $150.000
              </span>
              <span className="mx-12 flex items-center gap-2">
                <span className="text-phoenix-gold">✦</span> COMPRA 2 Y LLEVA 3 EN LÍQUIDOS
              </span>
              <span className="mx-12 flex items-center gap-2">
                <span className="text-phoenix-gold">✦</span> ENTREGAS EN 24H EN BOGOTÁ
              </span>
              <span className="mx-12 flex items-center gap-2">
                <span className="text-phoenix-gold">✦</span> GARANTÍA TOTAL PHOENIX
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. SECCIÓN MÁS BUSCADOS ── */}
      <section className="max-w-368 mx-auto px-6 lg:px-10 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-white/5 pb-8">
          <div>
            <h2 
              className="text-4xl md:text-5xl text-white tracking-tighter"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Más <span className="text-phoenix-gold italic">Buscados</span>
            </h2>
            <p className="text-white/40 text-[10px] mt-3 tracking-[0.3em] uppercase font-bold">
              Los favoritos de nuestra comunidad
            </p>
          </div>
          <button 
            onClick={onViewCatalog}
            className="text-phoenix-gold text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2"
          >
            Ver todo el catálogo <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {topProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onViewProduct={onViewProduct}
              isFavorite={favorites.some(fav => fav.id === product.id)} 
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* ── 4. RESUMEN DE BENEFICIOS ── */}
      <section className="pt-24 pb-20 mt-10 bg-linear-to-b from-black/60 to-transparent border-t border-phoenix-gold/30 shadow-[inset_0_1px_0_rgba(212,175,55,0.1)] relative">
        <div className="max-w-368 mx-auto px-6 lg:px-10 text-center mb-16">
          <h2 
            className="text-4xl md:text-6xl text-white leading-[1.1] tracking-tighter mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            ¿Por qué <span className="text-phoenix-gold italic">Neon?</span>
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
            Calidad y Servicio Insuperables
          </p>
        </div>

        <div className="max-w-368 mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-16">
          {[
            { icon: Clock, title: 'Entregas Pro', text: 'Mismo día en Bogotá, 48h nacional.', color: 'text-phoenix-gold' },
            { icon: BadgeCheck, title: 'Originalidad', text: 'Garantía directa con código QR.', color: 'text-white' },
            { icon: ShieldCheck, title: 'Pagos Seguros', text: 'Cifrado bancario nivel militar.', color: 'text-phoenix-gold' },
            { icon: HeadphonesIcon, title: 'Soporte VIP', text: 'Atención personalizada vía WhatsApp.', color: 'text-white' }
          ].map((item, idx) => (
            <div key={idx} className="group p-8 rounded-4xl border border-white/5 bg-white/2 transition-all duration-500 hover:bg-white/4 hover:border-phoenix-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden">
              <item.icon className={`${item.color} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:text-phoenix-gold relative z-10`} size={32} strokeWidth={1} />
              <h3 
                className="text-2xl text-white mb-2 relative z-10"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {item.title}
              </h3>
              <p className="text-white/50 text-sm font-light leading-relaxed relative z-10">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PUNTO FÍSICO ── */}
      <section className="relative py-32 overflow-hidden bg-gold-shift border-y border-phoenix-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
        
        {/* Línea de luz superior decorativa - Advertencia 1 corregida */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-phoenix-gold/80 to-transparent"></div>

        <div className="relative z-10 max-w-368 mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-white tracking-tighter mb-4 font-serif">
              Encuentra tu <span className="text-phoenix-gold italic">Neón</span>
            </h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
              Vive la experiencia en nuestra sede principal
            </p>
          </div>

          <div className="mx-auto max-w-5xl relative group">
            {/* Resplandor animado detrás de la tarjeta */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#7A5B10] via-phoenix-gold to-[#9A6F18] rounded-4xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

            {/* Tarjeta de Cristal */}
            <div className="relative bg-[#030308]/80 backdrop-blur-xl border border-phoenix-gold/20 rounded-4xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
               
               {/* Contenido (Textos) */}
               <div className="relative z-10 text-center md:text-left flex-1">
                  <span className="inline-block py-1.5 px-4 rounded-full border border-phoenix-gold/30 bg-phoenix-gold/10 text-phoenix-gold text-[10px] font-black uppercase tracking-widest mb-6">
                    Flagship Store
                  </span>
                  <h3 className="text-3xl md:text-4xl text-white font-serif mb-3">Neon Bogotá</h3>
                  <p className="text-white/80 font-light mb-1 text-lg">Calle 122 # 15 - 40, Local 2-140</p>
                  <p className="text-white/40 text-sm font-light mb-8">Centro Comercial Unicentro</p>

                  {/* Horarios */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 hover:border-phoenix-gold/50 transition-colors">
                      <p className="text-phoenix-gold text-[10px] uppercase tracking-widest font-bold mb-1">Lun - Sáb</p>
                      <p className="text-white text-sm">10:00 AM - 8:00 PM</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 hover:border-phoenix-gold/50 transition-colors">
                      <p className="text-phoenix-gold text-[10px] uppercase tracking-widest font-bold mb-1">Domingos</p>
                      <p className="text-white text-sm">11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
               </div>

               {/* Radar Dorado Animado */}
               <div className="relative z-10 shrink-0 w-48 h-48 flex items-center justify-center">
                  {/* Anillos de Radar (Ping) */}
                  <div className="absolute inset-0 border border-phoenix-gold/30 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="absolute inset-6 border border-phoenix-gold/40 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_1s_infinite]"></div>

                  {/* Pin Central con degradado Hero - Advertencia 2 corregida */}
                  <div className="w-20 h-20 bg-linear-to-br from-phoenix-gold via-phoenix-gold to-[#9A6F18] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.5)] z-10 relative cursor-pointer hover:scale-110 transition-transform duration-300">
                     <MapPin size={32} className="text-[#030308]" strokeWidth={2} />
                  </div>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ADVERTENCIA DE SALUD ── */}
      <section className="w-full bg-[#1a0505] border-y border-red-900/50 py-6 px-6 mt-auto">
        <div className="max-w-368 mx-auto flex flex-col md:flex-row items-center justify-center gap-5 md:gap-6 text-center md:text-left">
          
          <div className="shrink-0 flex items-center justify-center relative w-10 h-10">
            <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 blur-sm"></div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-red-500 bg-black/50 text-white font-black text-xs">
              <span className="relative z-10">18</span>
              <div className="absolute inset-0 w-full h-full border-t-2 border-red-500 rounded-full rotate-45 transform origin-center"></div>
            </div>
          </div>

          <p className="text-white/80 text-sm md:text-[15px] font-light tracking-wide leading-relaxed">
            <strong className="text-white font-bold mr-1">Este producto contiene nicotina, una sustancia adictiva.</strong> 
            Prohibida su venta a menores de edad. No recomendado para mujeres embarazadas o personas con afecciones médicas.
          </p>

        </div>
      </section>

    </div>
  );
}
