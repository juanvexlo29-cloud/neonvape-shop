import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, ListFilter, Zap } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function Catalog({ onAddToCart, onViewProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPuffs, setSelectedPuffs] = useState('Todos');

  // Definir rangos de puffs realistas basados en la investigación
  const puffRanges = ['Todos', '700 (Inicio)', '3000 (Media)', '6000 (Alta)', '7500+ (Ultra)'];

  // Lógica de filtrado combinada (búsqueda + puffs)
  const filteredProducts = PRODUCTS.filter(product => {
    // Filtro por término de búsqueda (nombre o sabor)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.flavor.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por rango de puffs
    let matchesPuffs = true;
    if (selectedPuffs !== 'Todos') {
      const puffValue = parseInt(selectedPuffs.split(' ')[0]); // Extrae el número
      if (selectedPuffs.includes('+')) {
        matchesPuffs = product.puffs >= puffValue;
      } else {
        matchesPuffs = product.puffs === puffValue;
      }
    }

    return matchesSearch && matchesPuffs;
  });

  return (
    <div className="animate-fade-in bg-dark min-h-screen pb-20">
      
      {/* TÍTULO PRINCIPAL (Como en la imagen: grande, negro, italic) */}
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-10">
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] uppercase italic tracking-tighter mb-4">
          Encuentra tu<br/>Vape Perfecto
        </h1>
        <p className="text-gray-500 max-w-lg">
          Explora nuestra colección 2026. Filtra por sabor o capacidad y recibe tu vape en 24h en Bogotá.
        </p>
      </div>

      {/* BARRA DE FILTROS (DISEÑO IDÉNTICO A LA IMAGEN) */}
      <section className="max-w-7xl mx-auto px-6 mb-12 sticky top-24 z-30">
        <div className="bg-[#111625] p-3 rounded-full border border-gray-800 flex flex-col md:flex-row gap-4 items-center shadow-2xl backdrop-blur-sm">
          
          {/* Barra de Búsqueda */}
          {/* Nota: Se actualizó flex-grow a grow para corregir la advertencia de Tailwind */}
          <div className="relative grow w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o sabor... (ej: Neon, Mango)"
              className="w-full bg-dark/50 border border-gray-800 text-white rounded-full pl-12 pr-6 py-3 text-sm outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-all placeholder:text-gray-700"
            />
          </div>

          {/* Selector de Puffs */}
          <div className="relative w-full md:w-auto">
            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-neonPurple" size={20} />
            <select 
              value={selectedPuffs}
              onChange={(e) => setSelectedPuffs(e.target.value)}
              className="w-full md:w-60 bg-dark/50 border border-gray-800 text-white rounded-full pl-12 pr-10 py-3 text-sm outline-none focus:border-neonPurple transition-all appearance-none cursor-pointer"
            >
              {puffRanges.map(range => (
                <option key={range} value={range} className="bg-dark text-white">{range}</option>
              ))}
            </select>
            <ListFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
          </div>
        </div>
      </section>

      {/* REJILLA DE PRODUCTOS (RESPONSIVE) */}
      <section className="max-w-7xl mx-auto px-6">
        
        {/* Resultados */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-600 border-b border-gray-900 pb-4">
          <p>Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> vapes disponibles.</p>
          {(searchTerm || selectedPuffs !== 'Todos') && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedPuffs('Todos'); }}
              className="text-neonRed text-xs font-bold hover:underline"
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Grid Responsive: 1 col (móvil) -> 2 cols (tablet) -> 3 cols (laptop) -> 4 cols (desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onViewProduct={onViewProduct} 
              />
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-20 bg-[#111625] rounded-3xl border border-gray-800 border-dashed">
            <Zap size={48} className="mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No encontramos tu Vape</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Prueba buscando otro sabor o cambiando el filtro de puffs. ¡Tenemos muchos modelos más!</p>
          </div>
        )}
      </section>
    </div>
  );
}