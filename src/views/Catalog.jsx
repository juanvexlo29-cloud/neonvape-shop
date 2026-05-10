import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProductCard from '../components/ProductCard';
import { Search, Flame, ChevronDown, Edit, Trash2 } from 'lucide-react';

export default function Catalog({ 
  products = [], 
  isAdmin = false, 
  onDeleteProduct, 
  onEditProduct, // Añadida la prop para editar
  onAddToCart, 
  onViewProduct, 
  favorites = [], 
  onToggleFavorite 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPuffs, setSelectedPuffs] = useState('Todos');

  const puffRanges = ['Todos', '700 (Inicio)', '3000 (Media)', '6000 (Alta)', '7500+ (Ultra)'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.flavors?.join(', ') || '').toLowerCase().includes(searchTerm.toLowerCase());

      let matchesPuffs = true;
      if (selectedPuffs !== 'Todos') {
        const puffValue = parseInt(selectedPuffs.split(' ')[0]);
        if (selectedPuffs.includes('+')) {
          matchesPuffs = (product.puffs || 0) >= puffValue;
        } else {
          matchesPuffs = product.puffs === puffValue;
        }
      }
      return matchesSearch && matchesPuffs;
    });
  }, [products, searchTerm, selectedPuffs]);

  return (
    <div className="bg-[#030308] min-h-screen pb-20 relative animate-fade-in">
      
      {/* ── HERO CON VIDEO CINEMATOGRÁFICO EN BUCLE ── */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden border-b border-phoenix-gold/20">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted /* <--- CORRECCIÓN APLICADA AQUÍ: muted en vez de defaultMuted */
            playsInline
            onEnded={(e) => e.target.play()} 
            poster="https://res.cloudinary.com/djbcgcmma/video/upload/f_auto,q_auto/v1778354400/Video_Project_12_ez8waf.jpg" 
            className="w-full h-full object-cover opacity-40"
          >
            <source src="https://res.cloudinary.com/djbcgcmma/video/upload/f_auto,q_auto/v1778354400/Video_Project_12_ez8waf.mp4" type="video/mp4" />
            <div className="w-full h-full bg-linear-to-b from-phoenix-gold/10 to-transparent"></div>
          </video>
          <div className="absolute inset-0 bg-linear-to-t from-[#030308] via-[#030308]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 mt-10">
          <span className="inline-block py-1.5 px-4 rounded-full border border-phoenix-gold/30 bg-phoenix-gold/10 text-phoenix-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 animate-pulse">
            Colección Elite 2026
          </span>
          <h1 className="text-6xl md:text-8xl text-white font-serif tracking-tighter mb-4 leading-none">
            Catálogo <span className="text-phoenix-gold italic">Neón</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.2em] font-light max-w-lg mx-auto">
            Explora la selección más exclusiva de vaporizadores premium en Colombia.
          </p>
        </div>
      </section>

      {/* ── BARRA DE FILTROS INTELIGENTE (Sticky) ── */}
      <section className="sticky top-24 z-40 max-w-7xl mx-auto px-6 -mt-10">
        <div className="bg-[#07070a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-full p-2 shadow-2xl flex flex-col md:flex-row gap-2">
          
          <div className="relative grow group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-phoenix-gold transition-colors" size={20} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué sabor buscas hoy? (ej: Mango, Mint...)"
              className="w-full bg-white/5 border border-transparent text-white rounded-2xl md:rounded-full pl-14 pr-6 py-4 text-sm outline-none focus:border-phoenix-gold/30 focus:bg-white/10 transition-all placeholder:text-white/20 font-sans"
            />
          </div>

          <div className="relative shrink-0 md:w-64 group">
            <Flame className="absolute left-6 top-1/2 -translate-y-1/2 text-phoenix-gold/50 group-focus-within:text-phoenix-gold transition-colors" size={20} />
            <select 
              value={selectedPuffs}
              onChange={(e) => setSelectedPuffs(e.target.value)}
              className="w-full bg-white/5 border border-transparent text-white rounded-2xl md:rounded-full pl-14 pr-12 py-4 text-sm outline-none focus:border-phoenix-gold/30 focus:bg-white/10 transition-all appearance-none cursor-pointer font-sans"
            >
              {puffRanges.map(range => (
                <option key={range} value={range} className="bg-[#07070a] text-white py-2">{range}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
          </div>
        </div>
      </section>

      {/* ── LISTADO DE PRODUCTOS DINÁMICOS ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        
        <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <p className="text-phoenix-gold text-[10px] font-black uppercase tracking-[0.3em]">Resultados</p>
            <h2 className="text-white text-2xl font-serif tracking-wide">
              Vapes <span className="text-white/40">({filteredProducts.length})</span>
            </h2>
          </div>
          
          {(searchTerm || selectedPuffs !== 'Todos') && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedPuffs('Todos'); }}
              className="text-white/40 text-[10px] uppercase tracking-widest font-black hover:text-phoenix-gold transition-colors pb-1"
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => (
              
              <div key={product.id} className="relative group h-full">
                
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onViewProduct={onViewProduct} 
                  isFavorite={favorites.some(fav => fav.id === product.id)} 
                  onToggleFavorite={onToggleFavorite}
                />

                {/* ── GRUPO DE BOTONES DEL DUEÑO ── */}
                {isAdmin && (
                  <div className="absolute -top-3 -left-3 z-50 flex gap-2">
                    {/* Botón Editar */}
                    <button 
                      onClick={() => onEditProduct && onEditProduct(product)}
                      className="p-3 bg-phoenix-gold text-black rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 hover:brightness-110 transition-all border-2 border-[#030308]"
                      title="Editar este producto"
                    >
                      <Edit size={18} strokeWidth={2.5} />
                    </button>
                    
                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                      className="p-3 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-110 hover:brightness-110 transition-all border-2 border-[#030308]"
                      title="Eliminar este producto permanentemente"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/2 rounded-4xl border border-white/5 border-dashed relative overflow-hidden backdrop-blur-sm">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-phoenix-gold/5 blur-[100px] pointer-events-none"></div>
             <Flame size={60} className="mx-auto text-phoenix-gold/20 mb-6" strokeWidth={1} />
             <h3 className="text-3xl font-serif text-white mb-3">Sin coincidencias</h3>
             <p className="text-white/40 text-sm max-w-xs mx-auto font-light leading-relaxed">
               No encontramos lo que buscas en esta categoría. Intenta con otros términos o filtros.
             </p>
          </div>
        )}
      </section>
    </div>
  );
}

Catalog.propTypes = {
  products: PropTypes.array,
  isAdmin: PropTypes.bool,
  onDeleteProduct: PropTypes.func,
  onEditProduct: PropTypes.func, // Añadida la validación
  onAddToCart: PropTypes.func.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  favorites: PropTypes.arrayOf(PropTypes.object),
  onToggleFavorite: PropTypes.func.isRequired,
};
