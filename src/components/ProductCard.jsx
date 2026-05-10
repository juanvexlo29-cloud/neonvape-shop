import { Star, Eye, ShoppingBag, Heart, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';

export default function ProductCard({ product, onAddToCart, onViewProduct, isFavorite, onToggleFavorite }) {
  if (!product) return null;

  // ── 1. EXTRAER LA IMAGEN PRINCIPAL (ARRAY O TEXTO) ──
  const mainImage = Array.isArray(product.image_url)
    ? product.image_url[0]
    : product.image_url;

  // ── 2. CÁLCULO DE STOCK TOTAL (COMPATIBLE CON JSONB Y DATOS VIEJOS) ──
  const parsedFlavors = Array.isArray(product?.flavors) 
    ? product.flavors.map(f => typeof f === 'string' ? { name: f, stock: 10 } : f)
    : [{ name: product?.flavor || 'Edición Especial', stock: 10 }];

  const totalStock = parsedFlavors.reduce((acc, f) => acc + (f.stock || 0), 0);
  const isOutOfStock = totalStock === 0;

  return (
    <div className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition-all duration-500 ${
      isOutOfStock ? 'opacity-80' : 'hover:bg-white/5 hover:border-phoenix-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]'
    }`}>
      
      {/* ── BOTÓN DE FAVORITOS ── */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          if(onToggleFavorite) onToggleFavorite(product); 
        }}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-black/60"
        aria-label="Alternar Favorito"
      >
        <Heart 
          size={18} 
          className={`transition-all duration-300 ${
            isFavorite 
              ? 'fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
              : 'text-white/40 group-hover:text-white/80'
          }`} 
        />
      </button>

      {/* ── BADGE (AGOTADO O PREMIUM) ── */}
      {isOutOfStock ? (
        <span className="absolute top-4 left-4 z-20 bg-red-500/80 text-white border border-red-500/30 px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-black backdrop-blur-md shadow-lg">
          Agotado
        </span>
      ) : product.badge ? (
        <span className="absolute top-4 left-4 z-20 bg-black/60 text-phoenix-gold border border-phoenix-gold/30 px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-black backdrop-blur-md">
          {product.badge}
        </span>
      ) : null}

      {/* ── IMAGEN DEL VAPORIZADOR CON LÓGICA DE AGOTADO ── */}
      <div 
        onClick={() => onViewProduct(product)}
        className="relative h-56 mb-6 rounded-xl flex justify-center items-center overflow-hidden bg-black/40 cursor-pointer border border-white/5 mt-4"
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-linear-to-tr ${product.color || 'from-gray-700 to-gray-500'} opacity-10 filter blur-2xl transition-opacity duration-500 ${!isOutOfStock && 'group-hover:opacity-30'}`}></div>
        
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.name}
            className={`relative z-10 w-auto h-48 object-contain transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] ${
              isOutOfStock 
                ? 'opacity-40 grayscale' 
                : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className={`relative z-10 w-12 h-44 bg-linear-to-b ${product.color || 'from-gray-500 to-gray-800'} rounded-md shadow-2xl transition-transform duration-500 ${isOutOfStock ? 'opacity-40 grayscale' : 'group-hover:scale-105'}`}>
              <div className="w-full h-8 bg-black/60 rounded-t-md border-b border-white/10"></div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/40 rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* ── INFORMACIÓN DEL PRODUCTO ── */}
      <div className="grow flex flex-col space-y-2">
        
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 font-bold">
          <span className={isOutOfStock ? 'text-white/30' : 'text-phoenix-gold'}>
            {product.puffs?.toLocaleString() || '7500'} puffs
          </span>
          <span>Nic {product.nicotine || '5%'}</span>
        </div>
        
        <h3 
          onClick={() => onViewProduct(product)}
          className={`text-2xl leading-tight tracking-tight cursor-pointer transition-colors mt-1 ${isOutOfStock ? 'text-white/50' : 'text-white hover:text-phoenix-gold'}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {product.name || 'Vaporizador Premium'}
        </h3>
        
        <p className="text-white/40 text-xs italic font-light">
          {product.flavor || 'Edición Especial'}
        </p>
        
        {/* Estrellas Doradas */}
        <div className={`flex items-center text-sm gap-1 pt-1 pb-4 ${isOutOfStock ? 'text-white/20' : 'text-phoenix-gold'}`}>
          <Star size={12} fill="currentColor" /> 
          <Star size={12} fill="currentColor" /> 
          <Star size={12} fill="currentColor" /> 
          <Star size={12} fill="currentColor" /> 
          <Star size={12} fill="currentColor" className="opacity-40" /> 
          <span className="text-white/40 ml-2 text-[10px] font-bold">{product.rating || '4.9'}</span>
        </div>
        
        {/* ── FOOTER DE TARJETA (PRECIO Y BOTONES) ── */}
        <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5">
          <span className={`font-serif text-2xl tracking-tight ${isOutOfStock ? 'text-white/30' : 'text-phoenix-gold'}`}>
            ${product.price?.toLocaleString('es-CO') || '0'}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onViewProduct(product); }}
              className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all hover:scale-105"
              aria-label="Ver detalles"
            >
              <Eye size={16} />
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                isOutOfStock 
                  ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed' 
                  : 'bg-phoenix-gold hover:bg-[#F3E5AB] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105'
              }`}
              aria-label={isOutOfStock ? "Producto Agotado" : "Añadir al carrito"}
            >
              {isOutOfStock ? <XCircle size={16} /> : <ShoppingBag size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    flavors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.array // Soporte para JSONB
    ]),
    badge: PropTypes.string,
    rating: PropTypes.number,
    price: PropTypes.number.isRequired,
    puffs: PropTypes.number,
    nicotine: PropTypes.string,
    color: PropTypes.string,
    image_url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func
};
