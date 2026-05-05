import { useState } from 'react';
import { ShieldCheck, ArrowLeft, CreditCard, Truck, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function Checkout({ cart, setCart, setView }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal >= 150000 ? 0 : 12000;
  const total = subtotal + envio;

  // Simulación del pago con Wompi
  const handleWompiPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 3000);
  };

  // PANTALLA DE ÉXITO
  if (paymentSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in bg-dark px-6">
        <div className="bg-[#111625] p-10 rounded-3xl border border-neonGreen/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center max-w-md w-full">
          <CheckCircle2 size={80} className="text-neonGreen mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          <h2 className="text-3xl font-black text-white mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-400 mb-6 text-sm">Tu pedido ha sido procesado por Wompi y ya estamos preparando tu envío.</p>
          <div className="bg-dark/50 rounded-xl p-4 mb-8 border border-gray-800">
            <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">Referencia de Orden</p>
            <p className="text-neonGreen font-mono font-bold text-lg">#NV-{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <button 
            onClick={() => setView('home')}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-neonGreen transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA DE CARRITO VACÍO
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in">
        <Truck size={64} className="text-gray-700 mb-6" />
        <h2 className="text-3xl font-black text-white mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-8">Agrega algunos vapes de nuestra colección para continuar.</p>
        <button 
          onClick={() => setView('catalog')}
          className="bg-neonGreen text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fade-in bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-8">
          <button onClick={() => setView('catalog')} className="flex items-center gap-2 text-gray-400 hover:text-neonGreen transition-colors mb-4 text-sm font-bold">
            <ArrowLeft size={16} /> Seguir comprando
          </button>
          <h1 className="text-4xl font-black text-white italic tracking-tight">Finaliza tu Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* FORMULARIO COMPLETO DE ENVÍO */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111625] p-6 md:p-8 rounded-3xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Truck className="text-neonGreen" /> Datos de Envío
              </h2>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Juan Diego" className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  <input type="email" placeholder="tu@email.com" className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teléfono / Celular</label>
                  <input type="tel" placeholder="300 000 0000" className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dirección de Entrega</label>
                  <input type="text" placeholder="Calle 123 # 45 - 67, Apto 8" className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ciudad</label>
                  <input type="text" placeholder="Bogotá, Medellín..." className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Departamento</label>
                  <input type="text" placeholder="Cundinamarca, Antioquia..." className="w-full bg-dark/50 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-neonGreen transition-colors" />
                </div>
              </form>
            </div>
          </div>

          {/* RESUMEN Y BOTÓN WOMPI */}
          <div className="lg:col-span-5">
            <div className="bg-[#111625] p-6 md:p-8 rounded-3xl border border-gray-800 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Resumen de la Orden</h2>
              
              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-linear-to-tr ${item.color} opacity-80 flex-shrink-0`}></div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight">{item.name}</p>
                        <p className="text-gray-500 text-xs">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold text-sm">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Envío</span>
                  {envio === 0 ? (
                    <span className="text-neonGreen font-bold tracking-wider uppercase text-xs">¡Gratis!</span>
                  ) : (
                    <span className="text-white font-bold">${envio.toLocaleString('es-CO')}</span>
                  )}
                </div>
                <div className="flex justify-between items-end border-t border-gray-800 pt-4 mt-2">
                  <span className="text-white font-bold">Total a Pagar</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-neonGreen to-white">
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              <div className="bg-[#0f1423] rounded-2xl p-5 border border-blue-900/30 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-2 font-bold text-sm">
                  <Lock size={16} /> Pago 100% Seguro
                </div>
                
                <button 
                  onClick={handleWompiPayment}
                  disabled={isProcessing}
                  className="w-full bg-linear-to-r from-[#0033a0] to-[#0051ff] hover:shadow-[0_0_20px_rgba(0,81,255,0.4)] text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" /> PROCESANDO...
                    </>
                  ) : (
                    <>
                      <CreditCard className="group-hover:rotate-12 transition-transform" />
                      PAGAR CON WOMPI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}