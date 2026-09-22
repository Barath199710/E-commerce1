import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="product-card glass-panel skeleton-card">
      <div className="product-img-wrapper skeleton-box" style={{ height: '200px' }}></div>
      <div className="product-card-body" style={{ gap: '16px' }}>
        <div className="skeleton-box" style={{ height: '24px', width: '80%' }}></div>
        <div className="skeleton-box" style={{ height: '16px', width: '100%' }}></div>
        <div className="skeleton-box" style={{ height: '16px', width: '60%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px' }}>
          <div className="skeleton-box" style={{ height: '28px', width: '70px' }}></div>
          <div className="skeleton-box" style={{ height: '28px', width: '90px' }}></div>
        </div>
      </div>
    </div>
  );
};
