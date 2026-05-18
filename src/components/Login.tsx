import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'motion/react';
import { Truck, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'FALLO EN LA SINCRONIZACIÓN DE NODO');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-between p-10 font-sans relative overflow-hidden selection:bg-neon-cyan selection:text-black">
      
      {/* 🎭 BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[80%] h-[50%] bg-neon-cyan/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[70%] h-[40%] bg-neon-pink/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Top Branding */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex justify-center pt-4 relative z-20"
      >
        <div className="px-6 py-2 rounded-full glass border-white/5">
          <p className="text-[9px] font-black tracking-[0.6em] text-white/20 uppercase">SISTEMA DE ACCESO GLOBAL</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm flex flex-col items-center gap-16 relative z-10"
      >
        {/* Logo section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-32 h-32 glass rounded-[3rem] flex items-center justify-center neon-border-cyan relative group"
          >
            <div className="absolute inset-0 bg-neon-cyan/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Truck size={48} className="text-white drop-shadow-neon-cyan" strokeWidth={1.5} />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-black tracking-tighter text-white uppercase leading-[0.85]">
              REPARTIDOR<br/>
              <span className="text-neon-cyan text-glow-cyan">ELITE</span>
            </h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
              PLATAFORMA DE LOGÍSTICA <br/> DE NUEVA GENERACIÓN
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { label: 'MAPA VITAL', icon: <Globe size={10}/> },
            { label: 'NODOS REALES', icon: <Zap size={10}/> },
            { label: 'PROTOCOLO PRO', icon: <Shield size={10}/> }
          ].map(f => (
            <span key={f.label}
              className="px-4 py-2 rounded-full text-[8px] font-black text-white/40 uppercase tracking-widest glass border-white/5 flex items-center gap-2"
            >
              <span className="text-neon-cyan">{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* Login button */}
        <div className="w-full flex flex-col gap-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-6 bg-white text-black font-black rounded-[2rem] flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50 text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-4">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  SINCRONIZAR CON GOOGLE
                </>
              )}
            </span>
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neon-pink/10 border border-neon-pink/20 rounded-2xl p-5"
            >
              <p className="text-neon-pink text-[9px] text-center font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}
        </div>

        <p className="text-[8px] text-white/10 text-center uppercase tracking-[0.5em] font-black max-w-[250px]">
          AL SINCRONIZAR ACEPTAS LOS PROTOCOLOS DE SERVICIO ELITE
        </p>
      </motion.div>

      {/* Footer Branding */}
      <div className="flex flex-col items-center gap-4 opacity-10 group cursor-default pt-10 relative z-10">
        <div className="h-[1px] w-12 bg-white/40 group-hover:w-20 transition-all" />
        <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white">SEARMO CO.</p>
      </div>
    </div>
  );
}
