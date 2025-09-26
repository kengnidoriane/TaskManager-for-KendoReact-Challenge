import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Badge } from '@progress/kendo-react-indicators';
import { Bell, X, Brain, AlertTriangle, Clock, Trophy } from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'deadline' | 'overdue' | 'workload' | 'insight' | 'celebration';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface SmartNotificationCenterProps {
  notifications: SmartNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onAddTest?: () => void;
}

export const SmartNotificationCenter: React.FC<SmartNotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onAddTest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchor = React.useRef<HTMLButtonElement>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock size={16} />;
      case 'overdue': return <AlertTriangle size={16} />;
      case 'workload': return <AlertTriangle size={16} />;
      case 'insight': return <Brain size={16} />;
      case 'celebration': return <Trophy size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger-color)';
      case 'medium': return 'var(--warning-color)';
      case 'low': return 'var(--primary-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  // Smart notification actions
  const handleNotificationAction = (notification: SmartNotification, action: string) => {
    switch (action) {
      case 'snooze':
        // Snooze for 1 hour
        const snoozeTime = new Date(Date.now() + 60 * 60 * 1000);
        console.log(`Snoozed until ${snoozeTime.toLocaleTimeString()}`);
        onDismiss(notification.id);
        break;
      case 'complete':
        // Mark related task as complete
        console.log('Marking task as complete');
        onDismiss(notification.id);
        break;
      case 'reschedule':
        // Open reschedule dialog
        console.log('Opening reschedule dialog');
        break;
      default:
        onDismiss(notification.id);
    }
  };

  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  return (
    <>
      <Button
        ref={anchor}
        fillMode="flat"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
        title="Smart Notifications"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <Badge
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: highPriorityCount > 0 ? 'var(--danger-color)' : 'var(--primary-color)',
              color: 'white',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {notifications.length}
          </Badge>
        )}
      </Button>

      <Popup
        anchor={anchor.current}
        show={isOpen}
        onClose={() => setIsOpen(false)}
        style={{
          width: '400px',
          maxHeight: '500px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          zIndex: 1000
        }}
      >
        <div style={{ padding: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={20} color="var(--primary-color)" />
              Smart Notifications
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onAddTest && (
                <Button
                  size="small"
                  fillMode="flat"
                  themeColor="primary"
                  onClick={onAddTest}
                  style={{ fontSize: '0.75rem' }}
                  title="Add test notifications"
                >
                  Test
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  size="small"
                  fillMode="flat"
                  onClick={onClearAll}
                  style={{ fontSize: '0.75rem' }}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem 1rem',
              color: 'var(--text-secondary)'
            }}>
              <Bell size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>No notifications</p>
              <p style={{ fontSize: '0.875rem' }}>AI insights will appear here</p>
            </div>
          ) : (
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--border-radius)',
                    borderLeft: `4px solid ${getNotificationColor(notification.priority)}`,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ color: getNotificationColor(notification.priority), marginTop: '0.25rem' }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        marginBottom: '0.25rem',
                        color: 'var(--text-primary)'
                      }}>
                        {notification.title}
                      </div>
                      
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4',
                        marginBottom: '0.5rem'
                      }}>
                        {notification.message}
                      </div>
                      
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-secondary)',
                        opacity: 0.7
                      }}>
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {/* Smart Action Buttons */}
                      {notification.type === 'deadline' && (
                        <>
                          <Button
                            size="small"
                            fillMode="flat"
                            themeColor="primary"
                            onClick={() => handleNotificationAction(notification, 'snooze')}
                            style={{ minWidth: '20px', height: '20px', fontSize: '0.6rem' }}
                            title="Snooze 1h"
                          >
                            💤
                          </Button>
                          <Button
                            size="small"
                            fillMode="flat"
                            themeColor="success"
                            onClick={() => handleNotificationAction(notification, 'complete')}
                            style={{ minWidth: '20px', height: '20px', fontSize: '0.6rem' }}
                            title="Mark complete"
                          >
                            ✅
                          </Button>
                        </>
                      )}
                      
                      {notification.type === 'overdue' && (
                        <Button
                          size="small"
                          fillMode="flat"
                          themeColor="warning"
                          onClick={() => handleNotificationAction(notification, 'reschedule')}
                          style={{ minWidth: '20px', height: '20px', fontSize: '0.6rem' }}
                          title="Reschedule"
                        >
                          📅
                        </Button>
                      )}
                      
                      <Button
                        size="small"
                        fillMode="flat"
                        onClick={() => onDismiss(notification.id)}
                        style={{ minWidth: '20px', height: '20px' }}
                        title="Dismiss"
                      >
                        <X size={10} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Popup>
    </>
  );
};