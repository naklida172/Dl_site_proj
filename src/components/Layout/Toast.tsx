import React from 'react';
import { Check } from 'lucide-react';
import { useRestaurant } from '../../store/RestaurantContext';

export const ToastStack: React.FC = () => {
  const { toasts } = useRestaurant();

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
