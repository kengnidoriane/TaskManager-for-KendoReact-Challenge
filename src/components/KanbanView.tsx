import React, { useState } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@progress/kendo-react-buttons';

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

interface KanbanViewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  viewTitle?: string;
  viewDescription?: string;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask,
  onEditTask,
  viewTitle = 'Board View',
  viewDescription = 'Drag tasks between columns'
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  
  // Filtrage par priorité
  const filteredTasks = priorityFilter === 'All' ? tasks : tasks.filter(task => task.priority === priorityFilter);
  
  const todoTasks = filteredTasks.filter(task => task.status === 'Todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'InProgress');
  const doneTasks = filteredTasks.filter(task => task.status === 'Done');

  const moveTask = (task: Task, newStatus: Task['status']) => {
    onUpdateTask(task.id, { status: newStatus });
  };

  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    switch (currentStatus) {
      case 'Todo': return 'InProgress';
      case 'InProgress': return 'Done';
      case 'Done': return null;
      default: return null;
    }
  };

  const getPrevStatus = (currentStatus: Task['status']): Task['status'] | null => {
    switch (currentStatus) {
      case 'InProgress': return 'Todo';
      case 'Done': return 'InProgress';
      case 'Todo': return null;
      default: return null;
    }
  };

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.status !== targetStatus) {
      onUpdateTask(draggedTask.id, { status: targetStatus });
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d1453b';
      case 'Medium': return '#eb8909';
      case 'Low': return '#246fe0';
      default: return '#666';
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Done';

    const handleMouseDown = (e: React.MouseEvent) => {
      // Permettre le drag immédiatement au mousedown
      e.currentTarget.setAttribute('draggable', 'true');
    };

    const handleDragStartLocal = (e: React.DragEvent) => {
      setIsDragging(true);
      handleDragStart(e, task);
      // Ajouter un effet visuel immédiat
      e.currentTarget.style.opacity = '0.7';
      e.currentTarget.style.transform = 'rotate(3deg) scale(1.05)';
    };

    const handleDragEndLocal = () => {
      setIsDragging(false);
      handleDragEnd();
    };

    return (
      <div 
        draggable
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStartLocal}
        onDragEnd={handleDragEndLocal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: draggedTask?.id === task.id ? '2px dashed var(--primary-color)' : '1px solid var(--border-color)',
          borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '0.5rem',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: draggedTask?.id === task.id ? 0.7 : 1,
          transform: draggedTask?.id === task.id ? 'rotate(3deg) scale(1.05)' : isHovered ? 'translateY(-2px)' : 'none',
          transition: isDragging ? 'none' : 'all 0.15s ease',
          boxShadow: isDragging ? '0 8px 25px rgba(0,0,0,0.2)' : isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
          userSelect: 'none'
        }}
      >
        {/* Task Content */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: task.description ? '0.25rem' : 0,
            lineHeight: '1.3'
          }}>
            {task.title}
          </div>
          
          {task.description && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.3'
            }}>
              {task.description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Priority Badge */}
          <div style={{
            fontSize: '0.65rem',
            color: getPriorityColor(task.priority),
            backgroundColor: `${getPriorityColor(task.priority)}15`,
            padding: '0.125rem 0.375rem',
            borderRadius: '10px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {task.priority}
          </div>

          {/* Due Date */}
          <div style={{
            fontSize: '0.7rem',
            color: isOverdue ? '#d1453b' : 'var(--text-secondary)',
            fontWeight: isOverdue ? '500' : '400',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {format(task.deadline, 'MMM dd', { locale: enUS })}
            {isOverdue && '⚠️'}
          </div>
        </div>

        {/* Actions on Hover */}
        {isHovered && (
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            marginTop: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <Button
              size="small"
              fillMode="flat"
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task);
              }}
              title="Edit task"
              style={{ minWidth: '24px', height: '24px' }}
            >
              <Edit size={10} />
            </Button>
            <Button
              size="small"
              fillMode="flat"
              themeColor="error"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              title="Delete task"
              style={{ minWidth: '24px', height: '24px' }}
            >
              <Trash2 size={10} />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const KanbanColumn: React.FC<{ 
    title: string; 
    tasks: Task[]; 
    status: Task['status'];
    color: string;
  }> = ({ title, tasks, status, color }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    
    const handleDragOverLocal = (e: React.DragEvent) => {
      e.preventDefault();
      if (draggedTask && draggedTask.status !== status) {
        setIsDragOver(true);
      }
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
      // Vérifier si on quitte vraiment la colonne
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragOver(false);
      }
    };
    
    const handleDropLocal = (e: React.DragEvent) => {
      handleDrop(e, status);
      setIsDragOver(false);
    };
    
    return (
      <div 
        onDragOver={handleDragOverLocal}
        onDragLeave={handleDragLeave}
        onDrop={handleDropLocal}
        style={{
          backgroundColor: isDragOver ? 'rgba(0,123,255,0.05)' : 'var(--bg-secondary)',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '500px',
          border: isDragOver ? '2px dashed var(--primary-color)' : '1px solid var(--border-color)',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </h3>
        <div style={{
          backgroundColor: color,
          color: 'white',
          borderRadius: '12px',
          width: '24px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {tasks.length}
        </div>
      </div>
      
      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      {/* Empty State */}
      {tasks.length === 0 && (
        <div style={{ 
          padding: '2rem 1rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          border: isDragOver ? '2px dashed var(--primary-color)' : 'none',
          borderRadius: '8px',
          backgroundColor: isDragOver ? 'rgba(0,123,255,0.1)' : 'transparent',
          fontSize: '0.875rem',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isDragOver ? (
            <div style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
              📥 Drop task here
            </div>
          ) : (
            'No tasks'
          )}
        </div>
      )}
      
      {/* Drop indicator when dragging over */}
      {isDragOver && tasks.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(0,123,255,0.1)',
          border: '2px dashed var(--primary-color)',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--primary-color)',
          fontWeight: '500'
        }}>
          📥 Drop here to move task
        </div>
      )}
    </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100%',
      padding: '1.5rem'
    }}>
      {/* Header */}
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
              {viewDescription}
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
          
          {/* Priority Filter */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Filter:</span>
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
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        minHeight: '500px'
      }}>
        <KanbanColumn 
          title="To Do" 
          tasks={todoTasks} 
          status="Todo"
          color="#6b7280"
        />
        <KanbanColumn 
          title="In Progress" 
          tasks={inProgressTasks} 
          status="InProgress"
          color="#3b82f6"
        />
        <KanbanColumn 
          title="Done" 
          tasks={doneTasks} 
          status="Done"
          color="#10b981"
        />
      </div>
    </div>
  );
};