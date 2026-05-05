import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar({ view, setView, cartCount, openCart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinkClass = (targetView) => {
    const isActive = view === targetView;
    return `pb-1 transition-all duration-300 ${
      isActive 
        ? 'text-neonGreen border-b-2 border-neonGreen' 
        : 'text-gray-300 border-b-2 border-transparent hover:text-neonGreen'
    }`;
  };

  const getMobileLinkClass = (targetView) => {
    const isActive = view === targetView;
    return `text-left font-bold text-lg transition-all duration-300 ${
      isActive
        ? 'text-neonGreen border-l-4 border-neonGreen pl-2'
        : 'text-white hover:text-neonGreen pl-2 border-l-4 border-transparent'
    }`;
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark/30 backdrop-blur-2xl shadow-lg' : 'bg-transparent'
    }`}>
      
      <nav className={`px-4 md:px-6 flex justify-between items-center transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}>
        
        <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
          <span className="text-xl md:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-[#86efac] to-[#c084fc]">
            NEONVAPE
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-bold">
          <button onClick={() => setView('home')} className={getNavLinkClass('home')}>
            Inicio
          </button>
          <button onClick={() => setView('catalog')} className={getNavLinkClass('catalog')}>
            Catálogo
          </button>
          <button onClick={() => setView('beneficios')} className={getNavLinkClass('beneficios')}>
            Beneficios
          </button>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-white hover:text-neonGreen transition-colors">
            <Search size={22} strokeWidth={2} />
          </button>
          
          <button onClick={openCart} className="relative text-white hover:text-neonGreen transition-colors">
            <ShoppingBag size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-neonGreen text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-white hover:text-neonGreen transition-colors"
          >
            {isMobileMenuOpen ? <X size={26} strokeWidth={2} /> : <Menu size={26} strokeWidth={2} />}
          </button>
        </div>
      </nav>

      {/* BARRA DE ADVERTENCIA INFERIOR (Ahora aparece al hacer scroll) */}
      <div className={`bg-[#2a0e14]/90 backdrop-blur-md border-red-900/30 text-center transition-all duration-300 overflow-hidden ${
        isScrolled ? 'h-8 opacity-100 border-b' : 'h-0 opacity-0 border-transparent'
      }`}>
        <p className="text-[10px] sm:text-xs font-bold text-[#ef4444] tracking-widest uppercase flex items-center justify-center gap-2 h-full">
          <ShieldAlert size={14} /> PRODUCTO EXCLUSIVO PARA MAYORES DE 18 AÑOS
        </p>
      </div>

      <div className={`md:hidden absolute w-full bg-dark/90 backdrop-blur-2xl border-b border-gray-800 transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-64 border-opacity-100 py-6' : 'max-h-0 border-opacity-0 py-0'
      }`}>
        <div className="flex flex-col px-6 gap-6">
          <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className={getMobileLinkClass('home')}>
            Inicio
          </button>
          <button onClick={() => { setView('catalog'); setIsMobileMenuOpen(false); }} className={getMobileLinkClass('catalog')}>
            Catálogo de Vapes
          </button>
          <button onClick={() => { setView('beneficios'); setIsMobileMenuOpen(false); }} className={getMobileLinkClass('beneficios')}>
            Beneficios
          </button>
        </div>
      </div>
      
    </div>
  );
}