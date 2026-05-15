import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Truck, ArrowRight, Star, Smartphone, Box, Shield } from 'lucide-react';

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome_Elite_v2_1');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleStart = () => {
    localStorage.setItem('hasSeenWelcome_Elite_v2_1', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 400);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-[#000000] flex flex-col items-center justify-between p-8 overflow-hidden font-sans selection:bg-green-500/30"
        >
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

          {/* Finer Background Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-5%] left-[-10%] w-[70%] h-[30%] bg-green-900/10 rounded-full blur-[100px]" />
          </div>

          {/* Top Branding */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full flex justify-center pt-4 relative z-20"
          >
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <p className="text-[9px] font-black tracking-[0.4em] text-green-500 uppercase">Elite Protocol 2.1</p>
            </div>
          </motion.div>

          {/* Center Content */}
          <div className="w-full max-w-md flex flex-col items-center relative z-10">
            {/* Minimalist Logo Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-12 group"
            >
              <div className="w-28 h-28 bg-[#0a0a0a] rounded-[2rem] flex items-center justify-center p-5 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:border-green-500/30 transition-all duration-700">
                {/* Logo with explicit cache buster and absolute path */}
                <img 
                  src={`/logo.png?v=${Date.now()}`} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-green-500 font-black text-2xl tracking-tighter';
                      fallback.innerText = 'ELITE';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              {/* Ultra Thin Ring */}
              <div className="absolute inset-[-4px] rounded-[2.2rem] border-[0.5px] border-green-500/20 animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.9]">
                REPARTIDOR<br/>
                <span className="text-green-500">ELITE PRO</span>
              </h1>
              <p className="text-white/40 text-[10px] font-medium tracking-[0.2em] uppercase leading-relaxed max-w-[280px] mx-auto">
                Rendimiento Superior. <span className="text-white/60 font-black">Diseño Minimalista.</span>
              </p>
            </motion.div>

            {/* Finer Info Cards */}
            <div className="grid grid-cols-2 gap-3 w-full mt-12">
               <InfoCard icon={<Zap size={14}/>} title="Rápido" />
               <InfoCard icon={<Shield size={14}/>} title="Seguro" />
               <InfoCard icon={<Smartphone size={14}/>} title="Ligero" />
               <InfoCard icon={<Star size={14}/>} title="Premium" />
            </div>
          </div>

          {/* Footer Action - Futuristic Pill Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm pb-10 flex flex-col items-center relative z-10"
          >
            <button
              onClick={handleStart}
              className="group relative w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/10"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Entrar al Sistema
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            
            <div className="mt-8 flex flex-col items-center gap-3 opacity-20 hover:opacity-40 transition-opacity">
               <img src="/searmo-logo.png" alt="Searmo" className="h-3 brightness-0 invert" />
               <p className="text-[6px] font-black uppercase tracking-[0.5em] text-white">Advanced Logistics Unit</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-[1.5rem] bg-white/[0.02] border-[0.5px] border-white/5 backdrop-blur-sm">
      <div className="text-green-500">{icon}</div>
      <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{title}</span>
    </div>
  );
}
