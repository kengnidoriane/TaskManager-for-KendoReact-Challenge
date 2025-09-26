import React, { useState, useEffect } from 'react';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GridView } from './components/GridView';
import { KanbanView } from './components/KanbanView';


import { TaskForm } from './components/TaskForm';
import { Celebration } from './components/Celebration';
import { OnboardingStepper } from './components/OnboardingStepper';
import { useTasks } from './hooks/useTasks';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useNotifications } from './hooks/useNotifications';
import { getCelebrationMessage } from './utils/motivational';
import { Task, TaskFormData } from './types';
import './styles/globals.css';

function App() {
  const { 
    tasks, 
    loading, 
    addTask, 
    updateTask, 
    deleteTask, 
    getProgressStats 
  } = useTasks();
  
  const [currentView, setCurrentView] = useState<'grid' | 'kanban'>('grid');
  const [currentFilter, setCurrentFilter] = useState('inbox'); // Nouveau state pour le filtrage
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboardingCompleted');
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const progressStats = getProgressStats();
  const prevCompletedRef = React.useRef(progressStats.completed);
  const [isDark, setIsDark] = useDarkMode();
  
  // Filtrage des tâches
  const { filteredTasks, filterTitle, filterDescription } = useTaskFilters(tasks, currentFilter);
  


  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => setIsFormOpen(true),
    onToggleView: () => setCurrentView(prev => prev === 'grid' ? 'kanban' : 'grid')
  });

  // Celebration effect when tasks are completed
  useEffect(() => {
    if (progressStats.completed > prevCompletedRef.current && progressStats.completed > 0) {
      setCelebrationTrigger(true);
      
      // Show celebration notification
      const message = getCelebrationMessage(progressStats.completed);
      addNotification({
        title: 'Task completed!',
        content: message,
        type: { style: 'success', icon: true }
      });
      
      // Reset celebration trigger
      setTimeout(() => setCelebrationTrigger(false), 100);
    }
    prevCompletedRef.current = progressStats.completed;
  }, [progressStats.completed]);



  const handleAddTask = (taskData: TaskFormData) => {
    addTask(taskData);
    addNotification({
      title: 'Success',
      content: 'Task created successfully!',
      type: { style: 'success', icon: true }
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    
    if (updates.status === 'Done') {
      // Celebration will be triggered by useEffect
    } else {
      addNotification({
        title: 'Updated',
        content: 'Task updated!',
        type: { style: 'info', icon: true }
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    addNotification({
      title: 'Deleted',
      content: 'Task deleted!',
      type: { style: 'warning', icon: true }
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      addNotification({
        title: 'Updated',
        content: 'Task modified successfully!',
        type: { style: 'success', icon: true }
      });
    } else {
      handleAddTask(taskData);
    }
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        progressStats={progressStats} 
        isDark={isDark} 
        onToggleDark={() => setIsDark(!isDark)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        smartNotificationCenter={null}
      />
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className={`mobile-overlay ${isMobileSidebarOpen ? 'active' : ''}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="main-content">
        <div className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <Sidebar 
            progressStats={progressStats}
            currentView={currentView}
            onViewChange={setCurrentView}
            onAddTask={() => {
              setIsFormOpen(true);
              setIsMobileSidebarOpen(false);
            }}
            currentFilter={currentFilter}
            onFilterChange={(filter) => {
              setCurrentFilter(filter);
              setIsMobileSidebarOpen(false);
            }}
            tasks={tasks}
          />
        </div>
        
        <div className="content-area">
          {currentView === 'grid' ? (
            <GridView 
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              viewTitle={filterTitle}
              viewDescription={filterDescription}
            />
          ) : (
            <KanbanView 
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              viewTitle={filterTitle}
              viewDescription={filterDescription}
            />
          )}
        </div>
      </div>

      <TaskForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingTask ? {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          deadline: editingTask.deadline
        } : undefined}
      />

      <NotificationGroup
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            closable={true}
            onClose={() => removeNotification(notification.id)}
          >
            <div>
              <strong>{notification.title}</strong>
              <div>{notification.content}</div>
            </div>
          </Notification>
        ))}
      </NotificationGroup>

      <Celebration trigger={celebrationTrigger} />
      
      <OnboardingStepper 
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          localStorage.setItem('onboardingCompleted', 'true');
        }}
        onCreateFirstTask={() => setIsFormOpen(true)}
      />
    </div>
  );
}

export default App;
