import { Order, OrderStatus } from '../types';
import { MapPin, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  isPriority?: boolean;
}

export default function OrderCard({ order, onUpdateStatus, isPriority }: OrderCardProps) {
  const isPending = order.status === 'pending';

  return (
    <div className="order-card">
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <div className="store-name">
            {order.storeName || (isPriority ? 'La Cantina Central' : 'Panadería Rosetta')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '0.5rem' }}>
            <MapPin size={13} style={{ color: '#00e5ff', flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {isPriority ? '2.5' : '1.2'} km de distancia
            </span>
          </div>
        </div>
        <span className={isPriority ? 'badge-express' : 'badge-fragil'}>
          {isPriority ? 'Express' : 'Frágil'}
        </span>
      </div>

      {/* Payment + Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.5rem' }}>
            Pago Estimado
          </div>
          <div className="price-display">
            {formatCurrency(order.total || (isPriority ? 45.00 : 32.50))}
          </div>
        </div>

        {isPending ? (
          <button
            className="btn-accept"
            onClick={() => onUpdateStatus(order.id, 'accepted')}
          >
            Aceptar
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <span style={{
              background: 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.25)',
              color: '#00e5ff',
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.9rem',
              borderRadius: '0.8rem'
            }}>EN PROGRESO</span>
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', padding: 0, transition: 'color 0.3s' }}
            >
              Actualizar <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
