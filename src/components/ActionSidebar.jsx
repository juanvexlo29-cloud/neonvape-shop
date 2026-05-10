import { X, ArrowRight, ShoppingBag, Heart, History } from 'lucide-react';
import PropTypes from 'prop-types';

export default function ActionSidebar({ title, items, isOpen, onClose, onViewProduct, emptyMessage }) {
  
  // Determinamos qué icono mostrar según el título para un toque más dinámico
  const isFavorites = title.toLowerCase().includes('favoritos');

  return (
    <div className={`fixed inset-0 z-60 transition-all duration-500 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      
      {/* ── OVERLAY CON DESENFOQUE ── */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* ── PANEL LATERAL PREMIUM ── */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#030308]/95 backdrop-blur-2xl border-l border-phoenix-gold/20 shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* ── CABECERA ── */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
          <div className="flex items-center gap-3">
            {isFavorites ? (
              <Heart size={18} className="text-phoenix-gold fill-phoenix-gold/20" />
            ) : (
              <History size={18} className="text-phoenix-gold" />
            )}
            <h2 className="text-white text-xl font-serif tracking-tight">
              {title}<span className="text-phoenix-gold">.</span>
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            aria-label="Cerrar panel"
          >
            <X size={20} className="text-white/40 group-hover:text-phoenix-gold transition-colors" />
          </button>
        </div>

        {/* ── LISTADO DE PRODUCTOS ── */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <ShoppingBag size={40} strokeWidth={1} />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black leading-loose px-10">
                {emptyMessage}
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              // ── CORRECCIÓN: Extraer la primera imagen del array de Supabase ──
              const mainImage = Array.isArray(item.image_url) ? item.image_url[0] : item.image_url;

              return (
                <div 
                  key={`${item.id}-${idx}`} 
                  className="flex gap-5 items-center bg-white/2 p-4 rounded-3xl border border-white/5 group hover:border-phoenix-gold/30 hover:bg-white/5 transition-all duration-500"
                >
                  {/* Miniatura de Imagen Real */}
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center p-2">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={item.name} 
                        className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      /* Fallback visual elegante */
                      <div className={`w-3 h-10 rounded-full bg-linear-to-b ${item.color || 'from-gray-700 to-gray-500'} opacity-30`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-serif text-md truncate tracking-wide">
                      {item.name}
                    </h4>
                    <p className="text-phoenix-gold text-[9px] uppercase tracking-widest font-black mt-1">
                      {item.flavor || 'Premium Edition'}
                    </p>
                    <p className="text-white/40 text-[11px] mt-1 font-serif">
                      ${item.price?.toLocaleString('es-CO')}
                    </p>
                  </div>

                  <button 
                    onClick={() => { onClose(); onViewProduct(item); }}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-phoenix-gold group-hover:text-black transition-all duration-300 hover:scale-105"
                    aria-label="Ver producto"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── DECORACIÓN INFERIOR ── */}
        <div className="p-8 border-t border-white/5 bg-black/20 text-center">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-black">
            Neón Elite Collection 2026
          </p>
        </div>
      </div>
    </div>
  );
}

ActionSidebar.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string
};
