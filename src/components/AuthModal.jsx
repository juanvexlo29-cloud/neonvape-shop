import { useState, useEffect } from 'react';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [cedula, setCedula] = useState('');

  useEffect(() => {
    // Si guardamos la cédula al entrar a la web, la auto-completamos aquí
    const savedCedula = localStorage.getItem('phoenix_user_cedula');
    if (savedCedula) {
      setCedula(savedCedula);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(); 
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl animate-fade-in mt-10">
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-phoenix-gold/10 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck size={32} className="text-phoenix-gold" />
        </div>
        <h2 className="text-3xl font-black text-phoenix-dark">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-phoenix-gray text-sm mt-2">
          {isLogin ? 'Ingresa para finalizar tu compra.' : 'Regístrate para realizar compras seguras.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {!isLogin && (
          <>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input required type="text" placeholder="Nombre completo" className="w-full bg-gray-50 border border-gray-200 text-phoenix-dark rounded-xl pl-12 pr-4 py-3 outline-none focus:border-phoenix-gold transition-colors" />
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required 
                type="number" 
                placeholder="Cédula de Ciudadanía" 
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-phoenix-dark rounded-xl pl-12 pr-4 py-3 outline-none focus:border-phoenix-gold transition-colors" 
              />
            </div>
          </>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input required type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 border border-gray-200 text-phoenix-dark rounded-xl pl-12 pr-4 py-3 outline-none focus:border-phoenix-gold transition-colors" />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input required type="password" placeholder="Contraseña" className="w-full bg-gray-50 border border-gray-200 text-phoenix-dark rounded-xl pl-12 pr-4 py-3 outline-none focus:border-phoenix-gold transition-colors" />
        </div>

        <button type="submit" className="w-full bg-phoenix-gold hover:bg-phoenix-gold-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-2">
          {isLogin ? 'Ingresar a mi cuenta' : 'Registrarme'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-phoenix-gray hover:text-phoenix-gold text-sm font-bold transition-colors">
          {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
