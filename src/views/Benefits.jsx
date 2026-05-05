import { ShieldCheck, Truck, Home, BadgeCheck, Clock, HeadphonesIcon, RefreshCw, Users, Gift } from 'lucide-react';

export default function Benefits({ onShopNow }) {
  return (
    <div className="animate-fade-in bg-dark min-h-screen pt-24 pb-20">
      
      {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <span className="text-neonPurple font-bold tracking-widest text-xs mb-4 uppercase block">La Promesa NeonVape</span>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] uppercase italic tracking-tighter mb-6">
          Más que una tienda, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-neonGreen to-emerald-400">
            Una Comunidad
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Conoce en detalle por qué miles de colombianos confían en nosotros para llevar su sesión al siguiente nivel.
        </p>
      </div>

      {/* ANIMACIÓN DEL CARRO LLEGANDO A CASA */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <div className="relative w-full h-40 bg-[#0f1423] rounded-3xl border border-gray-800 overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <span className="absolute top-4 text-gray-700 font-black tracking-widest text-xs uppercase">Velocidad de Entrega Nivel Dios</span>
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gray-800 -translate-y-1/2 rounded-full">
            <div className="h-full bg-neonGreen w-full opacity-30 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 text-neonPurple z-10 flex flex-col items-center bg-[#0f1423] px-2">
            <Home size={40} strokeWidth={1.5} className="drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]" />
          </div>
          <div className="absolute top-1/2 translate-y-[-60%] animate-drive-to-home flex items-end text-neonGreen z-20">
            <div className="flex flex-col gap-1 -mr-1.25 mb-2 opacity-60">
              <div className="w-4 h-0.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-0.5 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
            </div>
            <Truck size={48} strokeWidth={1.5} className="drop-shadow-[0_0_20px_rgba(16,185,129,1)] fill-dark" />
          </div>
        </div>
      </div>

      {/* BENEFICIOS PRINCIPALES */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-[#111625] p-8 rounded-3xl border border-gray-800 hover:border-neonGreen/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center text-neonGreen mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Clock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Envíos Relámpago</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Si estás en Bogotá, tu pedido llega el mismo día. Resto del país de 24 a 48 horas.</p>
        </div>
        <div className="bg-[#111625] p-8 rounded-3xl border border-gray-800 hover:border-neonPurple/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-purple-900/30 border border-purple-800/50 flex items-center justify-center text-neonPurple mb-6 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
            <BadgeCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">100% Originales</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Nada de clones. Importamos directamente de las marcas oficiales. Código QR garantizado.</p>
        </div>
        <div className="bg-[#111625] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-blue-900/30 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Pago Seguro</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Transacciones encriptadas. Paga como prefieras: Nequi, Daviplata, PSE o Tarjeta.</p>
        </div>
        <div className="bg-[#111625] p-8 rounded-3xl border border-gray-800 hover:border-orange-500/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-orange-900/30 border border-orange-800/50 flex items-center justify-center text-orange-400 mb-6 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <HeadphonesIcon size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Soporte VIP</h3>
          <p className="text-gray-400 text-sm leading-relaxed">¿Dudas con tu pedido? Tenemos un equipo en WhatsApp listo para ayudarte 24/7.</p>
        </div>
      </div>

      {/* SECCIÓN NUEVA: MÁS RAZONES */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-800/50">
        <h2 className="text-3xl font-black text-white mb-10 text-center italic">Más Razones para Unirte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <RefreshCw className="mx-auto text-gray-500 mb-4" size={40} />
            <h4 className="text-lg font-bold text-white mb-2">Garantía de Fábrica</h4>
            <p className="text-gray-400 text-sm">¿Tu equipo llegó defectuoso? Te lo cambiamos sin preguntas engorrosas.</p>
          </div>
          <div className="text-center">
            <Gift className="mx-auto text-neonPurple mb-4" size={40} />
            <h4 className="text-lg font-bold text-white mb-2">Sorpresas en tu Caja</h4>
            <p className="text-gray-400 text-sm">Siempre enviamos pequeños regalos o stickers exclusivos en compras mayores a $150K.</p>
          </div>
          <div className="text-center">
            <Users className="mx-auto text-neonGreen mb-4" size={40} />
            <h4 className="text-lg font-bold text-white mb-2">Comunidad Exclusiva</h4>
            <p className="text-gray-400 text-sm">Acceso a preventas y descuentos secretos solo para clientes frecuentes.</p>
          </div>
        </div>
      </div>

      {/* Botón de Acción Inferior */}
      <div className="mt-10 text-center">
        <button 
          onClick={onShopNow}
          className="bg-white hover:bg-neonGreen hover:text-black text-black px-10 py-4 rounded-full font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          Ver Catálogo de Vapes
        </button>
      </div>

    </div>
  );
}