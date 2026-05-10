import { useState } from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, ArrowLeft, CreditCard, Truck, Lock, CheckCircle2, Loader2, MapPin, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Importamos Supabase para actualizar el inventario

export default function Checkout({ cart, setCart, setView }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // ── 1. CÁLCULOS DE VALORES ──
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal >= 150000 ? 0 : 12000;
  const total = subtotal + envio;

  // ── 2. PAGO Y DESCUENTO AUTOMÁTICO DE INVENTARIO ──
  const handleWompiPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Recorremos cada ítem en el carrito para descontar su stock en Supabase
      for (const item of cart) {
        // A. Traemos los datos actuales del producto desde la base de datos
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('flavors, total_stock')
          .eq('id', item.id)
          .single();

        if (fetchError || !product) {
          console.error('Error obteniendo producto para inventario:', fetchError);
          continue; // Si hay error, saltamos al siguiente producto
        }

        // B. Actualizamos el stock específico de ese sabor
        if (product && Array.isArray(product.flavors)) {
          const updatedFlavors = product.flavors.map(f => {
            // Si el sabor coincide con el que compró el cliente, le restamos la cantidad
            if (f.name === item.flavor) {
              return { ...f, stock: Math.max(0, f.stock - item.quantity) };
            }
            return f;
          });

          // C. Restamos del stock total general del producto
          const newTotalStock = Math.max(0, (product.total_stock || 0) - item.quantity);

          // D. Guardamos la nueva información actualizada en Supabase
          await supabase
            .from('products')
            .update({ 
              flavors: updatedFlavors, 
              total_stock: newTotalStock 
            })
            .eq('id', item.id);
        }
      }

      // Simulamos el tiempo de espera de la pasarela bancaria
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        setCart([]); // Vaciamos el carrito automáticamente al tener éxito
      }, 2500);

    } catch (error) {
      console.error('Error crítico en el checkout:', error);
      alert('Hubo un error al procesar tu compra. Por favor, intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  // ── 3. VISTA DE ÉXITO (DORADA) ──
  if (paymentSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in bg-[#030308] px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-phoenix-gold/10 blur-[120px] pointer-events-none"></div>
        
        <div className="bg-white/2 backdrop-blur-2xl p-10 rounded-4xl border border-phoenix-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] text-center max-w-md w-full relative z-10">
          <div className="w-24 h-24 bg-phoenix-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-phoenix-gold/20">
            <CheckCircle2 size={50} className="text-phoenix-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
          </div>
          
          <h2 className="text-4xl font-serif text-white mb-2 tracking-tight">¡Orden Recibida!</h2>
          <p className="text-white/40 mb-8 text-sm font-light">Tu pedido ha sido procesado con éxito. Pronto recibirás un correo con los detalles de seguimiento.</p>
          
          <div className="bg-black/40 rounded-2xl p-5 mb-8 border border-white/5 shadow-inner">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Referencia de Orden</p>
            <p className="text-phoenix-gold font-serif text-2xl">#FNX-{Math.floor(Math.random() * 1000000)}</p>
          </div>

          <button 
            onClick={() => setView('home')}
            className="w-full bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-all shadow-xl uppercase tracking-widest text-xs"
          >
            Regresar al Inicio
          </button>
        </div>
      </div>
    );
  }

  // ── 4. VISTA DE CARRITO VACÍO ──
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in bg-[#030308]">
        <div className="w-20 h-20 bg-white/2 rounded-full flex items-center justify-center mb-6 border border-white/5">
          <ShoppingBag size={32} className="text-white/20" />
        </div>
        <h2 className="text-3xl font-serif text-white mb-4">El carrito está esperando</h2>
        <p className="text-white/40 mb-10 font-light">Agrega algunos vapes exclusivos para continuar con tu compra.</p>
        <button 
          onClick={() => setView('catalog')}
          className="bg-white/5 border border-white/10 text-white font-black px-10 py-4 rounded-full hover:bg-white/10 hover:border-phoenix-gold/50 transition-all uppercase tracking-widest text-[10px]"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 animate-fade-in bg-[#030308] relative">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-phoenix-gold/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="mb-12">
          <button 
            onClick={() => setView('catalog')} 
            className="flex items-center gap-3 text-white/30 hover:text-phoenix-gold transition-all mb-6 text-[10px] uppercase tracking-[0.2em] font-black group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continuar Explorando
          </button>
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tighter">Finaliza tu <span className="text-phoenix-gold italic">Compra</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/2 backdrop-blur-2xl p-8 md:p-10 rounded-4xl border border-white/5 shadow-2xl">
              <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-4">
                <div className="p-2 bg-phoenix-gold/10 rounded-lg">
                  <MapPin size={20} className="text-phoenix-gold" />
                </div>
                Datos de Entrega
              </h2>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Juan Diego" className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Correo Electrónico</label>
                  <input type="email" placeholder="tu@email.com" className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Teléfono Móvil</label>
                  <input type="tel" placeholder="300 000 0000" className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Dirección de Residencia</label>
                  <input type="text" placeholder="Calle, Carrera, Edificio, Apto..." className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Ciudad / Municipio</label>
                  <input type="text" placeholder="Bogotá, Medellín..." className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Departamento</label>
                  <input type="text" placeholder="Antioquia, Cundinamarca..." className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-5 py-4 outline-none focus:border-phoenix-gold/40 transition-all placeholder:text-white/10" />
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/2 backdrop-blur-2xl p-8 md:p-10 rounded-4xl border border-white/5 shadow-2xl sticky top-32">
              <h2 className="text-xl font-serif text-white mb-8">Resumen de la Orden</h2>
              
              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                {cart.map((item, index) => {
                   const mainImage = Array.isArray(item.image_url) ? item.image_url[0] : item.image_url;
                   return (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 overflow-hidden p-2 flex items-center justify-center group-hover:border-phoenix-gold/20 transition-colors">
                          {mainImage ? (
                            <img src={mainImage} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                          ) : (
                            <div className={`w-3 h-10 rounded-full bg-linear-to-tr ${item.color || 'from-gray-700 to-gray-500'} opacity-40`} />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-serif text-sm tracking-wide leading-tight">{item.name}</p>
                          <p className="text-phoenix-gold text-[9px] font-black uppercase tracking-widest mt-1">{item.flavor}</p>
                          <p className="text-white/20 text-[9px] font-bold mt-0.5">CANTIDAD: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-serif text-md">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4 mb-10">
                <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white font-serif text-lg">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Envío</span>
                  {envio === 0 ? (
                    <span className="text-phoenix-gold bg-phoenix-gold/10 px-3 py-1 rounded-full border border-phoenix-gold/20 text-[9px] font-black uppercase tracking-widest">¡Envío Gratis!</span>
                  ) : (
                    <span className="text-white font-serif text-lg">${envio.toLocaleString('es-CO')}</span>
                  )}
                </div>
                <div className="flex justify-between items-end border-t border-white/5 pt-6 mt-4">
                  <span className="text-white font-serif text-xl">Total a Pagar</span>
                  <span className="text-4xl font-serif text-phoenix-gold drop-shadow-[0_2px_15px_rgba(212,175,55,0.3)]">
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleWompiPayment}
                  disabled={isProcessing}
                  className="w-full bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold text-black font-black py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-wait hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> <span className="text-xs tracking-widest">VERIFICANDO...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-xs tracking-[0.2em]">PAGAR CON WOMPI</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-3 text-white/20">
                  <Lock size={14} /> 
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cifrado de Seguridad de 256 bits</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

Checkout.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    flavor: PropTypes.string,
    color: PropTypes.string,
    image_url: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  })).isRequired,
  setCart: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired
};
