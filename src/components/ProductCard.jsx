import { Star, Eye, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
  // Función para determinar el color del badge
  const getBadgeColor = (badge) => {
    if (badge === 'PREMIUM') return 'bg-blue-600';
    if (badge === 'POCO STOCK') return 'bg-neonRed'; // Usando nuestra variable neonRed
    if (badge === 'NUEVO') return 'bg-neonPurple';
    if (badge === 'TOP VENTAS') return 'bg-orange-500';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-[#111625] rounded-2xl p-5 border border-gray-800 hover:border-neonGreen/50 transition-all group relative overflow-hidden flex flex-col h-full animate-fade-in">
      
      {/* Badge Dinámico (Top Izquierda como en la imagen) */}
      {product.badge && (
        <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1.5 rounded-full text-white tracking-wider ${getBadgeColor(product.badge)}`}>
          {product.badge}
        </span>
      )}

      {/* Imagen con Resplandor (Glow) IDÉNTICO A LA IMAGEN */}
      {/* Añadido onClick y cursor-pointer para ir al detalle */}
      <div 
        onClick={() => onViewProduct(product)}
        className="relative h-60 mb-5 rounded-xl flex justify-center items-center overflow-hidden bg-black/20 cursor-pointer"
      >
        {/* Efecto Glow de fondo basado en el color del producto */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-linear-to-tr ${product.color} opacity-20 filter blur-2xl group-hover:opacity-40 transition-opacity`}></div>
        
        {/* Representación del Vape con el degradado exacto */}
        <div className={`relative z-10 w-10 h-44 bg-linear-to-b ${product.color} rounded-md shadow-2xl`}>
            {/* Detalles del vaporizador */}
            <div className="w-full h-8 bg-black/40 rounded-t-md border-b border-white/10"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/50 rounded-full"></div>
        </div>
      </div>
      
      {/* Información del Producto */}
      <div className="grow flex flex-col mt-2 space-y-1.5">
        
        {/* Puffs y Nicotina (Arriba del título, pequeños como en la imagen) */}
        <div className="flex justify-between text-[11px] text-gray-400 font-medium">
          <span className="text-neonGreen font-bold">{product.puffs.toLocaleString()} puffs</span>
          <span>Nicotina {product.nicotine}</span>
        </div>
        
        {/* Nombre Grande */}
        {/* Añadido onClick, cursor-pointer y hover para ir al detalle */}
        <h3 
          onClick={() => onViewProduct(product)}
          className="text-white font-black text-2xl leading-tight tracking-tight cursor-pointer hover:text-neonGreen transition-colors"
        >
          {product.name}
        </h3>
        
        {/* Sabor */}
        <p className="text-gray-500 text-sm italic">{product.flavor}</p>
        
        {/* Estrellas y Valoración (Debajo del título como en la imagen) */}
        <div className="flex items-center text-yellow-500 text-sm gap-1 pb-4">
          <Star size={14} fill="currentColor" /> 
          <Star size={14} fill="currentColor" /> 
          <Star size={14} fill="currentColor" /> 
          <Star size={14} fill="currentColor" /> 
          <Star size={14} fill="currentColor" className="opacity-50" /> 
          <span className="text-gray-400 ml-1 text-xs">{product.rating}</span>
        </div>
        
        {/* Footer de la tarjeta con Precio Grande en COP */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-800">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-neonGreen to-white font-black text-2xl tracking-tight">
            $ {product.price.toLocaleString('es-CO')}
          </span>
          
          {/* Botones de Acción Modificados (Ver Detalle y Añadir al Carro) */}
          <div className="flex gap-2">
            <button 
              onClick={() => onViewProduct(product)}
              className="flex items-center gap-1.5 bg-gray-800/80 hover:bg-white hover:text-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all group-hover:scale-105"
            >
              <Eye size={16} /> Ver
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-neonGreen hover:bg-emerald-400 text-black p-2 rounded-xl transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:scale-105"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}