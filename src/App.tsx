import React, { useState, useEffect } from 'react';
import { Lock, Mail, ChevronRight, Package, Bell, Menu, Navigation, Wallet, Star, Gauge, Truck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  updateDoc, 
  doc, 
  Timestamp, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { Order, OrderStatus } from './types';
import OrderMap from './components/OrderMap';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'earnings' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | undefined>();

  // Firebase Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      setIsLoggedIn(!!u);
      setLoading(false); 
    });
    return unsub;
  }, []);

  // Firestore Orders Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      const o: Order[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (data.status === 'pending' || data.driverId === user.uid) {
          o.push({ id: d.id, ...data } as Order);
        }
      });
      setOrders(o);
    });
    return unsub;
  }, [user]);

  // Geolocation Listener
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setDriverLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status, 
        driverId: user.uid, 
        updatedAt: Timestamp.now() 
      });
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0b1126] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans text-white">
      {/* Phone Mockup Container */}
      <div className="relative w-full max-w-[400px] h-[800px] max-h-[90vh] artistic-bg rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-gray-800">
        
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <path d="M-50,200 Q150,50 350,300 T550,150" fill="none" stroke="#e42975" strokeWidth="20" strokeLinecap="round" opacity="0.6"/>
             <path d="M-20,400 Q120,600 400,450" fill="none" stroke="#1f51ff" strokeWidth="40" strokeLinecap="round" opacity="0.5"/>
             <circle cx="350" cy="100" r="40" fill="#e42975" opacity="0.4" />
             <rect x="50" y="600" width="80" height="80" rx="20" fill="#1f51ff" opacity="0.3" transform="rotate(45 90 640)" />
           </svg>
        </div>

        {/* Status Bar Mock (Time & Battery) */}
        <div className="absolute top-0 w-full flex justify-between items-center px-8 py-3 text-xs font-medium z-20">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-3 bg-white rounded-sm relative">
              <div className="absolute -right-1 top-1 w-0.5 h-1 bg-white rounded-r-sm"></div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <WelcomeScreen onStart={() => setShowWelcome(false)} />
            </motion.div>
          ) : !isLoggedIn ? (
            /* LOGIN SCREEN */
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 w-full h-full flex flex-col justify-center px-8 pt-16 pb-24"
            >
              <div className="text-center mb-10">
                 <div className="w-28 h-28 mx-auto mb-8 bg-white border-4 border-orange-500 rounded-[2.5rem] flex items-center justify-center overflow-hidden p-3 shadow-xl shadow-orange-500/20 group transition-all duration-500 hover:border-pink-500">
                    <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                 </div>
                <h1 className="font-display font-semibold text-3xl leading-tight text-white mb-2">
                  Portal de<br />Repartidores
                </h1>
                <p className="text-pink-200/80 font-light text-sm">Ingresa tus credenciales para comenzar tu ruta</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider pl-1">Correo Electrónico</label>
                  <div className="glass-panel rounded-2xl flex items-center p-4 focus-within:border-pink-400/50 focus-within:shadow-[0_0_15px_rgba(228,41,117,0.2)] transition-all">
                    <Mail size={20} className="text-white/40 mr-3" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="repartidor@delivery.com" 
                      className="bg-transparent border-none outline-none flex-1 text-base placeholder-white/30 font-light text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider pl-1">Contraseña</label>
                  <div className="glass-panel rounded-2xl flex items-center p-4 focus-within:border-blue-400/50 focus-within:shadow-[0_0_15px_rgba(31,81,255,0.2)] transition-all">
                    <Lock size={20} className="text-white/40 mr-3" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="bg-transparent border-none outline-none flex-1 text-base placeholder-white/30 font-light text-white"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-pink-500 text-xs text-center font-medium">{error}</p>}

                <button 
                  type="submit"
                  className="w-full mt-4 group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 p-[2px] rounded-2xl transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-all duration-300"></div>
                  <div className="relative bg-black/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center py-4 w-full h-full gap-2 text-white font-medium tracking-wide">
                    <span>Iniciar Sesión</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </form>
            </motion.div>
          ) : (
            /* MAIN APP SCREEN (DRIVER DASHBOARD) */
            <motion.div 
              key="main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 w-full h-full flex flex-col pt-12"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-center px-6 mb-6 shrink-0">
                <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center relative shadow-lg">
                  <Bell size={20} className="text-orange-300" />
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></div>
                </button>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-white rounded-full border border-orange-500 flex items-center justify-center overflow-hidden p-0.5 mb-1 shadow-md">
                    <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                  </div>
                  <h1 className="font-display font-bold text-sm leading-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 drop-shadow-sm">
                    Futuristic Mexico<br />Ride Home
                  </h1>
                </div>
                <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-white/70 shadow-lg" onClick={() => auth.signOut()}>
                  <Menu size={20} />
                </button>
              </div>

              {/* Available Header */}
              <div className="px-6 flex justify-between items-end mb-4 shrink-0">
                <h2 className="text-xl font-bold text-white tracking-wide">Disponibles ahora</h2>
                <span className="text-xs text-white/70 font-medium mb-1 tracking-wider">{orders.filter(o => o.status === 'pending').length} órdenes cerca</span>
              </div>

              {/* Map Graphic Mock (Now Real Component) */}
              <div className="px-6 mb-5 shrink-0">
                <div className="glass-panel overflow-hidden rounded-[28px] h-36 relative shadow-2xl border border-white/10 group cursor-pointer">
                  <OrderMap 
                    order={orders[0] || { deliveryLocation: { lat: 19.4326, lng: -99.1332 } }} 
                    driverLocation={driverLocation} 
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
                    <span className="text-[11px] font-semibold tracking-wide text-amber-300">En línea</span>
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="flex-1 overflow-y-auto hide-scrollbar px-6 space-y-4 pb-32">
                {orders.map(order => (
                  <div key={order.id} className="glass-panel p-5 rounded-[24px] relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                    {/* Ambient glow for the card */}
                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all"></div>
                    
                    <div className="flex justify-between items-center mb-1 relative z-10">
                      <h3 className="font-bold text-lg text-orange-200/90 tracking-wide">{order.businessName || 'Nuevo Pedido'}</h3>
                      <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-inner`}>
                        {order.status === 'pending' ? 'Express' : order.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-white/50 text-xs font-medium tracking-wide mb-5 relative z-10">
                      <Navigation size={12} className="mr-1.5 inline -rotate-45" />
                      {order.deliveryAddress?.substring(0, 30)}...
                    </div>
                    
                    <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Pago estimado</p>
                        <p className="text-2xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">${order.total}</p>
                      </div>
                      
                      {order.status === 'pending' ? (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'accepted' as OrderStatus)}
                          className="bg-gradient-to-tr from-transparent to-white/5 border border-amber-400/50 text-amber-300 px-6 py-2.5 rounded-xl text-sm font-semibold hover:border-amber-400 hover:bg-amber-400/10 active:scale-95 transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                        >
                          Aceptar
                        </button>
                      ) : (
                        <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-xl">
                          En Curso
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="glass-panel p-12 text-center rounded-[24px]">
                    <Package size={48} className="mx-auto mb-4 text-white/10" />
                    <p className="text-white/30 text-sm font-medium tracking-wide uppercase">No hay pedidos disponibles</p>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="glass-panel p-4 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                     <div className="absolute -left-6 -top-6 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl"></div>
                     <Gauge size={22} className="text-cyan-300 mb-3 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                     <div>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold relative z-10 mb-0.5">Eficiencia</p>
                       <p className="text-2xl font-display font-bold text-white relative z-10">98%</p>
                     </div>
                  </div>
                  <div className="glass-panel p-4 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                     <div className="absolute -right-6 -top-6 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl"></div>
                     <Star size={22} className="text-pink-400 mb-3 relative z-10 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                     <div>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold relative z-10 mb-0.5">Rating</p>
                       <p className="text-2xl font-display font-bold text-white relative z-10">4.9</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 w-full glass-panel rounded-t-[32px] border-b-0 border-x-0 pt-5 pb-8 px-10 flex justify-between items-center z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] bg-[#0b1126]/80 backdrop-blur-xl">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex flex-col items-center gap-1.5 ${activeTab === 'orders' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white/40'} group`}
                >
                  <Truck size={22} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-bold tracking-wide">Órdenes</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('earnings')}
                  className={`flex flex-col items-center gap-1.5 ${activeTab === 'earnings' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white/40'} group`}
                >
                  <Wallet size={22} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-medium tracking-wide">Ganancias</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center gap-1.5 ${activeTab === 'profile' ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white/40'} group`}
                >
                  <User size={22} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-medium tracking-wide">Perfil</span>
                </button>
              </div>

              {/* Fake Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/40 rounded-full z-40 pointer-events-none"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
