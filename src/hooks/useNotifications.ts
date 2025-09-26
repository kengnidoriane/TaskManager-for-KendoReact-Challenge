import { useState, useCallback } from 'react';

interface NotificationData {
  title: string;
  content: string;
  type: { style: 'success' | 'info' | 'warning' | 'error'; icon: boolean };
}

interface Notification extends NotificationData {
  id: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: NotificationData) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification
  };
};