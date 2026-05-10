import { 
  ShieldCheck, 
  Truck, 
  Star, 
  Headphones, 
  Zap, 
  Award,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import PropTypes from 'prop-types';

export default function Benefits({ onShopNow }) {
  const benefitsList = [
    {
      icon: ShieldCheck,
      title: "Autenticidad Garantizada",
      description: "Cada dispositivo Neón incluye un código QR único de verificación. No arriesgues tu salud con imitaciones; nosotros solo importamos originalidad.",
      tag: "Seguridad"
    },
    {
      icon: Truck,
      title: "Logística Relámpago",
      description: "Entregas en menos de 24 horas en Bogotá y envíos nacionales prioritarios. Tu satisfacción no puede esperar.",
      tag: "Rapidez"
    },
    {
      icon: Headphones,
      title: "Soporte VIP 24/7",
      description: "Nuestros expertos en vapeo están disponibles por WhatsApp para asesorarte en sabores, potencias y mantenimiento de tu equipo.",
      tag: "Servicio"
    },
    {
      icon: Award,
      title: "Programa Neon Rewards",
      description: "Acumula puntos con cada compra y canjéalos por descuentos exclusivos o vapes de edición limitada.",
      tag: "Lealtad"
    }
  ];

  return (
    <div className="bg-[#030308] min-h-screen text-white animate-fade-in pt-28 pb-20 relative overflow-hidden">
      
      {/* ── 1. ELEMENTOS DE DISEÑO DE FONDO ── */}
      <div className="absolute top-0 left-1/4 w-[60%] h-[40%] bg-phoenix-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-phoenix-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── 2. HERO DE BENEFICIOS ── */}
        <header className="text-center mb-24">
          <span className="inline-block py-1.5 px-4 rounded-full border border-phoenix-gold/30 bg-phoenix-gold/10 text-phoenix-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 animate-pulse">
            The Neon Standard
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter mb-6 leading-tight">
            ¿Por qué elegir <span className="text-phoenix-gold italic">Neón?</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Más que una tienda, somos el club de vapeo más exclusivo de Colombia. 
            Calidad insuperable, servicio de élite y productos que definen un estilo de vida.
          </p>
        </header>

        {/* ── 3. CUADRÍCULA DE BENEFICIOS (DISEÑO PREMIUM) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {benefitsList.map((benefit, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white/2 border border-white/5 rounded-4xl p-10 backdrop-blur-3xl transition-all duration-500 hover:bg-white/5 hover:border-phoenix-gold/20"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-phoenix-gold/10 rounded-2xl border border-phoenix-gold/20 text-phoenix-gold group-hover:scale-110 transition-transform duration-500">
                    <benefit.icon size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-phoenix-gold transition-colors">
                    {benefit.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-phoenix-gold transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                  {benefit.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">
                  Saber más <ChevronRight size={14} className="ml-2 text-phoenix-gold" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 4. SECCIÓN DE RECONOCIMIENTO ── */}
        <section className="bg-linear-to-r from-phoenix-gold/10 via-transparent to-transparent border-l-2 border-phoenix-gold rounded-r-4xl p-12 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Únete a la <span className="text-phoenix-gold">Élite</span> del Vapeo
              </h2>
              <p className="text-white/50 font-light leading-loose">
                Nuestros clientes no solo compran vapes; adquieren la tranquilidad de saber que cuentan con el respaldo de la tienda #1 en tecnología de punta. Únete a miles de vapers que ya disfrutan de la experiencia definitiva.
              </p>
              <button 
                onClick={onShopNow}
                className="inline-flex items-center gap-3 bg-phoenix-gold text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all hover:scale-105 shadow-xl shadow-phoenix-gold/10"
              >
                Comenzar ahora <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/5 p-8 rounded-3xl text-center border border-white/5">
                <p className="text-3xl font-serif text-phoenix-gold mb-1">50k+</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40">Clientes Felices</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl text-center border border-white/5">
                <p className="text-3xl font-serif text-phoenix-gold mb-1">Bogotá</p>
                <p className="text-[9px] uppercase tracking-widest text-white/40">Sede Principal</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SECCIÓN DE COMPARACIÓN (OPCIONAL/LUJO) ── */}
        <div className="text-center py-10">
          <div className="inline-flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
            <Zap size={14} className="text-phoenix-gold" /> 
            Tecnología Neon · Calidad Superior · Estilo Elite
            <Zap size={14} className="text-phoenix-gold" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Validación de Props para limpiar la consola
Benefits.propTypes = {
  onShopNow: PropTypes.func.isRequired
};
