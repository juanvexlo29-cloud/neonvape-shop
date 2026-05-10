import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  History,
  ChevronRight,
  Search,
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({
  view,
  setView,
  cartCount,
  openCart,
  isAuthenticated,
  isAdmin,          // ← identifica al dueño de la tienda
  openAuthModal,
  openSearch,
  openHistory,
  openFavorites
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Lógica de la Barra de Anuncios
  const [currentPromo, setCurrentPromo] = useState(0);
  const promociones = [
    'Envío Gratis por compras superiores a $250.000',
    'Nuevos sabores explosivos disponibles - ¡Pídelos ya!',
    'Pagos seguros con PSE, Tarjeta y Efectivo'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promociones.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promociones.length]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (targetView) => {
    setView(targetView);
    setIsMenuOpen(false);
  };

  // ── LÓGICA DE CLIC EN USUARIO ──
  // Admin → Panel de control | No autenticado → Modal login | Usuario → Perfil
  const handleUserClick = () => {
    if (isAdmin) {
      setView('admin');
    } else if (!isAuthenticated) {
      openAuthModal();
    } else {
      console.log('Próximamente: Vista de perfil');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500">

      {/* ── 1. BARRA DE ANUNCIOS: Neon Gold ── */}
      <div className="bg-phoenix-gold text-black py-2 px-4 relative overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ChevronLeft size={14} className="opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
          <div className="flex-1 text-center">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] animate-fade-in">
              {promociones[currentPromo]}
            </p>
          </div>
          <ChevronRight size={14} className="opacity-40 cursor-pointer hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* ── 2. NAVBAR PRINCIPAL ── */}
      <div
        className={`transition-all duration-500 ${
          isScrolled
            ? 'bg-[#030308]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3'
            : 'bg-transparent border-b border-black py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* LADO IZQUIERDO: Menú (Móvil) / Logo (PC) */}
            <div className="flex-1 md:flex-none flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-white transition-colors hover:text-phoenix-gold"
              >
                <Menu size={28} />
              </button>

              <div className="hidden md:block cursor-pointer" onClick={() => handleNav('home')}>
                <span className="text-2xl text-white tracking-widest transition-colors duration-300 font-serif">
                  FÉNIX<span className="text-phoenix-gold font-bold">.</span>
                </span>
              </div>
            </div>

            {/* CENTRO: Logo (Móvil) / Links (PC) */}
            <div className="flex-1 flex justify-center">
              <div className="md:hidden cursor-pointer" onClick={() => handleNav('home')}>
                <span className="text-2xl text-white tracking-widest font-serif">
                  FÉNIX<span className="text-phoenix-gold font-bold">.</span>
                </span>
              </div>

              <nav className="hidden md:flex items-center space-x-12">
                {['Inicio', 'Catálogo', 'Beneficios'].map((name) => {
                  const targetId = name === 'Inicio' ? 'home' : name === 'Catálogo' ? 'catalog' : 'beneficios';
                  return (
                    <button
                      key={name}
                      onClick={() => handleNav(targetId)}
                      className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all ${
                        view === targetId ? 'text-phoenix-gold' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* LADO DERECHO: Acciones PC */}
            <div className="flex-1 md:flex-none flex items-center justify-end space-x-5 sm:space-x-7">
              <div className="hidden lg:flex items-center space-x-5 pr-5 border-r border-white/10">
                <History
                  onClick={openHistory}
                  size={18}
                  className="text-white/80 hover:text-phoenix-gold transition-colors cursor-pointer"
                  strokeWidth={1.5}
                />
                <Heart
                  onClick={openFavorites}
                  size={18}
                  className="text-white/80 hover:text-phoenix-gold transition-colors cursor-pointer"
                  strokeWidth={1.5}
                />

                {/* Ícono de usuario / admin — diferenciado visualmente */}
                <div onClick={handleUserClick} className="cursor-pointer group flex items-center gap-2">
                  {isAdmin ? (
                    <>
                      <LayoutDashboard
                        size={18}
                        className={`transition-colors ${
                          view === 'admin' ? 'text-phoenix-gold' : 'text-white/80 group-hover:text-phoenix-gold'
                        }`}
                        strokeWidth={1.5}
                      />
                      <span className="text-[9px] text-phoenix-gold/70 uppercase tracking-widest font-bold hidden xl:block">
                        Admin
                      </span>
                    </>
                  ) : (
                    <>
                      <User
                        size={18}
                        className={`transition-colors ${
                          isAuthenticated ? 'text-phoenix-gold' : 'text-white/80 group-hover:text-phoenix-gold'
                        }`}
                        strokeWidth={1.5}
                      />
                      {isAuthenticated && (
                        <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold hidden xl:block">
                          Perfil
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button onClick={openSearch} className="text-white/80 hover:text-phoenix-gold transition-colors">
                <Search size={20} strokeWidth={2} />
              </button>

              <button onClick={openCart} className="relative text-white/80 hover:text-phoenix-gold hover:scale-110 transition-all">
                <ShoppingCart size={22} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#030308]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 3. MENÚ LATERAL MÓVIL ── */}
      {/* z-100 es la clase canónica de Tailwind v3+ (evita la advertencia de z-[100]) */}
      <div className={`md:hidden fixed inset-0 z-100 transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>

        {/* Fondo oscuro */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Contenido del Sidebar Móvil */}
        <div className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-[#07070a] p-8 flex flex-col shadow-2xl border-r border-white/5 transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl text-white tracking-widest font-serif">
              MENÚ<span className="text-phoenix-gold font-bold">.</span>
            </span>
            <X
              size={28}
              className="text-white/40 cursor-pointer hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          {/* Navegación principal móvil */}
          <nav className="space-y-8 flex-1">
            {['Inicio', 'Catálogo', 'Beneficios'].map((item) => {
              const targetId = item === 'Inicio' ? 'home' : item === 'Catálogo' ? 'catalog' : 'beneficios';
              return (
                <button
                  key={item}
                  onClick={() => handleNav(targetId)}
                  className="flex items-center justify-between w-full text-2xl text-white hover:text-phoenix-gold font-serif transition-colors"
                >
                  {item}
                  <ChevronRight size={20} className="text-phoenix-gold" />
                </button>
              );
            })}
          </nav>

          {/* Opciones de la tienda en móvil */}
          <div className="pt-8 border-t border-white/5 space-y-6">

            {/* Buscador móvil */}
            <button
              onClick={() => { setIsMenuOpen(false); openSearch(); }}
              className="flex items-center gap-4 text-white/70 hover:text-white transition-colors w-full"
            >
              <Search size={20} className="text-phoenix-gold" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Buscar</span>
            </button>

            {/* Admin → Panel | Usuario → Perfil / Login */}
            <button
              onClick={handleUserClick}
              className="flex items-center gap-4 text-white/70 hover:text-white transition-colors w-full"
            >
              {isAdmin ? (
                <LayoutDashboard size={20} className="text-phoenix-gold" />
              ) : (
                <User size={20} className={isAuthenticated ? 'text-phoenix-gold' : ''} />
              )}
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                {isAdmin ? 'Panel Admin' : isAuthenticated ? 'Mi Perfil' : 'Iniciar Sesión'}
              </span>
            </button>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => { setIsMenuOpen(false); openFavorites(); }}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 transition-colors flex flex-col items-center gap-2"
              >
                <Heart size={18} className="text-phoenix-gold" />
                Favoritos
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); openHistory(); }}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 transition-colors flex flex-col items-center gap-2"
              >
                <History size={18} className="text-phoenix-gold" />
                Recientes
              </button>
            </div>

          </div>
        </div>
      </div>

    </header>
  );
}
