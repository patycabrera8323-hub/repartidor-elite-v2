import React, { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { 
  LogOut, 
  Bell, 
  Navigation, 
  History, 
  Wallet, 
  User as UserIcon, 
  Menu as MenuIcon, 
  X, 
  Zap,
  Power,
  Box,
  Truck,
  Settings,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { WelcomeScreen } from './components/WelcomeScreen';
import AuthFlow from './components/AuthFlow';
import { orderService } from './services/orderService';
import { Order } from './types';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<'dashboard' | 'history' | 'profile'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const dDoc = await getDoc(doc(db, 'drivers', u.uid));
        if (dDoc.exists()) {
          const data = dDoc.data();
          setUserData(data);
          setIsApproved(data.approved === true);
        } else {
          setIsApproved(false);
        }
      }
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || !isOnline) {
      setOrders([]);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('status', 'in', ['pending', 'accepted', 'preparing', 'ready', 'on_route']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data: Order[] = [];
      snap.forEach(d => {
        const order = { id: d.id, ...d.data() } as Order;
        if (order.status === 'pending' || order.driverId === user.uid) {
          data.push(order);
        }
      });
      setOrders(data);
    });

    return () => unsubscribe();
  }, [user, isOnline]);

  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status'], assign: boolean = false) => {
    try {
      await orderService.updateOrderStatus(orderId, nextStatus, assign);
      if (nextStatus === 'accepted') setIsOnline(true);
    } catch (e) {
      alert("Error en el sistema.");
    }
  };

  const handleLogout = () => { auth.signOut(); window.location.reload(); };

  if (showWelcome) return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  
  if (authLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-6 h-6 border-[1px] border-green-500/20 border-t-green-500 rounded-full animate-spin" />
    </div>
  );

  if (!user || isApproved === false) return <AuthFlow onAuthenticated={setUser} />;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30 overflow-hidden flex flex-col">
      
      {/* 📱 TOP BAR - ULTRA MINIMAL */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/[0.05] sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-white/40 hover:text-green-500 transition-colors">
            <MenuIcon size={22} strokeWidth={1.5} />
          </button>
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-green-500 leading-none mb-1">Status: Active</p>
            <h1 className="text-xs font-bold tracking-tight text-white/90">{userData?.name || 'Driver Elite'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
             <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Earnings Today</p>
             <p className="text-sm font-black text-white">${earnings.toFixed(2)}</p>
          </div>
          <button className="relative text-white/40">
            <Bell size={20} strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* 🗺 MAIN DASHBOARD */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
        
        {/* Connection Status - Uber Style */}
        <section>
          <div className={cn(
            "p-8 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden",
            isOnline ? "bg-green-500/5 border-green-500/20" : "bg-white/[0.02] border-white/[0.05]"
          )}>
            <div className="relative z-10 flex items-center justify-between">
               <div className="space-y-1">
                 <h2 className="text-2xl font-black tracking-tighter uppercase">{isOnline ? 'On Duty' : 'Off Duty'}</h2>
                 <p className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase">{isOnline ? 'Searching for trips...' : 'Go online to start'}</p>
               </div>
               <button 
                 onClick={() => setIsOnline(!isOnline)}
                 className={cn(
                   "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border-[0.5px]",
                   isOnline ? "bg-green-500 border-white/20 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]" : "bg-white/5 border-white/10 text-white/20"
                 )}
               >
                 <Power size={24} strokeWidth={2.5} />
               </button>
            </div>
          </div>
        </section>

        {/* Orders List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Active Tasks ({orders.length})</h3>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-10">
                    <Navigation size={24} />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10">No orders nearby</p>
                </motion.div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className={cn(
                      "p-7 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500",
                      order.driverId === user.uid ? "bg-white/[0.03] border-green-500/30" : "bg-white/[0.01] border-white/[0.05]"
                    )}
                  >
                    <div className="flex justify-between items-start mb-8">
                       <div className="space-y-1">
                         <div className="flex gap-2">
                            <span className="text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Elite</span>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">#{order.id.slice(-4)}</span>
                         </div>
                         <h4 className="text-xl font-black tracking-tight leading-none">{order.storeName}</h4>
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-black text-white leading-none">${order.total}</p>
                         <p className="text-[8px] font-black text-white/20 uppercase mt-1">Total</p>
                       </div>
                    </div>

                    <div className="space-y-5 mb-8">
                      <LocationStep color="bg-green-500" label="Pickup" address={order.pickupLocation.address} />
                      <LocationStep color="bg-white/20" label="Delivery" address={order.deliveryLocation.address} />
                    </div>

                    <button 
                      onClick={() => {
                        if (order.driverId === user.uid) {
                          const flow = ['accepted', 'preparing', 'ready', 'on_route', 'delivered'];
                          const currentIdx = flow.indexOf(order.status);
                          if (currentIdx < flow.length - 1) handleUpdateStatus(order.id, flow[currentIdx + 1] as any);
                        } else {
                          handleUpdateStatus(order.id, 'accepted', true);
                        }
                      }}
                      className={cn(
                        "w-full py-5 rounded-full font-black uppercase tracking-[0.3em] text-[9px] transition-all flex items-center justify-center gap-3",
                        order.driverId === user.uid ? "bg-green-500 text-black" : "bg-white text-black hover:bg-green-500"
                      )}
                    >
                      {order.driverId === user.uid ? 'Update Status' : 'Accept Trip'}
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* 🧭 NAVIGATION DOCK - PILL STYLE */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border-[0.5px] border-white/10 rounded-full px-3 py-2 flex items-center gap-1 shadow-2xl">
           <NavBtn icon={<Zap />} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
           <NavBtn icon={<History />} active={view === 'history'} onClick={() => setView('history')} />
           <NavBtn icon={<Wallet />} active={view === 'profile'} onClick={() => setView('profile')} />
           <NavBtn icon={<UserIcon />} active={view === 'profile'} onClick={() => setView('profile')} />
        </div>
      </nav>

      {/* 🌑 SIDEBAR - ULTRA THIN */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-80 bg-black z-[101] border-r border-white/5 p-10 flex flex-col">
              <div className="flex items-center justify-between mb-16">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-3">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <button onClick={() => setSidebarOpen(false)} className="text-white/20"><X size={24} /></button>
              </div>
              <div className="flex-1 space-y-2">
                 <SideBtn icon={<Truck />} label="Terminal" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setSidebarOpen(false); }} />
                 <SideBtn icon={<History />} label="Journal" active={view === 'history'} onClick={() => { setView('history'); setSidebarOpen(false); }} />
                 <SideBtn icon={<Wallet />} label="Earnings" active={view === 'profile'} onClick={() => { setView('profile'); setSidebarOpen(false); }} />
                 <SideBtn icon={<Settings />} label="Settings" active={false} />
              </div>
              <button onClick={handleLogout} className="mt-auto flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] text-[8px] hover:bg-red-500/10 hover:text-red-500 transition-all">
                <LogOut size={16} /> Logout System
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function LocationStep({ color, label, address }: { color: string, label: string, address: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center pt-1">
         <div className={cn("w-2 h-2 rounded-full", color)} />
         <div className="w-[0.5px] h-full bg-white/5 mt-1" />
      </div>
      <div>
        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20 leading-none mb-1">{label}</p>
        <p className="text-[11px] font-bold text-white/60 leading-tight">{address}</p>
      </div>
    </div>
  );
}

function NavBtn({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", active ? "bg-white text-black shadow-lg shadow-white/5" : "text-white/20")}>
      {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 1.5 })}
    </button>
  );
}

function SideBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-5 p-5 rounded-2xl transition-all font-black uppercase tracking-[0.3em] text-[8px]", active ? "bg-green-500 text-black" : "text-white/30 hover:bg-white/5 hover:text-white")}>
      {React.cloneElement(icon as React.ReactElement, { size: 16, strokeWidth: 2 })}
      {label}
    </button>
  );
}
