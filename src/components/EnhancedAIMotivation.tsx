import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Animation } from '@progress/kendo-react-animation';
import { Popup } from '@progress/kendo-react-popup';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { RefreshCw, Brain, Sparkles, TrendingUp, Clock, Palette } from 'lucide-react';
import { EnhancedNucliaService } from '../services/enhancedNucliaService';

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

interface EnhancedAIMotivationProps {
  tasks: Task[];
  progressStats: {
    total: number;
    completed: number;
    percentage: number;
  };
  onThemeChange?: (theme: any) => void;
}

export const EnhancedAIMotivation: React.FC<EnhancedAIMotivationProps> = ({
  tasks,
  progressStats,
  onThemeChange
}) => {
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [suggestedTheme, setSuggestedTheme] = useState<any>(null);
  const [nucliaService] = useState(() => new EnhancedNucliaService());

  // Contexte utilisateur enrichi
  const getUserContext = () => {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      new Date(task.deadline) < now && task.status !== 'Done'
    ).length;
    
    const highPriorityTasks = tasks.filter(task => 
      task.priority === 'High' && task.status !== 'Done'
    ).length;
    
    const recentActivity = tasks
      .filter(task => task.status === 'Done')
      .slice(-3)
      .map(task => task.title);

    const timeOfDay = now.getHours() < 12 ? 'morning' : 
                     now.getHours() < 17 ? 'afternoon' : 'evening';
    
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    return {
      totalTasks: progressStats.total,
      completedTasks: progressStats.completed,
      overdueTasks,
      highPriorityTasks,
      completionRate: progressStats.percentage,
      timeOfDay,
      dayOfWeek,
      recentActivity
    };
  };

  // Génération de citation avec Nuclia AI amélioré
  const generateEnhancedQuote = async () => {
    setIsLoading(true);
    const context = getUserContext();
    
    try {
      const aiQuote = await nucliaService.generateContextualQuote(context);
      setQuote(aiQuote);
      
      // Générer aussi des insights de productivité
      const productivityInsights = await nucliaService.analyzeProductivityPatterns(tasks);
      setInsights(productivityInsights);
      
      // Suggérer un thème basé sur la productivité
      const themeData = await nucliaService.suggestThemeBasedOnProductivity(
        progressStats.percentage, 
        context.timeOfDay
      );
      setSuggestedTheme(themeData);
      
    } catch (error) {
      console.error('Enhanced AI generation failed:', error);
      setQuote("💪 Your potential is unlimited. Every task completed is a step toward your goals!");
    } finally {
      setIsLoading(false);
    }
  };

  // Génération initiale et régénération intelligente
  useEffect(() => {
    generateEnhancedQuote();
  }, [progressStats.percentage]); // Régénère quand le progrès change significativement

  const refreshQuote = () => {
    setShowQuote(false);
    setTimeout(() => {
      generateEnhancedQuote();
      setShowQuote(true);
    }, 300);
  };

  const applyTheme = () => {
    if (suggestedTheme && onThemeChange) {
      onThemeChange(suggestedTheme);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Main Motivation Card */}
      <Card style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardBody style={{ padding: '1.5rem' }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(40px, -40px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header with Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={20} />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', opacity: 0.9 }}>
                  AI-Powered Motivation
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {/* Insights Toggle */}
                <Tooltip anchorElement="target" position="bottom">
                  <Button
                    size="small"
                    fillMode="flat"
                    onClick={() => setShowInsights(!showInsights)}
                    title="View productivity insights"
                    style={{ 
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      minWidth: '36px',
                      height: '36px'
                    }}
                  >
                    <TrendingUp size={14} />
                  </Button>
                </Tooltip>

                {/* Theme Suggestion */}
                {suggestedTheme && (
                  <Tooltip anchorElement="target" position="bottom">
                    <Button
                      size="small"
                      fillMode="flat"
                      onClick={applyTheme}
                      title={`Apply ${suggestedTheme.theme} theme: ${suggestedTheme.reasoning}`}
                      style={{ 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        minWidth: '36px',
                        height: '36px'
                      }}
                    >
                      <Palette size={14} />
                    </Button>
                  </Tooltip>
                )}
                
                {/* Refresh Quote */}
                <Tooltip anchorElement="target" position="bottom">
                  <Button
                    size="small"
                    fillMode="flat"
                    onClick={refreshQuote}
                    disabled={isLoading}
                    title="Generate new AI-powered motivation"
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
            </div>

            {/* Quote Content */}
            <Animation
              type="fade"
              show={showQuote && !isLoading}
              duration={300}
            >
              <div style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                fontStyle: 'italic',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
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
                opacity: 0.8,
                marginBottom: '1rem'
              }}>
                <Loader size="small" />
                <span>Nuclia AI is analyzing your productivity patterns...</span>
                <Sparkles size={16} />
              </div>
            )}

            {/* Context Indicator */}
            <div style={{
              fontSize: '0.75rem',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Sparkles size={12} />
              <span>
                Personalized for {progressStats.percentage}% completion • {getUserContext().timeOfDay} productivity
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Insights Popup */}
      <Popup
        show={showInsights}
        onClose={() => setShowInsights(false)}
        popupClass="insights-popup"
        anchor="parent"
        collision={{ horizontal: 'fit', vertical: 'flip' }}
      >
        {insights && (
          <Card style={{ 
            width: '400px', 
            maxHeight: '500px', 
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <CardBody style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'var(--primary-color)'
              }}>
                <TrendingUp size={20} />
                Productivity Insights
              </h3>
              
              {/* AI Insights */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  📊 AI Analysis
                </h4>
                {insights.insights.map((insight: string, index: number) => (
                  <div key={index} style={{ 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {insight}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  💡 Smart Recommendations
                </h4>
                {insights.recommendations.map((rec: string, index: number) => (
                  <div key={index} style={{ 
                    fontSize: '0.8rem', 
                    marginBottom: '0.25rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {rec}
                  </div>
                ))}
              </div>

              {/* Optimal Time */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  <Clock size={14} style={{ marginRight: '0.25rem' }} />
                  Optimal Work Time
                </h4>
                <div style={{ 
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.5rem',
                  borderRadius: '6px'
                }}>
                  {insights.predictedOptimalTime}
                </div>
              </div>

              {/* Burnout Risk */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  🔥 Burnout Risk: {insights.burnoutRisk}%
                </h4>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${insights.burnoutRisk}%`,
                    height: '100%',
                    backgroundColor: insights.burnoutRisk > 70 ? '#ef4444' : 
                                   insights.burnoutRisk > 40 ? '#f59e0b' : '#10b981',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </Popup>
    </div>
  );
};