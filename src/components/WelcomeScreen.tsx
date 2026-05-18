import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Navigation, ArrowRight, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome_Repartidor_v2');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      onStart();
    }
  }, [onStart]);

  const handleStart = () => {
    localStorage.setItem('hasSeenWelcome_Repartidor_v2', 'true');
    setIsVisible(false);
    setTimeout(onStart, 400);
  };

  if (!isVisible) return null;

  const features = [
    {
      icon: <Navigation className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" size={20} />,
      title: "Rutas Inteligentes",
      desc: "Visualiza pedidos cercanos y optimiza tus entregas."
    },
    {
      icon: <Zap className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" size={20} />,
      title: "Tiempo Real",
      desc: "Notificaciones y actualizaciones instantáneas."
    },
    {
      icon: <ShieldCheck className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" size={20} />,
      title: "Acceso Seguro",
      desc: "Solo personal autorizado. 100% protegido."
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[10000] artistic-bg flex flex-col items-center justify-between p-8 overflow-hidden rounded-[32px]"
        >
          {/* Decorative background SVG */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,200 Q150,50 350,300 T550,150" fill="none" stroke="#e42975" strokeWidth="20" strokeLinecap="round" opacity="0.6"/>
              <path d="M-20,400 Q120,600 400,450" fill="none" stroke="#1f51ff" strokeWidth="40" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>

          <div className="w-full flex flex-col items-center mt-12 relative z-10">
            {/* Circular/Rounded Logo Container with Glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 glass-panel-glow rounded-[1.8rem] flex items-center justify-center overflow-hidden p-3 border-2 border-pink-500/50 shadow-[0_0_25px_rgba(228,41,117,0.4)]">
                <img src="/logo.png?v=2" alt="Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center"
              >
                <Star className="w-3 h-3 text-white fill-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl font-black text-white leading-tight">
                ¡Bienvenido,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 drop-shadow-[0_0_15px_rgba(228,41,117,0.3)]">Repartidor Elite!</span>
              </h1>
              <p className="text-pink-200/60 text-[10px] mt-3 font-bold px-4 leading-relaxed uppercase tracking-wider">
                Si gustas puedes usarla <span className="text-pink-400">instalándola</span> o directamente en la <span className="text-pink-400">web</span> ahorrando memoria en tu celular.
              </p>
            </motion.div>

            {/* Features */}
            <div className="w-full space-y-5 mt-8 px-2">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 glass-panel rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-white/10">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-pink-200/90 uppercase tracking-tight">{f.title}</h3>
                    <p className="text-[9px] text-white/50 font-medium leading-tight">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="w-full pb-6 flex flex-col items-center relative z-10"
          >
            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(228,41,117,0.3)] hover:shadow-[0_0_30px_rgba(228,41,117,0.5)] cursor-pointer"
            >
              Comenzar Ruta
              <ArrowRight size={14} />
            </button>
            <div className="flex flex-col items-center gap-1 opacity-60">
              <img src="/searmo-logo.png" alt="Searmo" className="h-4 w-auto object-contain brightness-0 invert" />
              <p className="text-[6px] font-black uppercase tracking-[0.4em] text-white/40">Powered by Searmo</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
