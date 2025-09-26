import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { 
  Plus, 
  Inbox, 
  Calendar, 
  Filter,
  Hash,
  Star,
  CheckCircle,
  TrendingUp,
  Target
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

interface TodoistSidebarProps {
  projects: Project[];
  onAddTask: () => void;
  onProjectSelect: (projectId: string) => void;
  onViewSelect: (view: string) => void;
  currentView: string;
  todayCount: number;
  upcomingCount: number;
  karmaPoints: number;
  streak: number;
}

export const TodoistInspiredSidebar: React.FC<TodoistSidebarProps> = ({
  projects,
  onAddTask,
  onProjectSelect,
  onViewSelect,
  currentView,
  todayCount,
  upcomingCount,
  karmaPoints,
  streak
}) => {
  const [expandedProjects, setExpandedProjects] = useState(true);

  const quickViews = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox size={16} />, count: 0 },
    { id: 'today', name: 'Today', icon: <Calendar size={16} />, count: todayCount, color: '#d1453b' },
    { id: 'upcoming', name: 'Upcoming', icon: <Calendar size={16} />, count: upcomingCount, color: '#ad6200' },
    { id: 'filters', name: 'Filters & Labels', icon: <Filter size={16} />, count: 0 }
  ];

  return (
    <div style={{ 
      width: '280px',
      height: '100vh',
      backgroundColor: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0'
    }}>
      {/* Quick Add */}
      <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
        <Button
          themeColor="primary"
          onClick={onAddTask}
          style={{ 
            width: '100%', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}
        >
          <Plus size={16} />
          Add task
        </Button>
      </div>

      {/* Karma & Streak */}
      <div style={{ 
        padding: '0 1rem', 
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <div style={{
          flex: 1,
          padding: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#d1453b' }}>
            {karmaPoints}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Karma
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '0.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ad6200' }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Day streak
          </div>
        </div>
      </div>

      {/* Quick Views */}
      <div style={{ marginBottom: '1.5rem' }}>
        {quickViews.map(view => (
          <div
            key={view.id}
            onClick={() => onViewSelect(view.id)}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              backgroundColor: currentView === view.id ? 'var(--bg-secondary)' : 'transparent',
              borderLeft: currentView === view.id ? '3px solid var(--primary-color)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: view.color || 'var(--text-secondary)' }}>
              {view.icon}
            </div>
            <span style={{ 
              flex: 1, 
              fontSize: '0.875rem',
              color: 'var(--text-primary)'
            }}>
              {view.name}
            </span>
            {view.count > 0 && (
              <Badge
                style={{
                  backgroundColor: view.color || 'var(--text-secondary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px'
                }}
              >
                {view.count}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div 
          onClick={() => setExpandedProjects(!expandedProjects)}
          style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--text-secondary)'
          }}
        >
          <span style={{ transform: expandedProjects ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            ▶
          </span>
          Projects
        </div>

        {expandedProjects && (
          <div style={{ overflow: 'auto', maxHeight: '300px' }}>
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                style={{
                  padding: '0.5rem 1rem 0.5rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: project.color
                }} />
                <span style={{ 
                  flex: 1, 
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)'
                }}>
                  {project.name}
                </span>
                {project.taskCount > 0 && (
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {project.taskCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{ 
        padding: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <Button
          fillMode="flat"
          onClick={() => onViewSelect('analytics')}
          style={{ 
            justifyContent: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <TrendingUp size={14} />
          Analytics
        </Button>
        
        <Button
          fillMode="flat"
          onClick={() => onViewSelect('goals')}
          style={{ 
            justifyContent: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Target size={14} />
          Goals
        </Button>
      </div>
    </div>
  );
};