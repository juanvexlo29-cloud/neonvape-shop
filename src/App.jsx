import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ActionSidebar from './components/ActionSidebar';
import SearchOverlay from './components/SearchOverlay';
import AuthView from './views/AuthView';
import AgeGate from './views/AgeGate';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './views/Home'; // ── IMPORTACIÓN DIRECTA (Elimina el pantallazo de carga)

// ── OPTIMIZACIÓN: LAZY LOADING PARA VISTAS SECUNDARIAS (Carga ultrarrápida) ──
const Catalog = lazy(() => import('./views/Catalog'));
const AdminPanel = lazy(() => import('./views/AdminPanel'));
const ProductDetail = lazy(() => import('./views/ProductDetail'));
const Checkout = lazy(() => import('./views/Checkout'));
const Benefits = lazy(() => import('./views/Benefits'));

// ── CONSTANTE: Email del dueño/administrador ──
const ADMIN_EMAIL = 'juanvexlo29@gmail.com';

export default function App() {
  // ── 1. ESTADOS DE SEGURIDAD Y NAVEGACIÓN ──
  const [hasVerifiedAge, setHasVerifiedAge] = useState(localStorage.getItem('neon_verified') === 'true');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ── 2. ESTADOS DE LA INTERFAZ Y DATOS ──
  const [view, setView] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ── Estado para saber qué producto estamos editando ──
  const [productToEdit, setProductToEdit] = useState(null);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // ── 3. ESTADOS DE DATOS PERSISTENTES (localStorage) ──
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('neon_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('neon_history');
    return saved ? JSON.parse(saved) : [];
  });

  // ── EFECTOS DE GUARDADO AUTOMÁTICO ──
  useEffect(() => {
    localStorage.setItem('neon_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('neon_history', JSON.stringify(history));
  }, [history]);

  // ── DESCARGAR PRODUCTOS Y LIMPIEZA AUTOMÁTICA ──
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }); // Los más nuevos primero

    if (!error && data) {
      setProducts(data);

      // ── NUEVO: LIMPIEZA AUTOMÁTICA (PURGA DE FANTASMAS) ──
      // Creamos un Set con los IDs de los productos que SÍ existen en la base de datos
      const availableIds = new Set(data.map(p => p.id));

      // Filtramos las listas locales para borrar los vapes que el admin haya eliminado
      setFavorites(prevFavs => prevFavs.filter(item => availableIds.has(item.id)));
      setHistory(prevHistory => prevHistory.filter(item => availableIds.has(item.id)));
      setCart(prevCart => prevCart.filter(item => availableIds.has(item.id))); // Limpiamos el carrito también por seguridad

    } else {
      console.error('Error cargando productos:', error);
    }
    setIsLoadingProducts(false);
  }, []);

  // Carga inicial al montar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── MONITOREO DE SESIÓN Y ROL DE ADMIN CON SUPABASE ──
  useEffect(() => {
    const checkSession = async (session) => {
      if (!session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsCheckingSession(false);
        return;
      }

      // ── BYPASS DE ADMIN: El dueño no necesita teléfono registrado ──
      if (session.user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setIsAuthenticated(true);
        setIsCheckingSession(false);
        return;
      }

      // ── FLUJO NORMAL para usuarios regulares ──
      setIsAdmin(false);

      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', session.user.id)
        .single();

      setIsAuthenticated(!!profile?.phone);
      setIsCheckingSession(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── LÓGICA DE ELIMINACIÓN DE PRODUCTO (ADMIN) ──
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este vape? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      // Actualizamos la lista y la purga automática hará el resto en el cliente
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      // Forzamos la limpieza en la sesión actual del admin inmediatamente
      setFavorites(prev => prev.filter(p => p.id !== productId));
      setHistory(prev => prev.filter(p => p.id !== productId));
      setCart(prev => prev.filter(p => p.id !== productId));
    }
  };

  // ── LÓGICA DE EDICIÓN DE PRODUCTO (ADMIN) ──
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setView('admin');
    window.scrollTo(0, 0); // Sube la pantalla suavemente al abrir el panel
  };

  // ── LÓGICA DE FAVORITOS ──
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [product, ...prev];
    });
  };

  // ── LÓGICA DE HISTORIAL DE PRODUCTOS ──
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setView('productDetail');
    window.scrollTo(0, 0);

    setHistory((prevHistory) => {
      const filtered = prevHistory.filter(p => p.id !== product.id || p.flavor !== product.flavor);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // ── LÓGICA DEL CARRITO ──
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id && item.flavor === product.flavor);
      if (existingItem) {
        return prevCart.map(item =>
          (item.id === product.id && item.flavor === product.flavor)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setActiveSidebar('cart');
  };

  const handleUpdateQuantity = (productId, delta, flavor) => {
    setCart((prevCart) =>
      prevCart
        .map(item => {
          if (item.id === productId && item.flavor === flavor) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ── PANTALLAS DE GUARDA ──
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-phoenix-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasVerifiedAge) {
    return <AgeGate onVerified={() => setHasVerifiedAge(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden relative bg-[#030308] text-white">

      <div className={`grow flex flex-col transition-all duration-700 ease-in-out ${isAuthModalOpen || isSearchOpen || activeSidebar ? 'blur-2xl scale-[0.98] pointer-events-none' : ''}`}>

        <Navbar
          view={view}
          setView={setView}
          cartCount={cartCount}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          openCart={() => setActiveSidebar('cart')}
          openAuthModal={() => setIsAuthModalOpen(true)}
          openSearch={() => setIsSearchOpen(true)}
          openHistory={() => setActiveSidebar('history')}
          openFavorites={() => setActiveSidebar('favorites')}
        />

        <main className="grow">
          {/* ── AQUÍ IMPLEMENTAMOS EL SUSPENSE PARA EL LAZY LOADING ── */}
          <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-phoenix-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {view === 'home' && (
              <Home
                products={products}
                isLoading={isLoadingProducts}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
                onViewBenefits={() => {
                  setView('beneficios');
                  window.scrollTo(0, 0);
                }}
                onViewCatalog={() => {
                  setView('catalog');
                  window.scrollTo(0, 0);
                }}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}

            {view === 'catalog' && (
              <Catalog
                products={products}
                isAdmin={isAdmin}
                onDeleteProduct={handleDeleteProduct}
                onEditProduct={handleEditProduct} 
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}

            {view === 'productDetail' && selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                setView={setView}
                onAddToCart={handleAddToCart}
              />
            )}

            {view === 'beneficios' && (
              <Benefits onShopNow={() => {
                setView('catalog');
                window.scrollTo(0, 0);
              }} />
            )}

            {view === 'checkout' && (
              !isAuthenticated
                ? <AuthView
                    onClose={() => setIsAuthModalOpen(false)}
                    onAuthSuccess={() => { setIsAuthenticated(true); setView('checkout'); }}
                  />
                : <Checkout cart={cart} setCart={setCart} setView={setView} />
            )}

            {/* ── PANEL DE ADMINISTRACIÓN ── */}
            {view === 'admin' && isAdmin && (
              <AdminPanel
                productToEdit={productToEdit} 
                onCancelEdit={() => {         
                  setView('catalog');
                  setProductToEdit(null);
                }}
                onProductAdded={() => {
                  fetchProducts();
                  setView('catalog');
                  setProductToEdit(null);     
                }}
              />
            )}
          </Suspense>
        </main>

        <Footer />
      </div>

      {/* ── COMPONENTES EMERGENTES Y PANELES ── */}
      <CartSidebar
        isOpen={activeSidebar === 'cart'}
        onClose={() => setActiveSidebar(null)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        setView={setView}
      />

      <ActionSidebar
        title="Vistos Recientemente"
        items={history}
        isOpen={activeSidebar === 'history'}
        onClose={() => setActiveSidebar(null)}
        onViewProduct={handleViewProduct}
        emptyMessage="Aún no has explorado nuestro catálogo. Descubre la experiencia Neón."
      />

      <ActionSidebar
        title="Tus Favoritos"
        items={favorites}
        isOpen={activeSidebar === 'favorites'}
        onClose={() => setActiveSidebar(null)}
        onViewProduct={handleViewProduct}
        emptyMessage="Aún no tienes productos en tu lista de deseos."
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onViewProduct={handleViewProduct}
      />

      {isAuthModalOpen && (
        <AuthView
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {
            setIsAuthenticated(true);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* ── BOTÓN DE WHATSAPP ── */}
      <WhatsAppButton />

    </div>
  );
}