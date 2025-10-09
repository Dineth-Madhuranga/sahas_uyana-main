import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import './ToastProvider.css';

const ToastContext = createContext({
  showToast: (message, options) => {}
});

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, { type = 'info', duration = 3500, icon } = {}) => {
    const id = ++idCounter;
    const toast = { id, message, type, icon, createdAt: Date.now() };
    setToasts((prev) => [...prev, toast]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-icon" aria-hidden="true">
              {t.icon || (t.type === 'success' ? '✅' : t.type === 'error' ? '⛔' : t.type === 'warning' ? '⚠️' : 'ℹ️')}
            </div>
            <div className="toast-message">{t.message}</div>
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Close notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);


