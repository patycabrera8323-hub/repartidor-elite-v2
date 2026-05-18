import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ChevronLeft, Loader2, Smartphone, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AuthFlow({ onAuthenticated }: { onAuthenticated: (user: any) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });
        
        await setDoc(doc(db, 'drivers', cred.user.uid), {
          uid: cred.user.uid,
          name: form.name,
          email: form.email,
          phone: form.phone,
          approved: false,
          status: 'offline',
          createdAt: serverTimestamp()
        });
        onAuthenticated(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        onAuthenticated(cred.user);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') setError('PROTOCOLO NO RECONOCIDO');
      else if (err.code === 'auth/wrong-password') setError('LLAVE DE ACCESO INVÁLIDA');
      else if (err.code === 'auth/email-already-in-use') setError('NODO YA REGISTRADO');
      else setError('FALLO EN LA SINCRONIZACIÓN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-8 overflow-hidden font-sans relative">
      
      {/* 🎨 BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-cyan/5 blur-[150px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-16">
           <div className="inline-block px-5 py-2 glass border-neon-cyan/20 rounded-full mb-8">
              <p className="text-[7px] font-black uppercase tracking-[0.5em] text-neon-cyan drop-shadow-neon-cyan">AUTENTICACIÓN DE NODO</p>
           </div>
           <h2 className="text-5xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-4">
             {mode === 'login' ? 'ACCESO' : 'NUEVO'} <br/>
             <span className={cn(mode === 'login' ? "text-white" : "text-neon-cyan text-glow-cyan")}>
               {mode === 'login' ? 'TOTAL' : 'PROTOCOLO'}
             </span>
           </h2>
           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed max-w-[250px] mx-auto">
             {mode === 'login' ? 'INGRESA TUS CREDENCIALES DE REPARTO' : 'REGISTRA TU TERMINAL EN LA RED ELITE'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <Input icon={<User size={18}/>} type="text" placeholder="DESIGNACIÓN COMPLETA" value={form.name} onChange={(v) => setForm({...form, name: v})} />
                <Input icon={<Smartphone size={18}/>} type="tel" placeholder="CANAL DE CONTACTO" value={form.phone} onChange={(v) => setForm({...form, phone: v})} />
              </motion.div>
            )}
          </AnimatePresence>

          <Input icon={<Mail size={18}/>} type="email" placeholder="NODO EMAIL" value={form.email} onChange={(v) => setForm({...form, email: v})} />
          <Input icon={<Lock size={18}/>} type="password" placeholder="LLAVE DE SEGURIDAD" value={form.password} onChange={(v) => setForm({...form, password: v})} />

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-neon-pink/10 border border-neon-pink/20 p-4 rounded-2xl">
              <p className="text-[8px] text-neon-pink font-black uppercase text-center tracking-[0.3em]">{error}</p>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] mt-8 hover:bg-neon-cyan transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 shadow-2xl"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (mode === 'login' ? 'SINCRONIZAR' : 'REGISTRAR NODO')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-14 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all group"
          >
            <span className="group-hover:text-neon-cyan transition-colors">
              {mode === 'login' ? "¿SIN REGISTRO? CREAR PROTOCOLO" : "¿YA REGISTRADO? INICIAR ACCESO"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 opacity-5">
        <Shield size={120} strokeWidth={0.5} className="text-white" />
      </div>
    </div>
  );
}

function Input({ icon, type, placeholder, value, onChange }: { icon: React.ReactNode, type: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative group">
      <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-neon-cyan transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 text-[11px] font-black text-white placeholder:text-white/5 focus:outline-none focus:border-neon-cyan/20 focus:bg-white/[0.05] transition-all uppercase tracking-widest"
      />
    </div>
  );
}
