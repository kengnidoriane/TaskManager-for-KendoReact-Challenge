import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox } from '@progress/kendo-react-inputs';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { 
  MoreHorizontal, 
  Calendar, 
  Flag, 
  Edit3, 
  Trash2,
  MessageSquare
} from 'lucide-react';

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

interface TodoistTaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  viewTitle?: string;
}

export const TodoistTaskList: React.FC<TodoistTaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  viewTitle = "Tasks"
}) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d1453b';
      case 'Medium': return '#eb8909';
      case 'Low': return '#246fe0';
      default: return '#666';
    }
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue = (task: Task) => {
    return isPast(task.deadline) && task.status !== 'Done';
  };

  const handleToggleComplete = (task: Task) => {
    onUpdateTask(task.id, {
      status: task.status === 'Done' ? 'Todo' : 'Done'
    });
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const dateKey = format(task.deadline, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const sortedDateKeys = Object.keys(groupedTasks).sort();

  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
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
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
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
          {tasks.filter(t => t.status !== 'Done').length} tasks remaining
        </div>
      </div>

      {/* Task Groups by Date */}
      {sortedDateKeys.map(dateKey => {
        const dateTasks = groupedTasks[dateKey];
        const date = new Date(dateKey);
        
        return (
          <div key={dateKey} style={{ marginBottom: '2rem' }}>
            {/* Date Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: isOverdue({ deadline: date } as Task) ? '#d1453b' : 'var(--text-primary)'
              }}>
                {formatDate(date)}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.125rem 0.375rem',
                borderRadius: '12px'
              }}>
                {dateTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dateTasks.map(task => (
                <div
                  key={task.id}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: hoveredTask === task.id ? 'var(--bg-secondary)' : 'transparent',
                    border: '1px solid transparent',
                    borderColor: hoveredTask === task.id ? 'var(--border-color)' : 'transparent',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => onEditTask(task)}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={task.status === 'Done'}
                    onChange={() => handleToggleComplete(task)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      accentColor: getPriorityColor(task.priority)
                    }}
                  />

                  {/* Priority Indicator */}
                  <div style={{
                    width: '3px',
                    height: '20px',
                    backgroundColor: getPriorityColor(task.priority),
                    borderRadius: '2px',
                    opacity: task.status === 'Done' ? 0.3 : 1
                  }} />

                  {/* Task Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.875rem',
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
                        <MessageSquare size={12} style={{ marginRight: '0.25rem', display: 'inline' }} />
                        {task.description}
                      </div>
                    )}
                  </div>

                  {/* Due Date Badge */}
                  {isOverdue(task) && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#d1453b',
                      backgroundColor: 'rgba(209, 69, 59, 0.1)',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      Overdue
                    </div>
                  )}

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
                        <Edit3 size={12} />
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
                      
                      <Button
                        size="small"
                        fillMode="flat"
                        style={{ minWidth: '28px', height: '28px' }}
                        title="More options"
                      >
                        <MoreHorizontal size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};