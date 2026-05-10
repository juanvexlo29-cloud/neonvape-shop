import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Flame, Plus, Minus, Check, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

export default function ProductDetail({ product, setView, onAddToCart }) {
  
  // ── 1. PROCESAMIENTO INTELIGENTE DE SABORES Y STOCK (JSONB) ──
  // Si el producto viene con la nueva estructura de stock, la usamos.
  // Si es un producto antiguo (array de strings), lo adaptamos al vuelo.
  const parsedFlavors = Array.isArray(product?.flavors) 
    ? product.flavors.map(f => typeof f === 'string' ? { name: f, stock: 10 } : f)
    : [{ name: product?.flavor || 'Edición Especial', stock: 10 }];

  // Autoseleccionar el primer sabor que SÍ tenga stock
  const firstAvailable = parsedFlavors.find(f => f.stock > 0)?.name || parsedFlavors[0]?.name;
  
  const [selectedFlavor, setSelectedFlavor] = useState(firstAvailable);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Saber si el sabor seleccionado actualmente está agotado
  const currentFlavorObj = parsedFlavors.find(f => f.name === selectedFlavor);
  const isOutOfStock = currentFlavorObj?.stock === 0;

  // ── 2. ESTADOS Y LÓGICA DEL SLIDER DE IMÁGENES ──
  const images = Array.isArray(product?.image_url) 
    ? product.image_url 
    : (product?.image_url ? [product.image_url] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  // Evitar que la cantidad seleccionada sea mayor al stock disponible
  useEffect(() => {
    if (currentFlavorObj && quantity > currentFlavorObj.stock && currentFlavorObj.stock > 0) {
      setQuantity(currentFlavorObj.stock);
    } else if (currentFlavorObj?.stock === 0) {
      setQuantity(1);
    }
  }, [selectedFlavor, currentFlavorObj, quantity]);

  if (!product) return null;

  // Navegación del slider
  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Táctil (Swipe)
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();
  };

  // ── 3. FUNCIÓN DEL CARRITO ──
  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart({ ...product, flavor: selectedFlavor, quantity: quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#030308] min-h-screen text-white animate-fade-in pt-28 pb-20 relative overflow-hidden">
      
      {/* ── ANIMACIONES DE FONDO ELITE ── */}
      <style>{`
        @keyframes glowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animate-glow {
          background: radial-gradient(circle at top right, rgba(212,175,55,0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(154,111,24,0.08), transparent 40%);
          background-size: 200% 200%;
          animation: glowShift 15s ease infinite;
        }

        @keyframes floatParticles {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        .particle {
          position: absolute;
          background: #D4AF37;
          border-radius: 1px;
          opacity: 0;
          pointer-events: none;
          animation: floatParticles linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 bg-animate-glow pointer-events-none"></div>

      {/* Partículas doradas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const style = {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-10px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          };
          return <div key={i} className="particle" style={style} />;
        })}
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Botón Volver */}
        <button 
          onClick={() => setView('catalog')} 
          className="flex items-center gap-3 text-white/40 hover:text-phoenix-gold transition-colors mb-10 text-[10px] uppercase tracking-widest font-black group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ── COLUMNA IZQUIERDA: SLIDER INTERACTIVO ── */}
          <div className="bg-[#07070a]/50 border border-white/5 rounded-4xl p-10 flex items-center justify-center relative h-125 md:h-150 shadow-2xl backdrop-blur-sm group overflow-hidden select-none">
            
            {/* Glow de fondo */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-tr ${product.color || 'from-gray-700 to-gray-500'} opacity-10 filter blur-[100px] group-hover:opacity-20 transition-opacity duration-700`}></div>

            {images.length > 0 ? (
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndHandler}
              >
                {/* Imágenes superpuestas con efecto Fade */}
                {images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`${product.name} - Vista ${idx + 1}`}
                    draggable="false"
                    className={`absolute w-auto max-h-[85%] object-contain transition-all duration-700 ease-in-out drop-shadow-[0_0_25px_rgba(255,255,255,0.05)] ${
                      idx === currentIndex 
                        ? 'opacity-100 z-10 scale-100 group-hover:scale-105 group-hover:-rotate-2' 
                        : 'opacity-0 z-0 scale-95'
                    }`}
                  />
                ))}

                {/* Controles de Flechas */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-0 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/50 hover:text-phoenix-gold hover:bg-black/60 transition-all duration-300 md:opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-0 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/50 hover:text-phoenix-gold hover:bg-black/60 transition-all duration-300 md:opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                  </>
                )}

                {/* Indicadores / Puntos (Dots) */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 z-20 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentIndex 
                            ? 'w-6 h-1.5 bg-phoenix-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                            : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                        }`}
                        aria-label={`Ir a imagen ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Fallback (Vape CSS si no hay imágenes) */
              <div className={`relative z-10 w-28 h-96 bg-linear-to-b ${product.color || 'from-gray-500 to-gray-800'} rounded-xl shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2`}>
                <div className="w-full h-16 bg-black/60 rounded-t-xl border-b border-white/10"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/40 rounded-full"></div>
              </div>
            )}
            
            {/* Destello sutil al pasar el mouse por la tarjeta */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-phoenix-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          </div>

          {/* ── COLUMNA DERECHA: DETALLES ── */}
          <div className="flex flex-col justify-center">
            
            {/* Etiqueta / Badge */}
            {product.badge && (
              <span className="inline-block px-4 py-1.5 bg-phoenix-gold/10 border border-phoenix-gold/30 text-phoenix-gold rounded-full text-[10px] uppercase tracking-widest font-black w-fit mb-6 animate-pulse">
                {product.badge}
              </span>
            )}

            {/* Nombre del Producto */}
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tighter">
              {product.name}
            </h1>

            {/* Estrellas y Reseñas */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-phoenix-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 4.9) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 4.9) ? "" : "opacity-40"} />
                ))}
              </div>
              <span className="text-white/40 text-xs font-bold tracking-widest">{product.rating || '4.9'} · 248 reseñas</span>
            </div>

            {/* Precio */}
            <div className="text-5xl font-serif text-phoenix-gold mb-6 tracking-tight drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
              ${product.price?.toLocaleString('es-CO')}
            </div>

            {/* Descripción */}
            <p className="text-white/50 font-light leading-relaxed mb-10 max-w-lg font-sans">
              {product.description || 'Máxima duración con sabor explosivo. Diseño ergonómico y batería recargable para una experiencia premium inigualable.'}
            </p>

            {/* Cuadrícula de Especificaciones */}
            <div className="grid grid-cols-3 gap-4 mb-10 font-sans">
              {[
                { label: 'Puffs', value: product.puffs?.toLocaleString() || '7.500+' },
                { label: 'Nicotina', value: product.nicotine || '5%' },
                { label: 'Recargable', value: product.rechargeable || 'Sí (USB-C)' }
              ].map((spec, i) => (
                <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-5 text-center transition-all duration-300 hover:border-phoenix-gold/30 hover:bg-white/3 hover:-translate-y-1">
                  <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1.5 font-bold">{spec.label}</p>
                  <p className="text-white font-serif text-xl tracking-wide">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* ── SELECTOR DE SABORES CON LÓGICA DE INVENTARIO ── */}
            <div className="mb-10 font-sans">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <Flame size={14} className="text-phoenix-gold" /> Selecciona tu sabor
                </p>
                {/* Mostrar cuántos quedan si hay poco stock (opcional, ayuda a vender) */}
                {currentFlavorObj?.stock > 0 && currentFlavorObj?.stock <= 5 && (
                  <span className="text-red-400 text-[9px] uppercase tracking-widest font-black animate-pulse">
                    ¡Solo quedan {currentFlavorObj.stock}!
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {parsedFlavors.map((flavorObj, idx) => {
                  const isExhausted = flavorObj.stock === 0;
                  const isSelected = selectedFlavor === flavorObj.name;

                  return (
                    <button
                      key={`${flavorObj.name}-${idx}`}
                      disabled={isExhausted}
                      onClick={() => setSelectedFlavor(flavorObj.name)}
                      className={`px-6 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 border relative overflow-hidden ${
                        isExhausted 
                          ? 'bg-white/2 border-white/5 text-white/20 cursor-not-allowed' // Estilo Agotado
                          : isSelected 
                            ? 'bg-phoenix-gold/10 border-phoenix-gold text-phoenix-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' // Seleccionado
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white' // Normal
                      }`}
                    >
                      <span className={isExhausted ? 'line-through opacity-50' : ''}>{flavorObj.name}</span>
                      
                      {/* Badge pequeño de "Agotado" */}
                      {isExhausted && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="text-[8px] uppercase tracking-widest text-red-400">Agotado</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── ACCIONES: CANTIDAD Y AÑADIR AL CARRITO ── */}
            <div className="flex gap-4 mb-8 font-sans">
              {/* Controles de Cantidad (Bloqueados si está agotado o al llegar al límite de stock) */}
              <div className={`flex items-center justify-between rounded-2xl px-2 w-32 shrink-0 border transition-colors ${isOutOfStock ? 'bg-white/2 border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}>
                <button 
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-3 text-white/50 hover:text-phoenix-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold">{quantity}</span>
                <button 
                  disabled={isOutOfStock || quantity >= (currentFlavorObj?.stock || 1)}
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-3 text-white/50 hover:text-phoenix-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Botón Principal */}
              <button 
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 py-4.5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
                  isOutOfStock
                    ? 'bg-white/5 border border-white/5 text-white/30 cursor-not-allowed' // Botón Gris Agotado
                    : isAdded 
                      ? 'bg-green-500 text-black shadow-green-500/20' // Botón Éxito
                      : 'bg-linear-to-r from-phoenix-gold via-phoenix-gold-light to-phoenix-gold bg-size-[200%_auto] hover:bg-right text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_5px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]' // Botón Oro Premium
                }`}
              >
                {isOutOfStock ? (
                  <><XCircle size={20} strokeWidth={2.5} /> Agotado</>
                ) : isAdded ? (
                  <><Check size={20} strokeWidth={3} /> Agregado</>
                ) : (
                  <><ShoppingCart size={20} strokeWidth={2.5} /> Añadir al carrito</>
                )}
              </button>
            </div>

            {/* Garantía */}
            <div className="flex items-center gap-5 text-white/40 bg-white/2 border border-white/5 rounded-2xl p-6 transition-colors hover:border-phoenix-gold/20 font-sans">
              <ShieldCheck size={30} className="text-phoenix-gold shrink-0" strokeWidth={1} />
              <p className="text-xs font-light leading-relaxed">
                <strong className="text-white font-bold mr-1">Garantía Neón Elite:</strong> Producto 100% original con código QR de verificación. Si presenta fallas de fábrica en las primeras 48 horas, te lo cambiamos inmediatamente sin costo adicional.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    flavor: PropTypes.string,
    flavors: PropTypes.array, // Actualizado para soportar array de objetos JSONB
    badge: PropTypes.string,
    rating: PropTypes.number,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    puffs: PropTypes.number,
    nicotine: PropTypes.string,
    rechargeable: PropTypes.string,
    color: PropTypes.string,
    image_url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
  }).isRequired,
  setView: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};
