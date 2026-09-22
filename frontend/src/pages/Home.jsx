import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Pagination } from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { api } from '../api/client';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Home & Kitchen', 'Fashion', 'Footwear', 'Accessories'];

export const Home = ({
  searchQuery,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onIncrementApiCounter,
  onNavigateToOrders,
  onNavigateToLogin,
}) => {
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const counterRef = useRef(onIncrementApiCounter);
  useEffect(() => {
    counterRef.current = onIncrementApiCounter;
  }, [onIncrementApiCounter]);

  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Debounced search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOrder]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    if (counterRef.current) counterRef.current();

    try {
      const res = await api.get('/api/products', {
        params: {
          page: currentPage,
          limit: limit,
          search: debouncedSearch,
          category: selectedCategory,
          sort: sortOrder,
        },
      });

      setProducts(res.data.products || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalProducts(res.data.total || 0);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Could not fetch products from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, selectedCategory, sortOrder, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/api/products/${id}`);
      showToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete product.', 'error');
    }
  };

  const handlePlaceOrder = async (product) => {
    if (!isAuthenticated) {
      showToast('Please log in to place an order.', 'error');
      if (onNavigateToLogin) onNavigateToLogin();
      return;
    }

    try {
      await api.post('/api/orders', {
        product_id: product.id,
        items_count: 1,
      });
      showToast(`Order placed for "${product.name}"!`, 'success');
      if (onNavigateToOrders) onNavigateToOrders();
    } catch (err) {
      console.error('Order error:', err);
      showToast(err.response?.data?.error || 'Failed to place order.', 'error');
    }
  };

  const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="home-page-container">
      {/* Header & Controls */}
      <div className="catalog-header">
        <div>
          <h1 className="page-title">
            Product Catalog
          </h1>
          <p className="page-subtitle">
            Showing <span className="highlight-text">{startItem}–{endItem}</span> of <span className="highlight-text">{totalProducts}</span> products
            {debouncedSearch && <span> for search <strong>"{debouncedSearch}"</strong></span>}
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchProducts} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Sort dropdown */}
      <div className="filter-controls-row">
        <div className="categories-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-container">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            className="form-select sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Product Grid / Skeleton */}
      <ProductGrid
        products={products}
        loading={loading}
        onEdit={onOpenEditModal}
        onDelete={handleDeleteProduct}
        onViewDetail={onOpenDetailModal}
        onOrder={handlePlaceOrder}
        isAdmin={isAdmin}
        limit={limit}
      />

      {/* Pagination Component */}
      <div style={{ marginTop: '36px' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setCurrentPage(1);
          }}
          totalItems={totalProducts}
        />
      </div>
    </div>
  );
};
