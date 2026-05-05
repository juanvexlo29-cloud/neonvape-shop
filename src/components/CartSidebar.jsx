import { X, Gift, Minus, Plus } from 'lucide-react';

export default function CartSidebar({ isOpen, onClose, cart, updateQuantity, setView }) {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const itemsForGift = 3;
  const missingForGift = itemsForGift - totalItems;

  if (!isOpen) return null;

  return (
    <>
      {/* Actualizado: z-60 */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60" onClick={onClose} />
      
      {/* Actualizado: md:w-112.5 y z-70 */}
      <div className="fixed inset-y-0 right-0 w-full md:w-112.5 bg-dark border-l border-gray-800 z-70 flex flex-col shadow-2xl animate-fade-in">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Tu Carrito ({totalItems})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 pb-2 border-b border-gray-800 bg-[#0f1423]">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} className="text-neonPurple" />
            <p className="text-sm font-bold text-white">
              {missingForGift > 0 
                ? `Faltan ${missingForGift} vapes para tu regalo sorpresa`
                : '¡Felicidades! Has desbloqueado tu regalo sorpresa.'}
            </p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-neonPurple h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((totalItems / itemsForGift) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Tu carrito está vacío</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-4 items-center bg-[#0f1423] p-3 rounded-xl border border-gray-800">
                {/* Actualizado: shrink-0 y bg-linear-to-tr */}
                <div className={`w-16 h-16 rounded-lg shrink-0 bg-linear-to-tr ${item.color} flex items-center justify-center opacity-80`}></div>
                
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm leading-tight">{item.name}</h4>
                  <p className="text-gray-400 text-xs mb-2">{item.flavor || 'Sabor Original'}</p>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-white"><Minus size={14}/></button>
                    <span className="text-white text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-white"><Plus size={14}/></button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-bold">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#0f1423]">
          <div className="flex justify-between text-gray-400 mb-2 text-sm">
            <span>Subtotal</span>
            <span className="text-white font-bold">${total.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-gray-400 mb-6 text-sm border-b border-gray-800 pb-4">
            <span>Envío</span>
            <span className="text-neonGreen font-bold">Calculado en el checkout</span>
          </div>
          
          <button 
            onClick={() => {
              onClose();
              setView('checkout');
            }}
            disabled={cart.length === 0}
            className="w-full bg-neonGreen hover:bg-emerald-400 text-black font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center px-6"
          >
            <span>IR AL PAGO SEGURO</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </>
  );
}