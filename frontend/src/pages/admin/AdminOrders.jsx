import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pagination } from '../../components/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Search, RefreshCw, ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

export const AdminOrders = ({ onIncrementApiCounter }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const counterRef = useRef(onIncrementApiCounter);
  useEffect(() => {
    counterRef.current = onIncrementApiCounter;
  }, [onIncrementApiCounter]);

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    if (counterRef.current) counterRef.current();

    try {
      const res = await api.get('/api/orders', {
        params: {
          page: currentPage,
          limit: limit,
          search: debouncedSearch,
          status: statusFilter,
        },
      });

      setOrders(res.data.orders || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalOrders(res.data.total || 0);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast('Could not load orders from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, statusFilter, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="badge badge-info">
            <Truck size={14} /> Shipped
          </span>
        );
      case 'Processing':
      case 'Pending':
        return (
          <span className="badge badge-warning">
            <Clock size={14} /> {status}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge badge-danger">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const startItem = totalOrders === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalOrders);

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="page-title">
            Admin Orders Dashboard
          </h1>
          <p className="page-subtitle">
            Showing <span className="highlight-text">{startItem}–{endItem}</span> of <span className="highlight-text">{totalOrders}</span> customer orders
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchOrders} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh Orders</span>
          </button>
        </div>
      </div>

      {/* Admin Filters Row */}
      <div className="admin-filters-bar glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div className="search-container" style={{ width: '300px' }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Status:</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: limit }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={6} style={{ padding: '16px', textAlign: 'center' }}>
                    <div className="skeleton-box" style={{ height: '24px', width: '100%' }}></div>
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={36} style={{ opacity: 0.5, marginBottom: '8px' }} />
                  <p>No orders found matching criteria.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ color: 'var(--accent-secondary)' }}>#{order.id}</strong>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{order.items_count} items</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>${parseFloat(order.total_amount).toFixed(2)}</span>
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Shared Reusable Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        totalItems={totalOrders}
      />
    </div>
  );
};
