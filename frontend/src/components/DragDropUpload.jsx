import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { api, getFullImageUrl } from '../api/client';

export const DragDropUpload = ({ imageUrl, setImageUrl }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Allowed: PNG, JPG, JPEG, WEBP.';
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return 'File size exceeds 2 MB limit.';
    }
    return null;
  };

  const uploadFile = async (file) => {
    setError(null);
    const valError = validateFile(file);
    if (valError) {
      setError(valError);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setImageUrl(res.data.image_url);
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.response?.data?.error || 'Failed to upload image.';
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const fullPreviewUrl = getFullImageUrl(imageUrl);

  return (
    <div className="form-group">
      <label className="form-label">Product Image</label>

      {imageUrl ? (
        <div className="preview-container">
          <img src={fullPreviewUrl} alt="Upload preview" className="preview-img" />
          <button
            type="button"
            className="remove-preview-btn"
            onClick={() => setImageUrl('')}
            title="Remove Image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div className="dropzone-icon">
            <UploadCloud size={24} />
          </div>

          <p className="dropzone-text">
            <span className="dropzone-highlight">Click to upload</span> or drag and drop
          </p>
          <p className="dropzone-hint">PNG, JPG, JPEG, WEBP (Max 2 MB)</p>
        </div>
      )}

      {uploading && (
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}

      {error && (
        <div className="upload-error-msg" style={{ color: 'var(--error-color)', fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
