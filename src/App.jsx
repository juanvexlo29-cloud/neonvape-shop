import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './views/Home';
import Catalog from './views/Catalog';
import Benefits from './views/Benefits';
import Checkout from './views/Checkout';
import ProductDetail from './views/ProductDetail'; // <--- 1. IMPORTAR LA NUEVA VISTA
import { PRODUCTS } from './data/products';

export default function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 2. NUEVO ESTADO: Guarda el producto que el usuario quiere ver en detalle
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      // Ahora verificamos también el sabor para no mezclar vapes de diferentes sabores
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
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, delta, flavor) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.id === productId && item.flavor === flavor) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // 3. NUEVA FUNCIÓN: Abre la página de detalle
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setView('productDetail');
    window.scrollTo(0, 0); // Sube la pantalla al inicio
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden relative">
      <Navbar view={view} setView={setView} cartCount={cartCount} openCart={() => setIsCartOpen(true)} />

      <main className="grow">
        {view === 'home' && (
          <Home 
            products={PRODUCTS} 
            onAddToCart={handleAddToCart} 
            onViewProduct={handleViewProduct} /* <--- Pasar la función */
            onViewBenefits={() => setView('beneficios')} 
          />
        )}
        
        {view === 'catalog' && (
          <Catalog 
            onAddToCart={handleAddToCart} 
            onViewProduct={handleViewProduct} /* <--- Pasar la función */
          />
        )}

        {/* 4. RENDERIZAR LA VISTA DE DETALLE */}
        {view === 'productDetail' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            setView={setView} 
            onAddToCart={handleAddToCart} 
          />
        )}

        {view === 'beneficios' && (
          <Benefits onShopNow={() => setView('catalog')} />
        )}

        {view === 'checkout' && (
          <Checkout cart={cart} setCart={setCart} setView={setView} />
        )}
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        setView={setView}
      />
    </div>
  );
}