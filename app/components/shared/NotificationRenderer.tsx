"use client";

import React from 'react';
import Notification from './Notification';
import { useNotification } from '@/hooks/useNotification';

const NotificationRenderer: React.FC = () => {
  const { notifications, dismissNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2"> {/* Higher z-index and space-y-2 for stacking */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationRenderer;