import React from 'react';

interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low';
}

interface StatusBadgeProps {
  status: 'Todo' | 'InProgress' | 'Done';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colors = {
    High: '#d1453b',
    Medium: '#eb8909',
    Low: '#246fe0'
  };

  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: `${colors[priority]}20`,
      color: colors[priority]
    }}>
      {priority}
    </span>
  );
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    Todo: { color: '#666', label: 'To Do', icon: '📝' },
    InProgress: { color: '#eb8909', label: 'In Progress', icon: '⚡' },
    Done: { color: '#22c55e', label: 'Done', icon: '✅' }
  };

  const { color, label, icon } = config[status];

  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: `${color}20`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }}>
      {icon} {label}
    </span>
  );
};