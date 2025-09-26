import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import type { Task } from './types';
import './styles/globals.css';

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(null);
    setIsFormOpen(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Task Manager
        </h1>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.value || '')}
            placeholder="Search tasks..."
            style={{ width: '300px' }}
          />
          <Button
            themeColor="primary"
            onClick={() => setIsFormOpen(true)}
          >
            Add Task
          </Button>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredTasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  {task.title}
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
                  {task.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <span>Priority: {task.priority}</span>
                  <span>Status: {task.status}</span>
                  <span>Due: {task.deadline.toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  size="small"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  themeColor="error"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No tasks found. Add your first task to get started!
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask ? {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          deadline: editingTask.deadline
        } : undefined}
      />
    </div>
  );
}

export default App;
