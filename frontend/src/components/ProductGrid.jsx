import React from 'react';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import { PackageX } from 'lucide-react';

export const ProductGrid = ({
  products,
  loading,
  onEdit,
  onDelete,
  onViewDetail,
  onOrder,
  isAdmin,
  limit = 8
}) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: limit }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <PackageX size={48} className="empty-icon" />
        <h3>No products found</h3>
        <p>Try searching for a different item or select another category filter.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetail={onViewDetail}
          onOrder={onOrder}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
