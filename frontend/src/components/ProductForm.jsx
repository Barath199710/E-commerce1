import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { DragDropUpload } from './DragDropUpload';
import { api } from '../api/client';
import { useToast } from '../hooks/useToast';

const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Fashion', 'Footwear', 'Accessories'];

export const ProductForm = ({ isOpen, onClose, onProductSaved, initialData }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Electronics');
      setStock(initialData.stock !== undefined ? String(initialData.stock) : '1');
      setImageUrl(initialData.image_url || '');
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setCategory('Electronics');
      setStock('1');
      setImageUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      showToast('Name and Price are required fields.', 'error');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category,
      stock: parseInt(stock, 10) || 1,
      image_url: imageUrl,
    };

    try {
      if (initialData?.id) {
        await api.put(`/api/products/${initialData.id}`, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/api/products', payload);
        showToast('Product created successfully!', 'success');
      }

      onProductSaved();
      onClose();
    } catch (err) {
      console.error('Save product error:', err);
      const msg = err.response?.data?.error || 'Error saving product.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product features and description..."
            />
          </div>

          <DragDropUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Check size={18} />
              <span>{submitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
