import { ShoppingBag, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'orders' | 'earnings' | 'profile';
  onTabChange: (tab: 'orders' | 'earnings' | 'profile') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'orders' as const, label: 'Ordenes', icon: ShoppingBag },
    { id: 'earnings' as const, label: 'Ganancias', icon: Wallet },
    { id: 'profile' as const, label: 'Perfil', icon: User },
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? '#ff7e5f' : 'rgba(255,255,255,0.25)',
                  filter: isActive ? 'drop-shadow(0 0 10px rgba(255,126,95,0.8))' : 'none',
                  transition: 'all 0.4s ease'
                }}
              />
              <span
                className="nav-label"
                style={{
                  color: isActive ? '#ff7e5f' : 'transparent',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'all 0.4s ease'
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: -2,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#ff7e5f',
                  boxShadow: '0 0 12px rgba(255,126,95,1)'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
