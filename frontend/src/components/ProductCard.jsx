import React, { useState } from 'react';
import { Edit2, Trash2, Eye, ImageOff, ShoppingBag } from 'lucide-react';
import { getFullImageUrl } from '../api/client';

export const ProductCard = ({ product, onEdit, onDelete, onViewDetail, onOrder, isAdmin }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getFullImageUrl(product.image_url);

  return (
    <div className="product-card glass-panel">
      <div className="product-img-wrapper">
        {product.category && (
          <span className="category-tag">{product.category}</span>
        )}

        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="no-image-placeholder">
            <ImageOff size={32} />
            <span>No image</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description || 'No description provided.'}</p>

        <div className="product-card-footer" style={{ marginTop: '12px' }}>
          <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>

          <div className="card-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {onOrder && (
              <button
                className="btn btn-primary"
                onClick={() => onOrder(product)}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '6px',
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Place Order for this Product"
              >
                <ShoppingBag size={14} /> Buy Now
              </button>
            )}

            <button
              className="icon-btn"
              onClick={() => onViewDetail(product)}
              title="View Details"
            >
              <Eye size={16} />
            </button>

            {isAdmin && (
              <>
                <button
                  className="icon-btn"
                  onClick={() => onEdit(product)}
                  title="Edit Product"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  className="icon-btn danger"
                  onClick={() => onDelete(product.id)}
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
