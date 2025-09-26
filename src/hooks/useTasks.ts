import { useState, useEffect, useCallback } from 'react';
import { loadTasks, saveTasks, generateId } from '../utils/storage';
import type { Task, TaskFormData, ProgressStats } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  const addTask = useCallback((taskData: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      status: 'Todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const getProgressStats = useCallback((): ProgressStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Done').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [tasks]);

  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getProgressStats,
    getTasksByStatus
  };
};