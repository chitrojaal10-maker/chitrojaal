// app/components/shared/Notification.tsx
import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000); // Notification disappears after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? FiCheckCircle : FiAlertCircle;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg text-white ${bgColor}`}
      role="alert"
    >
      <Icon size={24} />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-auto p-1 rounded-full hover:bg-white/20">
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Notification;