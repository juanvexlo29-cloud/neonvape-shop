import { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, products, onViewProduct }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name && p.name.toLowerCase().includes(term);
    
    const flavorMatch = p.flavors && Array.isArray(p.flavors) && p.flavors.some(f => 
      f.name && f.name.toLowerCase().includes(term)
    );

    return nameMatch || flavorMatch;
  });

  return (
    <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md animate-fade-in flex flex-col">
      <div className="p-6 md:p-10 flex justify-end">
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>
      </div>
      
      <div className="max-w-3xl w-full mx-auto px-6 flex-1">
        <div className="relative group mb-10">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-phoenix-gold/50" size={32} />
          <input 
            type="text" 
            autoFocus
            placeholder="Buscar Neón..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white/10 text-4xl text-white py-6 pl-12 outline-none focus:border-phoenix-gold transition-colors font-serif tracking-widest placeholder:text-white/20"
          />
        </div>

        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
          {searchTerm.length > 2 && results.length === 0 && (
            <p className="text-white/40 text-center uppercase tracking-widest text-sm">No encontramos resultados para "{searchTerm}"</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchTerm.length > 0 && results.map((product, idx) => {
              
              // Extraer la primera imagen de forma segura
              let displayImage = '';
              if (Array.isArray(product.image_url) && product.image_url.length > 0) {
                displayImage = product.image_url[0];
              } else if (typeof product.image_url === 'string') {
                displayImage = product.image_url;
              }

              return (
                <div 
                  key={`${product.id}-${idx}`} 
                  onClick={() => { onClose(); onViewProduct(product); }}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5 hover:border-phoenix-gold/30"
                >
                  <div className="w-16 h-16 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                    {displayImage ? (
                       <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-white/20 text-[10px] uppercase">Sin imagen</span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-white font-bold truncate">{product.name}</h4>
                    <p className="text-phoenix-gold text-xs uppercase tracking-widest truncate mt-1">
                      {product.flavors && product.flavors.length > 0 
                        ? `${product.flavors.length} Sabores` 
                        : 'Disponible'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}