import React from 'react';
import { ListBox, ListBoxToolbar } from '@progress/kendo-react-listbox';
import { PriorityBadge } from './TaskBadges';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

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

interface DragDropKanbanProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export const DragDropKanban: React.FC<DragDropKanbanProps> = ({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask,
  onEditTask 
}) => {
  const todoTasks = tasks.filter(task => task.status === 'Todo');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  const handleDragEnd = (event: any, targetStatus: Task['status']) => {
    const draggedTask = event.dataItem;
    if (draggedTask.status !== targetStatus) {
      onUpdateTask(draggedTask.id, { status: targetStatus });
    }
  };

  const taskItemRender = (li: any, itemProps: any) => {
    const task = itemProps.dataItem;
    return React.cloneElement(li, li.props, (
      <div className="task-card" style={{ margin: '0.5rem 0' }}>
        <div className="task-title">{task.title}</div>
        <div className="task-description" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {task.description}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <PriorityBadge priority={task.priority} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            📅 {format(task.deadline, 'MMM dd', { locale: enUS })}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <div className="kanban-column">
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>To Do ({todoTasks.length})</h3>
        <ListBox
          data={todoTasks}
          textField="title"
          dataItemKey="id"
          itemRender={taskItemRender}
          style={{ height: '500px', border: '2px dashed var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}
          onDragEnd={(e) => handleDragEnd(e, 'Todo')}
        />
      </div>

      <div className="kanban-column">
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>In Progress ({inProgressTasks.length})</h3>
        <ListBox
          data={inProgressTasks}
          textField="title"
          dataItemKey="id"
          itemRender={taskItemRender}
          style={{ height: '500px', border: '2px dashed var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}
          onDragEnd={(e) => handleDragEnd(e, 'InProgress')}
        />
      </div>

      <div className="kanban-column">
        <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Done ({doneTasks.length})</h3>
        <ListBox
          data={doneTasks}
          textField="title"
          dataItemKey="id"
          itemRender={taskItemRender}
          style={{ height: '500px', border: '2px dashed var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}
          onDragEnd={(e) => handleDragEnd(e, 'Done')}
        />
      </div>
    </div>
  );
};