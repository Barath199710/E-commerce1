import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { ShoppingBag, Calendar, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/orders/my');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError(err.response?.data?.error || 'Failed to fetch personal orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading your protected order history...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#e0e7ff',
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            My Orders (JWT Protected)
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '2px 0 0' }}>
            Viewing orders for signed-in user: <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
      </div>

      {error ? (
        <div
          style={{
            padding: '16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={20} /> {error}
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}
        >
          <Package size={48} style={{ color: '#cbd5e1', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', color: '#334155', margin: '0 0 6px' }}>No Orders Found</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            You haven't placed any orders yet. Explore our product catalog!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>
                    Order #{order.id}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background:
                        order.status === 'Delivered'
                          ? '#dcfce7'
                          : order.status === 'Shipped'
                          ? '#dbeafe'
                          : '#fef3c7',
                      color:
                        order.status === 'Delivered'
                          ? '#15803d'
                          : order.status === 'Shipped'
                          ? '#1d4ed8'
                          : '#b45309',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {order.created_at || 'Recent'}
                  </span>
                  <span>Items: {order.items_count}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
