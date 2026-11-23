// hooks/useNotification.ts
import { useState, useCallback, useRef } from 'react';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  id: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const notificationIdCounter = useRef(0);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type, id: notificationIdCounter.current++ },
    ]);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );
  }, []);

  return {
    notifications,
    showSuccess: useCallback((message: string) => showNotification(message, 'success'), [showNotification]),
    showError: useCallback((message: string) => showNotification(message, 'error'), [showNotification]),
    dismissNotification,
  };
};