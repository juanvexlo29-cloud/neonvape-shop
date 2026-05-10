import { useState } from 'react';
import { ShieldCheck, CreditCard, Calendar } from 'lucide-react';

export default function AgeGate({ onVerified }) {
  const [cc, setCc] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Cálculo exacto de la edad
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Verificamos que sea mayor de 18 y que la Cédula tenga al menos 6 números
    if (age >= 18 && cc.length >= 6) {
      // ── AQUÍ ESTÁ EL CAMBIO: Usamos localStorage para que no se borre al cerrar la página ──
      localStorage.setItem('neon_verified', 'true');
      onVerified();
    } else {
      alert("Acceso denegado: Debes ser mayor de 18 años para ingresar a Neón.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030308] flex items-center justify-center p-6 relative overflow-hidden w-full">
      {/* Efectos de fondo Neon */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-phoenix-gold/10 blur-[120px] rounded-full"></div>
      
      <div className="max-w-md w-full relative z-10 text-center animate-fade-in">
        <h1 className="text-6xl text-white font-serif tracking-[0.2em] mb-10">
          FÉNIX<span className="text-phoenix-gold">.</span>
        </h1>
        
        <div className="bg-white/2 border border-white/5 rounded-4xl p-10 backdrop-blur-3xl shadow-2xl">
          <div className="mb-8 space-y-2">
            <ShieldCheck className="mx-auto text-phoenix-gold mb-4" size={48} strokeWidth={1.5} />
            <h2 className="text-white text-xl font-bold uppercase tracking-widest">
              Verificación Legal
            </h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
              Para ingresar al catálogo, debes confirmar que tienes la edad legal requerida.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5 text-left">
            <div className="relative group">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-phoenix-gold transition-colors" size={18} />
              <input 
                type="number" 
                placeholder="Número de Cédula (CC)" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-phoenix-gold/50 transition-all appearance-none"
                onChange={e => setCc(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-phoenix-gold transition-colors" size={18} />
              <input 
                type="date" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:border-phoenix-gold/50 transition-all cursor-pointer"
                onChange={e => setBirthDate(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-phoenix-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl mt-6"
            >
              Ingresar a la Tienda
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
