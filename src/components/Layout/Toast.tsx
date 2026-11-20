import React from 'react';
import { Check } from 'lucide-react';
import { useAppData } from '../../store/AppDataContext';

export const ToastStack: React.FC = () => {
  const { toasts } = useAppData();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          <Check size={15} />
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
