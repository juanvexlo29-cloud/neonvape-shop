import { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, products, onViewProduct }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.flavor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-fade-in flex flex-col">
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
            {searchTerm.length > 0 && results.map((product, idx) => (
              <div 
                key={`${product.id}-${idx}`} 
                onClick={() => { onClose(); onViewProduct(product); }}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5 hover:border-phoenix-gold/30"
              >
                <div className="w-16 h-16 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                  <span className="text-2xl">{product.image}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold">{product.name}</h4>
                  <p className="text-phoenix-gold text-xs uppercase tracking-widest">{product.flavor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
