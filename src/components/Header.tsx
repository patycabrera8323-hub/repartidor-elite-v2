import { Bell, Zap, Menu as MenuIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  title: string;
  isOnline: boolean;
  pendingCount?: number;
  onBellClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ title, isOnline, pendingCount = 0, onBellClick, onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark border-b border-white/5 px-6 py-5 flex justify-between items-center backdrop-blur-3xl">
        <div className="flex items-center gap-5">
          <button 
            onClick={onMenuClick} 
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-neon-cyan hover:neon-border-cyan transition-all active:scale-95 shadow-xl"
          >
            <MenuIcon size={20} strokeWidth={1.5} />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-sm font-display font-black text-white tracking-tight uppercase">{title}</h1>
               <div className={cn(
                 "px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border transition-all duration-700",
                 isOnline ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30" : "bg-white/5 text-white/20 border-white/10"
               )}>
                 {isOnline ? 'ACTIVO' : 'OFFLINE'}
               </div>
            </div>
            <p className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 leading-none mt-2">PROTOCOLO ELITE v2.5</p>
          </div>
        </div>
        
        <button 
          onClick={onBellClick}
          className={cn(
            "relative w-12 h-12 glass rounded-2xl flex items-center justify-center transition-all group active:scale-90 shadow-xl",
            pendingCount > 0 ? "text-neon-pink neon-border-pink" : "text-white/40 border-white/5 hover:text-white"
          )}
        >
          <Bell size={20} strokeWidth={1.5} className={cn(pendingCount > 0 && "drop-shadow-neon-pink animate-pulse")} />
          {pendingCount > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
          )}
        </button>
      </div>
    </header>
  );
}
