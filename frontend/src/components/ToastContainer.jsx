import React from 'react';
import { useToast } from '../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertCircle;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} />
            <span style={{ flexGrow: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'currentColor', cursor: 'pointer', opacity: 0.7 }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
