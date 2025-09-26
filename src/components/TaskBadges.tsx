import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Circle, Play, Check } from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Todo' | 'InProgress' | 'Done';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getIcon = () => {
    switch (priority) {
      case 'High': return <AlertTriangle size={12} />;
      case 'Medium': return <Clock size={12} />;
      case 'Low': return <CheckCircle size={12} />;
    }
  };

  return (
    <span className={`priority-badge priority-${priority.toLowerCase()}`}>
      {getIcon()}
      {priority}
    </span>
  );
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'Todo': return <Circle size={12} />;
      case 'InProgress': return <Play size={12} />;
      case 'Done': return <Check size={12} />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'Todo': return 'À faire';
      case 'InProgress': return 'En cours';
      case 'Done': return 'Terminé';
    }
  };

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {getIcon()}
      {getLabel()}
    </span>
  );
};