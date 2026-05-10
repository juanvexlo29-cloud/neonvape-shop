import { X, Gift, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import PropTypes from 'prop-types';

export default function CartSidebar({ isOpen, onClose, cart, updateQuantity, setView }) {
  // ── 1. CÁLCULOS Y LÓGICA DE NEGOCIO ──
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const itemsForGift = 3;
  const missingForGift = itemsForGift - totalItems;
  const progressPercentage = Math.min((totalItems / itemsForGift) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      {/* ── OVERLAY OSCURO CON DESENFOQUE ── */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-60 animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* ── BARRA LATERAL PREMIUM ── */}
      {/* CORRECCIÓN: md:w-[450px] -> md:w-112.5 */}
      <div className="fixed inset-y-0 right-0 w-full md:w-112.5 bg-[#030308]/95 backdrop-blur-2xl border-l border-phoenix-gold/20 z-70 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-slide-in-right">
        
        {/* ── CABECERA ELITE ── */}
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag size={22} className="text-phoenix-gold" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </div>
            <h2 className="text-xl font-serif text-white tracking-tight">Tu Selección</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            aria-label="Cerrar carrito"
          >
            <X size={20} className="text-white/40 group-hover:text-phoenix-gold transition-colors" />
          </button>
        </div>

        {/* ── SECCIÓN DE REGALO (GAMIFICACIÓN DORADA) ── */}
        <div className="p-8 pb-6 border-b border-white/5 bg-white/2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift size={16} className={totalItems >= itemsForGift ? "text-phoenix-gold animate-bounce" : "text-white/20"} />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/80">
                {missingForGift > 0 
                  ? `Faltan ${missingForGift} vapes para tu regalo`
                  : '¡Regalo sorpresa desbloqueado!'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-phoenix-gold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            {/* CORRECCIÓN: via-[#F3E5AB] -> via-phoenix-gold-light */}
            <div 
              className="bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* ── LISTADO DE PRODUCTOS CON IMAGEN REAL ── */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm font-light uppercase tracking-widest">El carrito está esperando <br/>tu primera elección</p>
            </div>
          ) : (
            cart.map((item, index) => {
              const mainImage = Array.isArray(item.image_url) ? item.image_url[0] : item.image_url;

              return (
                <div key={`${item.id}-${item.flavor}-${index}`} className="flex gap-5 items-start group">
                  
                  <div className="relative w-24 h-24 shrink-0 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-2 group-hover:border-phoenix-gold/30 transition-colors">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={item.name} 
                        className="w-full h-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-4 h-12 rounded-full bg-linear-to-b ${item.color || 'from-gray-500 to-gray-800'} opacity-50`} />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h4 className="text-white font-serif text-lg leading-tight tracking-wide">{item.name}</h4>
                    <p className="text-phoenix-gold text-[10px] uppercase tracking-widest font-black">
                      {item.flavor || 'Sabor Original'}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-3">
                      <div className="flex items-center bg-white/5 rounded-lg px-2 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1, item.flavor)} 
                          className="p-1.5 text-white/40 hover:text-white transition-colors"
                        >
                          <Minus size={12}/>
                        </button>
                        <span className="text-white text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1, item.flavor)} 
                          className="p-1.5 text-white/40 hover:text-white transition-colors"
                        >
                          <Plus size={12}/>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-serif text-md">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER CON BOTÓN DE PAGO DORADO ── */}
        <div className="p-8 border-t border-white/5 bg-[#05050a]">
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-white/40 text-[10px] uppercase tracking-widest font-black">
              <span>Subtotal</span>
              <span className="text-white font-serif text-lg">${total.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black">
              <span className="text-white/40">Envío</span>
              <span className="text-phoenix-gold bg-phoenix-gold/10 px-2 py-1 rounded-md border border-phoenix-gold/20">
                Calculado en Checkout
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* CORRECCIÓN: via-[#F3E5AB] -> via-phoenix-gold-light */}
            <button 
              onClick={() => { onClose(); setView('checkout'); }}
              disabled={cart.length === 0}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex justify-between items-center px-8 transition-all duration-500 shadow-2xl group relative overflow-hidden ${
                cart.length === 0 
                  ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' 
                  : 'bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold text-black hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)]'
              }`}
            >
              <span className="text-xs">Finalizar Compra</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-white/20">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase tracking-widest font-bold">Pago 100% Cifrado y Seguro</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};
