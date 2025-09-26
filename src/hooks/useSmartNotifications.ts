import { useState, useEffect } from 'react';
import { NucliaService } from '../services/nucliaService';

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

interface SmartNotification {
  id: string;
  type: 'deadline' | 'overdue' | 'workload' | 'insight' | 'celebration';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actions?: { label: string; action: () => void }[];
}

export const useSmartNotifications = (tasks: Task[]) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [nucliaService] = useState(() => {
    try {
      return new NucliaService();
    } catch (error) {
      console.warn('Nuclia service initialization failed:', error);
      return null;
    }
  });

  useEffect(() => {
    const checkSmartNotifications = async () => {
      const newNotifications: SmartNotification[] = [];

      // 1. Deadline reminders (48h before for better visibility)
      const upcomingTasks = tasks.filter(task => {
        const timeUntilDeadline = new Date(task.deadline).getTime() - new Date().getTime();
        const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);
        return hoursUntilDeadline > 0 && hoursUntilDeadline <= 48 && task.status !== 'Done';
      });

      upcomingTasks.forEach(task => {
        const hoursUntil = Math.round((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60));
        newNotifications.push({
          id: `deadline-${task.id}`,
          type: 'deadline',
          title: '⏰ Deadline Reminder',
          message: `"${task.title}" is due in ${hoursUntil} hours!`,
          priority: task.priority === 'High' ? 'high' : 'medium',
          timestamp: new Date()
        });
      });

      // 2. Overdue tasks
      const overdueTasks = tasks.filter(task => 
        new Date(task.deadline) < new Date() && task.status !== 'Done'
      );

      if (overdueTasks.length > 0) {
        newNotifications.push({
          id: 'overdue-alert',
          type: 'overdue',
          title: '🚨 Overdue Tasks',
          message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Click to reschedule.`,
          priority: 'high',
          timestamp: new Date()
        });
      }

      // 3. Workload analysis (always show if there are tasks)
      if (tasks.length > 0) {
        try {
          const workloadAnalysis = nucliaService ? 
            await nucliaService.analyzeWorkloadRisk(tasks) : 
            { risk: 'low' as const, message: '✅ Workload manageable', suggestions: ['Keep up the good work!'] };
          
          if (workloadAnalysis.risk !== 'low' || tasks.length >= 3) {
            newNotifications.push({
              id: 'workload-analysis',
              type: 'workload',
              title: workloadAnalysis.message,
              message: workloadAnalysis.suggestions.join(' • '),
              priority: workloadAnalysis.risk === 'high' ? 'high' : 'medium',
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.error('Workload analysis failed:', error);
        }
      }

      // 4. Daily productivity insights (reduced threshold)
      if (tasks.length >= 2) {
        try {
          const insights = nucliaService ? 
            await nucliaService.generateTaskInsights(tasks) : 
            ['📊 You have ' + tasks.length + ' tasks. Consider prioritizing by deadline and importance.'];
          
          if (insights.length > 0) {
            newNotifications.push({
              id: 'daily-insight',
              type: 'insight',
              title: '🧠 AI Productivity Insight',
              message: insights[Math.floor(Math.random() * insights.length)],
              priority: 'low',
              timestamp: new Date()
            });
          }
        } catch (error) {
          console.error('Insight generation failed:', error);
        }
      }

      // 5. Celebration notifications (reduced threshold)
      const completedToday = tasks.filter(task => {
        const today = new Date();
        const taskDate = new Date(task.updatedAt);
        return task.status === 'Done' && 
               taskDate.toDateString() === today.toDateString();
      });

      if (completedToday.length >= 1) {
        newNotifications.push({
          id: 'daily-celebration',
          type: 'celebration',
          title: '🎉 Great Progress!',
          message: `Excellent! You've completed ${completedToday.length} task${completedToday.length > 1 ? 's' : ''} today. Keep it up!`,
          priority: 'low',
          timestamp: new Date()
        });
      }

      // 6. Welcome notification for new users
      if (tasks.length === 0) {
        newNotifications.push({
          id: 'welcome-notification',
          type: 'insight',
          title: '👋 Welcome to SmartTask Manager!',
          message: 'Start by creating your first task. I\'ll provide AI-powered insights to boost your productivity.',
          priority: 'low',
          timestamp: new Date()
        });
      }

      // Update notifications (avoid duplicates)
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew];
      });
    };

    // Check every 30 minutes
    const interval = setInterval(checkSmartNotifications, 30 * 60 * 1000);
    
    // Initial check
    checkSmartNotifications();

    return () => clearInterval(interval);
  }, [tasks, nucliaService]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Function to add test notifications for demonstration
  const addTestNotifications = () => {
    const testNotifications: SmartNotification[] = [
      {
        id: 'test-deadline',
        type: 'deadline',
        title: '⏰ Test Deadline Reminder',
        message: 'This is a test notification for upcoming deadlines',
        priority: 'high',
        timestamp: new Date()
      },
      {
        id: 'test-insight',
        type: 'insight',
        title: '🧠 Test AI Insight',
        message: 'This is a test productivity insight from the AI system',
        priority: 'low',
        timestamp: new Date()
      },
      {
        id: 'test-celebration',
        type: 'celebration',
        title: '🎉 Test Celebration',
        message: 'This is a test celebration notification!',
        priority: 'low',
        timestamp: new Date()
      }
    ];
    
    setNotifications(prev => [...prev, ...testNotifications]);
  };

  return {
    notifications,
    dismissNotification,
    clearAllNotifications,
    addTestNotifications,
    hasHighPriorityNotifications: notifications.some(n => n.priority === 'high')
  };
};