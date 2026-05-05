import { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, BatteryCharging, Flame, Gift } from 'lucide-react';

export default function ProductDetail({ product, setView, onAddToCart }) {
  // Estado para el sabor
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors ? product.flavors[0] : product.flavor);
  // Nuevo estado para la cantidad
  const [quantity, setQuantity] = useState(1);

  // Función para determinar el color del badge
  const getBadgeColor = (badge) => {
    if (badge === 'PREMIUM') return 'bg-blue-600';
    if (badge === 'POCO STOCK') return 'bg-red-500';
    if (badge === 'NUEVO') return 'bg-purple-500';
    if (badge === 'TOP VENTAS') return 'bg-purple-600/80 text-white'; 
    return 'bg-gray-600';
  };

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fade-in bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => setView('catalog')}
          className="flex items-center gap-2 text-gray-400 hover:text-neonGreen transition-colors mb-8 text-sm font-bold w-fit"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: Imagen del Vape */}
          <div className="bg-dark rounded-3xl p-10 flex justify-center items-center relative overflow-hidden border border-gray-800/50 h-125">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-tr ${product.color} opacity-20 filter blur-3xl`}></div>
            
            <div className={`relative z-10 w-16 h-80 bg-linear-to-b ${product.color} rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between p-1`}>
                <div className="w-full h-12 bg-black/60 rounded-t-md border-b border-white/10"></div>
                <div className="w-full h-4 bg-black/80 rounded-b-md"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Detalles del producto */}
          <div className="flex flex-col">
            
            {/* Badge */}
            {product.badge && (
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 tracking-wider ${getBadgeColor(product.badge)}`}>
                {product.badge}
              </span>
            )}

            {/* Título */}
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-2 tracking-tight">
              {product.name}
            </h1>

            {/* Reseñas */}
            <div className="flex items-center text-yellow-500 text-sm gap-1 mb-6">
              <Star size={16} fill="currentColor" /> 
              <Star size={16} fill="currentColor" /> 
              <Star size={16} fill="currentColor" /> 
              <Star size={16} fill="currentColor" /> 
              <Star size={16} fill="currentColor" className="opacity-50" /> 
              <span className="text-gray-400 ml-2 text-sm">({product.rating}) · 248 reseñas</span>
            </div>

            {/* Precio */}
            <div className="text-5xl font-black text-neonGreen mb-6 tracking-tighter">
              $ {product.price.toLocaleString('es-CO')}
            </div>

            {/* Descripción */}
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
              Máxima duración con sabor explosivo. Diseño ergonómico y batería recargable USB-C para una experiencia premium.
            </p>

            {/* Cajas de Especificaciones */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#111625] border border-gray-800 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Puffs</span>
                <span className="text-white font-black text-xl">{product.puffs.toLocaleString()}</span>
              </div>
              <div className="bg-[#111625] border border-gray-800 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Nicotina</span>
                <span className="text-white font-black text-xl">{product.nicotine}</span>
              </div>
              <div className="bg-[#111625] border border-gray-800 rounded-2xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Recargable</span>
                <span className="text-white font-black text-lg flex items-center gap-1">USB-C <BatteryCharging size={16} className="text-neonGreen"/></span>
              </div>
            </div>

            {/* Selector de Sabor */}
            <div className="mb-8">
              <span className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Sabor</span>
              <div className="flex flex-wrap gap-3">
                {(product.flavors || [product.flavor, 'Menta Hielo', 'Sandía', 'Mango Tango']).map((sabor) => (
                  <button
                    key={sabor}
                    onClick={() => setSelectedFlavor(sabor)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                      selectedFlavor === sabor 
                        ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {sabor}
                  </button>
                ))}
              </div>
            </div>

            {/* ALERTA DE STOCK (NUEVO) */}
            <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3 flex items-center gap-3 mb-6">
              <Flame size={18} className="text-red-500" />
              <span className="text-red-400 text-sm font-bold">ALTA DEMANDA: ¡Solo quedan {product.stock || 7} unidades!</span>
            </div>

            {/* CONTROLES DE CANTIDAD Y COMPRA (NUEVO) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              
              {/* Selector de Cantidad */}
              <div className="flex items-center justify-between bg-[#0B0F19] border border-gray-800 rounded-xl px-5 py-2 w-full sm:w-36 shrink-0 h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-gray-400 hover:text-white transition-colors text-xl px-2"
                >−</button>
                <span className="text-white font-black">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-gray-400 hover:text-white transition-colors text-xl px-2"
                >+</button>
              </div>

              {/* Botón Agregar al Carrito (Gradiente Neon) */}
              <button 
                onClick={() => {
                  // Enviamos el producto x cantidad de veces al carrito
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart({ ...product, flavor: selectedFlavor });
                  }
                }}
                className="flex-1 bg-linear-to-r from-neonGreen to-[#c084fc] hover:opacity-90 text-black font-black py-0 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(134,239,172,0.3)] h-14"
              >
                <ShoppingBag size={20} className="mb-0.5" />
                Agregar al Carrito
              </button>
            </div>

            {/* BANNER PROMOCIONAL (NUEVO) */}
            <div className="bg-[#1a1025]/50 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
              <Gift size={20} className="text-[#c084fc] shrink-0 mt-0.5" />
              <p className="text-sm text-purple-200/80 leading-relaxed">
                <span className="font-bold text-[#c084fc]">¡Lleva 2 más</span> y obtén ENVÍO GRATIS + un sabor sorpresa de regalo. 🎁
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}