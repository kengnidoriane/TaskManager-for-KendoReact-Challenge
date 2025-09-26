import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Edit, Trash2, Calendar, Search, Filter } from 'lucide-react';

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

interface GridViewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  viewTitle?: string;
  viewDescription?: string;
}

export const GridView: React.FC<GridViewProps> = ({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask,
  onEditTask,
  viewTitle = 'All Tasks',
  viewDescription = 'Manage your tasks'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  React.useEffect(() => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, priorityFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d1453b';
      case 'Medium': return '#eb8909';
      case 'Low': return '#246fe0';
      default: return '#666';
    }
  };

  const handleToggleComplete = (task: Task) => {
    onUpdateTask(task.id, {
      status: task.status === 'Done' ? 'Todo' : 'Done'
    });
  };


  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        minHeight: '400px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          No tasks yet
        </h3>
        <p>Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100%',
      padding: '1.5rem'
    }}>
      {/* Header - Todoist Style */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              {viewTitle}
            </h2>
            <div style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)' 
            }}>
              {viewDescription} • {filteredTasks.filter(t => t.status !== 'Done').length} remaining
              {priorityFilter !== 'All' && (
                <span style={{ 
                  marginLeft: '0.5rem',
                  padding: '0.125rem 0.375rem',
                  backgroundColor: `${getPriorityColor(priorityFilter)}15`,
                  color: getPriorityColor(priorityFilter),
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}>
                  {priorityFilter} priority
                </span>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Priority Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(['All', 'High', 'Medium', 'Low'] as const).map(priority => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: priorityFilter === priority ? 
                        (priority === 'All' ? 'var(--primary-color)' : getPriorityColor(priority)) : 
                        'var(--bg-secondary)',
                      color: priorityFilter === priority ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search */}
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.value || '')}
                placeholder="Search tasks..."
                style={{ 
                  paddingLeft: '40px',
                  width: '100%',
                  height: '36px',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List - Todoist Style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredTasks.map(task => {
          const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Done';
          
          return (
            <div
              key={task.id}
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: hoveredTask === task.id ? 'var(--bg-secondary)' : 'transparent',
                border: '1px solid',
                borderColor: hoveredTask === task.id ? 'var(--border-color)' : 'transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
              onClick={() => onEditTask(task)}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.status === 'Done'}
                onChange={() => handleToggleComplete(task)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: getPriorityColor(task.priority)
                }}
              />

              {/* Priority Indicator */}
              <div style={{
                width: '3px',
                height: '24px',
                backgroundColor: getPriorityColor(task.priority),
                borderRadius: '2px',
                opacity: task.status === 'Done' ? 0.3 : 1
              }} />

              {/* Task Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: task.status === 'Done' ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                  marginBottom: task.description ? '0.25rem' : 0
                }}>
                  {task.title}
                </div>
                
                {task.description && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    opacity: task.status === 'Done' ? 0.5 : 0.8
                  }}>
                    {task.description}
                  </div>
                )}
              </div>

              {/* Priority Badge */}
              <div style={{
                fontSize: '0.7rem',
                color: getPriorityColor(task.priority),
                backgroundColor: `${getPriorityColor(task.priority)}15`,
                padding: '0.125rem 0.375rem',
                borderRadius: '12px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {task.priority}
              </div>

              {/* Due Date */}
              <div style={{
                fontSize: '0.75rem',
                color: isOverdue ? '#d1453b' : 'var(--text-secondary)',
                fontWeight: isOverdue ? '500' : '400'
              }}>
                {format(task.deadline, 'MMM dd', { locale: enUS })}
                {isOverdue && ' ⚠️'}
              </div>

              {/* Actions */}
              {hoveredTask === task.id && (
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button
                    size="small"
                    fillMode="flat"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    style={{ minWidth: '28px', height: '28px' }}
                    title="Edit"
                  >
                    <Edit size={12} />
                  </Button>
                  
                  <Button
                    size="small"
                    fillMode="flat"
                    themeColor="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    style={{ minWidth: '28px', height: '28px' }}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};