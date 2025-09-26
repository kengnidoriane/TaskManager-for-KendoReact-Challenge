import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Animation } from '@progress/kendo-react-animation';
import { RefreshCw, Brain, Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'InProgress' | 'Done';
  deadline: Date;
}

interface AIMotivationalQuotesProps {
  tasks: Task[];
  progressStats: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export const AIMotivationalQuotes: React.FC<AIMotivationalQuotesProps> = ({
  tasks,
  progressStats
}) => {
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuote, setShowQuote] = useState(true);

  // Analyse du contexte utilisateur pour l'IA
  const getUserContext = () => {
    const overdueTasks = tasks.filter(task => 
      new Date(task.deadline) < new Date() && task.status !== 'Done'
    ).length;
    
    const highPriorityTasks = tasks.filter(task => 
      task.priority === 'High' && task.status !== 'Done'
    ).length;
    
    const completionRate = progressStats.percentage;
    
    return {
      totalTasks: progressStats.total,
      completedTasks: progressStats.completed,
      overdueTasks,
      highPriorityTasks,
      completionRate,
      mood: completionRate > 80 ? 'excellent' : 
            completionRate > 60 ? 'good' : 
            completionRate > 30 ? 'moderate' : 'needs_motivation'
    };
  };

  // Génération de quote contextuelle avec Nuclia AI
  const generateAIQuote = async () => {
    setIsLoading(true);
    const context = getUserContext();
    
    try {
      // Simulation d'appel Nuclia AI (remplacez par votre vraie API)
      const prompt = `Generate a motivational quote for a task manager user with this context:
      - Total tasks: ${context.totalTasks}
      - Completed: ${context.completedTasks} (${context.completionRate}%)
      - Overdue tasks: ${context.overdueTasks}
      - High priority tasks: ${context.highPriorityTasks}
      - Current mood: ${context.mood}
      
      Make it personal, encouraging, and actionable. Keep it under 50 words.`;

      // Simulation de réponse AI (remplacez par votre appel Nuclia)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiQuotes = {
        excellent: [
          "🌟 You're crushing it! Your 80%+ completion rate shows real dedication. Keep this momentum going!",
          "🚀 Outstanding progress! You've mastered the art of getting things done. What's your next big goal?",
          "💪 Your productivity is inspiring! With this completion rate, you're setting yourself up for success."
        ],
        good: [
          "📈 Great progress at 60%+! You're building solid habits. Push through those remaining tasks!",
          "⭐ You're doing well! Your consistent effort is paying off. Time to tackle those high-priority items.",
          "🎯 Good momentum! You're more than halfway there. Focus on what matters most today."
        ],
        moderate: [
          "🌱 Every step counts! You're at 30%+ - that's progress. Break big tasks into smaller wins.",
          "💡 You've got this! Focus on one task at a time. Small consistent actions lead to big results.",
          "🔥 Time to ignite your productivity! Pick your most important task and dive in."
        ],
        needs_motivation: [
          "🌅 Fresh start, fresh energy! Every expert was once a beginner. Your first completed task is waiting.",
          "💎 Diamonds are formed under pressure. Start with just one small task and build momentum.",
          "🚀 The journey of a thousand miles begins with one step. What's your first task today?"
        ]
      };

      const moodQuotes = aiQuotes[context.mood];
      const selectedQuote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
      
      setQuote(selectedQuote);
      
    } catch (error) {
      console.error('AI Quote generation failed:', error);
      // Fallback quote
      setQuote("💪 Success is not final, failure is not fatal: it is the courage to continue that counts!");
    } finally {
      setIsLoading(false);
    }
  };

  // Génération initiale
  useEffect(() => {
    generateAIQuote();
  }, [progressStats.percentage]); // Régénère quand le progrès change

  const refreshQuote = () => {
    setShowQuote(false);
    setTimeout(() => {
      generateAIQuote();
      setShowQuote(true);
    }, 300);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', opacity: 0.9 }}>
              AI Motivation
            </span>
          </div>
          
          <Tooltip anchorElement="target" position="bottom">
            <Button
              size="small"
              fillMode="flat"
              onClick={refreshQuote}
              disabled={isLoading}
              title="Generate new AI quote based on your progress"
              style={{ 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                minWidth: '36px',
                height: '36px'
              }}
            >
              {isLoading ? (
                <Loader size="small" />
              ) : (
                <RefreshCw size={14} />
              )}
            </Button>
          </Tooltip>
        </div>

        {/* Quote Content */}
        <Animation
          type="fade"
          show={showQuote && !isLoading}
          duration={300}
        >
          <div style={{
            fontSize: '0.95rem',
            lineHeight: '1.5',
            fontStyle: 'italic',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {quote || "Generating personalized motivation..."}
          </div>
        </Animation>

        {/* Loading State */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            opacity: 0.8
          }}>
            <Loader size="small" />
            <span>AI is crafting your personalized motivation...</span>
            <Sparkles size={16} />
          </div>
        )}

        {/* Context Indicator */}
        <div style={{
          marginTop: '1rem',
          fontSize: '0.75rem',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={12} />
          <span>
            Personalized for your {progressStats.percentage}% completion rate
          </span>
        </div>
      </div>
    </div>
  );
};