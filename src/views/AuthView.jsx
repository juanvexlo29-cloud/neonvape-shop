import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, User, Phone, X, ShieldCheck } from 'lucide-react';

export default function AuthView({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [formData, setFormData] = useState({ full_name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  // 1. Manejar el retorno de Google (Lógica intacta)
  useEffect(() => {
    const finalizeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // ¿Venía de registrarse?
        const pendingReg = localStorage.getItem('neon_pending_reg');
        if (pendingReg) {
          const data = JSON.parse(pendingReg);
          await supabase.from('profiles').upsert({
            id: session.user.id,
            full_name: data.full_name,
            phone: data.phone
          });
          localStorage.removeItem('neon_pending_reg');
          if (onAuthSuccess) onAuthSuccess();
          return;
        }

        // Si era normal, verificamos cuenta completa
        const { data: profile } = await supabase.from('profiles').select('phone').eq('id', session.user.id).single();
        if (profile?.phone) {
          if (onAuthSuccess) onAuthSuccess();
        } else {
          setMode('register'); // Forzar registro si falta teléfono
        }
      }
    };
    finalizeSession();
  }, [onAuthSuccess]);

  // 2. Acción principal
  const handleAction = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    if (mode === 'register') {
      if (formData.full_name.length < 3 || formData.phone.length < 7) {
        alert("Por favor completa Nombre y Teléfono válidos.");
        setLoading(false);
        return;
      }
      localStorage.setItem('neon_pending_reg', JSON.stringify(formData));
    }

    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    
    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL (Cubre toda la pantalla y desenfoca)
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Capa de fondo clickeable para cerrar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* VENTANA EMERGENTE (MODAL PREMIUM) */}
      <div className="w-full max-w-lg bg-[#07070a]/80 border border-white/5 rounded-3xl p-10 backdrop-blur-3xl shadow-[0_20px_80px_rgba(212,175,55,0.07)] relative z-10 animate-scale-in overflow-hidden">
        
        {/* Brillo dorado sutil interno */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-phoenix-gold/10 blur-3xl rounded-full"></div>

        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-10 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShieldCheck className="text-phoenix-gold" size={24} strokeWidth={1} />
            <h1 className="text-5xl text-white font-serif tracking-[0.15em]">FÉNIX<span className="text-phoenix-gold font-bold">.</span></h1>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black italic">
            Vape Elite Acceso
          </p>
        </div>

        {/* SELECTOR DE PESTAÑAS (Refinado) */}
        <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 mb-8 relative z-10">
          {['login', 'register'].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-3.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-300 ${mode === tab ? 'bg-phoenix-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              {tab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* FORMULARIOS */}
        <form onSubmit={handleAction} className="space-y-5 text-left relative z-10">
          
          {mode === 'register' && (
            <div className="space-y-4 animate-fade-in-down">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-phoenix-gold transition-colors" size={18} strokeWidth={1.5} />
                <input 
                  type="text" placeholder="Nombre Completo" required 
                  className="w-full bg-white/3 border border-white/5 rounded-xl py-4.5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-phoenix-gold/30 transition-all font-sans" 
                  onChange={e => setFormData({...formData, full_name: e.target.value})} 
                />
              </div>
              
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-phoenix-gold transition-colors" size={18} strokeWidth={1.5} />
                <input 
                  type="tel" placeholder="Tu Teléfono / WhatsApp" required 
                  className="w-full bg-white/3 border border-white/5 rounded-xl py-4.5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-phoenix-gold/30 transition-all font-sans" 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              <p className="text-white/30 text-[9px] uppercase tracking-widest text-center px-4 leading-relaxed">
                Usaremos estos datos para gestionar tus envíos de forma elite.
              </p>
            </div>
          )}

          {/* Botón de Acción Principal */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 shadow-xl group hover:scale-[1.02] active:scale-[0.98]
              ${mode === 'login' 
                ? 'bg-white text-black hover:bg-phoenix-gold' 
                : 'bg-linear-to-b from-phoenix-gold to-phoenix-gold/90 text-black shadow-[0_5px_20px_-5px_rgba(212,175,55,0.4)]'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={20} strokeWidth={1.5} className="group-hover:rotate-[-10deg] transition-transform" /> 
                {mode === 'login' ? 'Entrar con Google' : 'Finalizar Registro'}
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-[9px] uppercase tracking-widest mt-10 relative z-10">
          Neón Vape Store © {new Date().getFullYear()} — Acceso Seguro
        </p>
      </div>
    </div>
  );
}
