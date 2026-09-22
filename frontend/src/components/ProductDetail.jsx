import React from 'react';
import { X, Tag, Box, DollarSign, ImageOff, ShoppingBag } from 'lucide-react';
import { getFullImageUrl } from '../api/client';

export const ProductDetail = ({ product, isOpen, onClose, onOrder }) => {
  if (!isOpen || !product) return null;

  const imageUrl = getFullImageUrl(product.image_url);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Product Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              width: '100%',
              maxHeight: '320px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#0d121c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }}
              />
            ) : (
              <div className="no-image-placeholder" style={{ padding: '60px' }}>
                <ImageOff size={48} />
                <span>No image available</span>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{product.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
              {product.description || 'No description provided.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: 'var(--bg-primary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={20} style={{ color: 'var(--success-color)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={20} style={{ color: 'var(--accent-secondary)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</div>
                <div style={{ fontWeight: 700 }}>{product.category || 'General'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box size={20} style={{ color: 'var(--warning-color)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</div>
                <div style={{ fontWeight: 700 }}>{product.stock} units</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {onOrder && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onOrder(product);
                onClose();
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              <ShoppingBag size={18} /> Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
