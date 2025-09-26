import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Badge } from '@progress/kendo-react-indicators';
import { Plus, Grid3X3, Kanban, Calendar, Inbox, Star, TrendingUp, CheckCircle, Settings } from 'lucide-react';
import { getRandomQuote } from '../utils/motivational';

interface ProgressStats {
  total: number;
  completed: number;
  percentage: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'InProgress' | 'Done';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SidebarProps {
  progressStats: ProgressStats;
  currentView: 'grid' | 'kanban';
  onViewChange: (view: 'grid' | 'kanban') => void;
  onAddTask: () => void;
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
  tasks?: Task[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  progressStats, 
  currentView, 
  onViewChange, 
  onAddTask,
  currentFilter = 'inbox',
  onFilterChange = () => {},
  tasks = [] // Ajout des tâches pour les calculs
}) => {
  const quote = React.useMemo(() => getRandomQuote(), []);
  
  // Calculs dynamiques des tâches
  const todayTasks = React.useMemo(() => {
    return tasks.filter(task => {
      if (task.status === 'Done') return false;
      const today = new Date();
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === today.toDateString();
    }).length;
  }, [tasks]);
  
  const upcomingTasks = React.useMemo(() => {
    return tasks.filter(task => {
      if (task.status === 'Done') return false;
      const deadline = new Date(task.deadline);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      return deadline > endOfToday && deadline <= weekFromNow;
    }).length;
  }, [tasks]);
  
  const karmaPoints = progressStats.completed * 5;
  const streak = progressStats.completed > 0 ? Math.min(progressStats.completed, 7) : 0;

  const quickViews = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox size={16} />, count: progressStats.total - progressStats.completed, description: 'All tasks' },
    { id: 'today', name: 'Today', icon: <Calendar size={16} />, count: todayTasks, color: '#d1453b', description: 'Due today' },
    { id: 'upcoming', name: 'Upcoming', icon: <Calendar size={16} />, count: upcomingTasks, color: '#ad6200', description: 'Next 7 days' },
    { id: 'completed', name: 'Completed', icon: <CheckCircle size={16} />, count: progressStats.completed, color: '#10b981', description: 'Completed tasks' },
  ];

  return (
    <div className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Quick Add - Todoist Style */}
      <div style={{ padding: '0 0 1rem 0' }}>
        <Button
          themeColor="primary"
          onClick={onAddTask}
          style={{ 
            width: '100%', 
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Plus size={16} />
          Add task
        </Button>
      </div>

      {/* Karma & Streak - Todoist Style */}
      <div style={{ 
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          flex: 1,
          padding: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '6px',
          textAlign: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#d1453b', marginBottom: '0.25rem' }}>
            {karmaPoints}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Karma
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '6px',
          textAlign: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#ad6200', marginBottom: '0.25rem' }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Streak
          </div>
        </div>
      </div>

      {/* Quick Views - Todoist Style */}
      <div style={{ marginBottom: '1.5rem' }}>
        {quickViews.map(view => (
          <div
            key={view.id}
            onClick={() => onFilterChange(view.id)}
            style={{
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              borderRadius: '6px',
              marginBottom: '0.25rem',
              transition: 'all 0.15s ease',
              fontSize: '0.875rem',
              backgroundColor: currentFilter === view.id ? 'var(--bg-secondary)' : 'transparent',
              borderLeft: currentFilter === view.id ? '3px solid var(--primary-color)' : '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (currentFilter !== view.id) {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentFilter !== view.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            title={view.description}
          >
            <div style={{ color: currentFilter === view.id ? 'var(--primary-color)' : (view.color || 'var(--text-secondary)') }}>
              {view.icon}
            </div>
            <span style={{ 
              flex: 1, 
              color: 'var(--text-primary)',
              fontWeight: currentFilter === view.id ? '500' : '400'
            }}>
              {view.name}
            </span>
            {view.count > 0 && (
              <Badge
                style={{
                  backgroundColor: view.color || 'var(--text-secondary)',
                  color: 'white',
                  fontSize: '0.7rem',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  fontWeight: '500'
                }}
              >
                {view.count}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Motivational Quote - Compact */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        lineHeight: '1.3',
        fontStyle: 'italic'
      }}>
        💡 "{quote}"
      </div>

      {/* Progress Section - Todoist Style */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Daily Progress
            </span>
            <span style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.875rem' }}>
              {progressStats.completed}/{progressStats.total}
            </span>
          </div>
          
          <ProgressBar 
            value={progressStats.percentage} 
            style={{ marginBottom: '0.5rem', height: '6px' }}
          />
          
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {progressStats.percentage}% completed
          </div>
        </div>

        {/* Motivational Message */}
        {progressStats.percentage === 100 && progressStats.total > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '0.75rem',
            fontSize: '0.875rem'
          }}>
            🎉 All tasks completed!
          </div>
        )}
      </div>

      {/* Views Section - Todoist Style */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          marginBottom: '0.75rem',
          fontWeight: '600'
        }}>
          Views
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { id: 'grid', name: 'List View', icon: <Grid3X3 size={16} /> },
            { id: 'kanban', name: 'Board View', icon: <Kanban size={16} /> }
          ].map(view => (
            <div
              key={view.id}
              onClick={() => onViewChange(view.id as 'grid' | 'kanban')}
              style={{
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: currentView === view.id ? 'var(--bg-secondary)' : 'transparent',
                borderLeft: currentView === view.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                if (currentView !== view.id) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== view.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ color: currentView === view.id ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                {view.icon}
              </div>
              <span style={{ 
                color: 'var(--text-primary)',
                fontWeight: currentView === view.id ? '500' : '400'
              }}>
                {view.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats - Compact Todoist Style */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          marginBottom: '0.75rem',
          fontWeight: '600'
        }}>
          Quick Stats
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-secondary)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Pending
            </span>
            <Badge style={{ 
              backgroundColor: '#ad6200', 
              color: 'white',
              fontSize: '0.7rem',
              minWidth: '20px',
              height: '18px'
            }}>
              {progressStats.total - progressStats.completed}
            </Badge>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-secondary)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Done
            </span>
            <Badge style={{ 
              backgroundColor: 'var(--success-color)', 
              color: 'white',
              fontSize: '0.7rem',
              minWidth: '20px',
              height: '18px'
            }}>
              {progressStats.completed}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};