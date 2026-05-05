import ProductCard from '../components/ProductCard';
import VapeScene from '../components/VapeScene';
import { 
  Truck, 
  Home as HomeIcon, 
  BadgeCheck, 
  Clock, 
  HeadphonesIcon, 
  ArrowRight, 
  Star,
  ShieldCheck 
} from 'lucide-react';

export default function Home({ products, onAddToCart, onViewProduct, onViewBenefits }) {
  // Tomamos solo los primeros 4 productos para la sección "Más Buscados"
  const topProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in pb-20">
      
      {/* SECCIÓN HERO */}
      <section className="relative px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between min-h-[85vh]">
        
        {/* COLUMNA IZQUIERDA: Textos y Botones */}
        <div className="md:w-1/2 z-10 flex flex-col justify-center mt-8 md:mt-0">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight uppercase italic">
            DESCUBRE LA <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-green-300">
              NUEVA
            </span><br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              EXPERIENCIA
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
            Vapes premium con sabores explosivos, diseño urbano y la mejor tecnología. Lleva tu sesión al siguiente nivel.
          </p>
          
          <div className="flex items-center gap-6 mb-16">
            <button 
              className="bg-linear-to-r from-[#86efac] to-[#d8b4fe] hover:scale-105 text-black px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(134,239,172,0.2)]"
            >
              Comprar Ahora <ArrowRight size={18} />
            </button>
            <button 
              onClick={onViewBenefits}
              className="text-white font-bold hover:text-neonGreen transition-colors text-sm md:text-base underline underline-offset-8 decoration-gray-700"
            >
              Ver beneficios
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center text-gray-300">
              <Star size={12} className="fill-current" />
              <Star size={12} className="fill-current" />
              <Star size={12} className="fill-current" />
              <Star size={12} className="fill-current" />
              <Star size={12} className="fill-current" />
              <span className="ml-2 font-bold text-gray-400">4.9/5</span>
            </div>
            <span>+10.000 clientes felices</span>
          </div>
        </div>
        
        {/* COLUMNA DERECHA: Escena 3D */}
        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative w-full h-125">
          {/* Resplandor de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          {/* Badge de Puffs Flotante */}
          <div className="absolute top-0 right-0 md:right-0 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-center z-20 shadow-2xl">
            <span className="block text-[10px] text-gray-400 font-bold tracking-widest">HASTA</span>
            <span className="block text-3xl font-black text-white">7500</span>
            <span className="block text-[10px] text-gray-400 font-bold tracking-widest uppercase">Puffs</span>
          </div>

          {/* Componente 3D Real */}
          <div className="w-full h-full relative z-10">
            <VapeScene />
          </div>
        </div>
      </section>

      {/* CINTA DE OFERTAS EN MOVIMIENTO (MARQUEE) */}
      <div className="bg-[#050810] border-y border-gray-800/50 py-3 overflow-hidden relative">
        <div className="animate-marquee-infinite text-white font-bold tracking-wider text-xs md:text-sm">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              <span className="mx-8 flex items-center gap-2">📦 ENVÍO GRATIS DESDE $150.000</span>
              <span className="mx-8 text-neonPurple flex items-center gap-2">💜 COMPRA 2 Y LLEVA 3</span>
              <span className="mx-8 flex items-center gap-2">⚡ ENTREGAS EN 24H EN BOGOTÁ</span>
              <span className="mx-8 text-orange-400 flex items-center gap-2">🎁 REGALO SORPRESA</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN MÁS BUSCADOS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-white mb-10 italic tracking-tighter uppercase">Más Buscados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onViewProduct={onViewProduct} 
            />
          ))}
        </div>
      </section>

      {/* RESUMEN DE BENEFICIOS CON ANIMACIÓN */}
      <section className="pt-10 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] uppercase italic tracking-tighter mb-4">
            ¿Por qué <span className="text-transparent bg-clip-text bg-linear-to-r from-neonGreen to-emerald-400">NeonVape?</span>
          </h2>
        </div>

        {/* El Carrito Animado */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="relative w-full h-40 bg-[#0f1423] rounded-3xl border border-gray-800 overflow-hidden flex items-center justify-center">
            <span className="absolute top-4 text-gray-800 font-black tracking-widest text-[10px] uppercase">Logística de alta velocidad</span>
            
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gray-900 -translate-y-1/2 rounded-full">
              <div className="h-full bg-neonGreen w-full opacity-20"></div>
            </div>

            <div className="absolute top-1/2 right-10 -translate-y-1/2 text-neonPurple z-10 flex flex-col items-center bg-[#0f1423] px-2">
              <HomeIcon size={40} strokeWidth={1.5} className="drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]" />
            </div>

            {/* Animación del camión */}
            <div className="absolute top-1/2 translate-y-[-60%] animate-drive-to-home flex items-end text-neonGreen z-20">
              <div className="flex flex-col gap-1 -mr-1.25 mb-2 opacity-60">
                <div className="w-4 h-0.5 bg-emerald-400 rounded-full"></div>
                <div className="w-8 h-0.5 bg-emerald-400 rounded-full"></div>
              </div>
              <Truck size={48} strokeWidth={1.5} className="drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] fill-dark" />
            </div>
          </div>
        </div>

        {/* Tarjetas resumen con gradientes */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-linear-to-br from-emerald-900/20 to-dark p-6 rounded-3xl border border-gray-800 hover:border-neonGreen/30 transition-all">
            <Clock className="text-neonGreen mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Envíos Relámpago</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Entregas el mismo día en Bogotá y envíos nacionales rápidos.</p>
          </div>

          <div className="bg-linear-to-br from-purple-900/20 to-dark p-6 rounded-3xl border border-gray-800 hover:border-neonPurple/30 transition-all">
            <BadgeCheck className="text-neonPurple mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">100% Originales</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Solo marcas oficiales con código QR de verificación real.</p>
          </div>

          <div className="bg-linear-to-br from-blue-900/20 to-dark p-6 rounded-3xl border border-gray-800 hover:border-blue-500/30 transition-all">
            <ShieldCheck className="text-blue-400 mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Pago Seguro</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Protegemos tu dinero con Wompi, Nequi y cifrado SSL.</p>
          </div>

          <div className="bg-linear-to-br from-orange-900/20 to-dark p-6 rounded-3xl border border-gray-800 hover:border-orange-500/30 transition-all">
            <HeadphonesIcon className="text-orange-400 mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Soporte 24/7</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Estamos para ayudarte por WhatsApp en cualquier momento.</p>
          </div>
        </div>

        {/* Botón hacia la página de Beneficios */}
        <div className="text-center">
          <button 
            onClick={onViewBenefits} 
            className="group text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-3 mx-auto"
          >
            Ver todos nuestros beneficios 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
}