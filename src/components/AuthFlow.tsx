import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ChevronLeft, Loader2, Smartphone } from 'lucide-react';

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
      setError(err.message === 'Firebase: Error (auth/user-not-found).' ? 'Usuario no encontrado' : 'Error de acceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-12">
           <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <p className="text-[7px] font-black uppercase tracking-[0.4em] text-green-500">Security Access</p>
           </div>
           <h2 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">
             {mode === 'login' ? 'Welcome Back' : 'Join Elite'}
           </h2>
           <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
             {mode === 'login' ? 'Please authorize to continue' : 'Create your driver account'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Input icon={<User size={16}/>} type="text" placeholder="Full Name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
                <Input icon={<Smartphone size={16}/>} type="tel" placeholder="Phone Number" value={form.phone} onChange={(v) => setForm({...form, phone: v})} />
              </motion.div>
            )}
          </AnimatePresence>

          <Input icon={<Mail size={16}/>} type="email" placeholder="Email Address" value={form.email} onChange={(v) => setForm({...form, email: v})} />
          <Input icon={<Lock size={16}/>} type="password" placeholder="Access Code" value={form.password} onChange={(v) => setForm({...form, password: v})} />

          {error && <p className="text-[8px] text-red-500 font-black uppercase text-center tracking-widest">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] mt-6 hover:bg-green-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-green-500 transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ icon, type, placeholder, value, onChange }: { icon: React.ReactNode, type: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-green-500 transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border-[0.5px] border-white/10 rounded-full py-5 pl-14 pr-6 text-xs font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.05] transition-all"
      />
    </div>
  );
}
