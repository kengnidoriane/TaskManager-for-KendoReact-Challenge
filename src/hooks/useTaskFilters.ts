import { useMemo } from 'react';
import { isToday, endOfDay } from 'date-fns';
import { Task, FilterType } from '../types';

export const useTaskFilters = (tasks: Task[], currentFilter: FilterType | string) => {
  const filteredTasks = useMemo(() => {
    switch (currentFilter) {
      case 'inbox':
        // Toutes les tâches non terminées
        return tasks.filter(task => task.status !== 'Done');
        
      case 'today':
        // Tâches dues aujourd'hui
        return tasks.filter(task => 
          task.status !== 'Done' && isToday(task.deadline)
        );
        
      case 'upcoming':
        // Tâches des 7 prochains jours (excluant aujourd'hui)
        return tasks.filter(task => {
          if (task.status === 'Done') return false;
          const deadline = task.deadline;
          const now = new Date();
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          return deadline > endOfDay(now) && deadline <= endOfDay(weekFromNow);
        });
        
      case 'completed':
        // Tâches terminées
        return tasks.filter(task => task.status === 'Done');
        
      default:
        return tasks;
    }
  }, [tasks, currentFilter]);

  const getFilterStats = useMemo(() => {
    const todayTasks = tasks.filter(task => 
      task.status !== 'Done' && isToday(task.deadline)
    ).length;
    
    const upcomingTasks = tasks.filter(task => {
      if (task.status === 'Done') return false;
      const deadline = task.deadline;
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return deadline > endOfDay(now) && deadline <= endOfDay(weekFromNow);
    }).length;
    
    const inboxTasks = tasks.filter(task => task.status !== 'Done').length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    
    return {
      inbox: inboxTasks,
      today: todayTasks,
      upcoming: upcomingTasks,
      completed: completedTasks
    };
  }, [tasks]);

  const getFilterTitle = (filter: string) => {
    switch (filter) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'All Tasks';
    }
  };

  const getFilterDescription = (filter: string) => {
    switch (filter) {
      case 'inbox': return 'All your tasks in one place';
      case 'today': return 'Tasks due today';
      case 'upcoming': return 'Tasks due in the next 7 days';
      case 'completed': return 'All completed tasks';
      default: return 'All tasks';
    }
  };

  return {
    filteredTasks,
    filterStats: getFilterStats,
    filterTitle: getFilterTitle(currentFilter),
    filterDescription: getFilterDescription(currentFilter)
  };
};