import React, { useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { format, subDays, isAfter, isBefore, startOfWeek, endOfWeek } from 'date-fns';

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

interface AnalyticsDashboardProps {
  tasks: Task[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const lastWeekStart = startOfWeek(subDays(now, 7));
    const lastWeekEnd = endOfWeek(subDays(now, 7));

    // Basic stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'InProgress').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const overdueTasks = tasks.filter(t => t.deadline < now && t.status !== 'Done').length;

    // Weekly comparison
    const thisWeekCompleted = tasks.filter(t => 
      t.status === 'Done' && 
      isAfter(t.updatedAt, weekStart) && 
      isBefore(t.updatedAt, weekEnd)
    ).length;
    
    const lastWeekCompleted = tasks.filter(t => 
      t.status === 'Done' && 
      isAfter(t.updatedAt, lastWeekStart) && 
      isBefore(t.updatedAt, lastWeekEnd)
    ).length;

    const weeklyGrowth = lastWeekCompleted > 0 
      ? ((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100 
      : thisWeekCompleted > 0 ? 100 : 0;

    // Priority distribution
    const priorityStats = {
      High: tasks.filter(t => t.priority === 'High').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      Low: tasks.filter(t => t.priority === 'Low').length
    };

    // Daily completion trend (last 7 days)
    const dailyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const completed = tasks.filter(t => 
        t.status === 'Done' && 
        format(t.updatedAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length;
      
      return {
        date: format(date, 'MMM dd'),
        completed
      };
    });

    // Completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Average completion time (mock data for demo)
    const avgCompletionTime = 2.5; // days

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      thisWeekCompleted,
      lastWeekCompleted,
      weeklyGrowth,
      priorityStats,
      dailyTrend,
      completionRate,
      avgCompletionTime
    };
  }, [tasks]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    color?: string;
  }> = ({ title, value, icon, trend, color = 'var(--primary-color)' }) => (
    <Card style={{ height: '120px' }}>
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {title}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color }}>
              {value}
            </div>
            {trend !== undefined && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
                marginTop: '0.25rem'
              }}>
                {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(trend).toFixed(1)}% vs last week
              </div>
            )}
          </div>
          <div style={{ color, opacity: 0.7 }}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div style={{ 
      background: 'var(--bg-primary)', 
      borderRadius: 'var(--border-radius)', 
      padding: '1.5rem',
      boxShadow: 'var(--shadow)'
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: 'var(--text-primary)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📊 Analytics Dashboard
      </h2>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon={<Target size={24} />}
          color="var(--primary-color)"
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          icon={<CheckCircle size={24} />}
          trend={analytics.weeklyGrowth}
          color="var(--success-color)"
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgressTasks}
          icon={<Zap size={24} />}
          color="var(--warning-color)"
        />
        <StatCard
          title="Overdue"
          value={analytics.overdueTasks}
          icon={<AlertTriangle size={24} />}
          color="var(--danger-color)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Daily Completion Trend */}
        <Card>
          <CardBody>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              Daily Completion Trend
            </h4>
            <Chart style={{ height: '250px' }}>
              <ChartSeries>
                <ChartSeriesItem
                  type="line"
                  data={analytics.dailyTrend}
                  field="completed"
                  categoryField="date"
                  color="var(--primary-color)"
                  markers={{ visible: true }}
                />
              </ChartSeries>
            </Chart>
          </CardBody>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardBody>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} />
              Priority Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>🔴 High</span>
                  <span style={{ fontWeight: '600' }}>{analytics.priorityStats.High}</span>
                </div>
                <ProgressBar 
                  value={(analytics.priorityStats.High / analytics.totalTasks) * 100} 
                  style={{ height: '8px' }}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>🟡 Medium</span>
                  <span style={{ fontWeight: '600' }}>{analytics.priorityStats.Medium}</span>
                </div>
                <ProgressBar 
                  value={(analytics.priorityStats.Medium / analytics.totalTasks) * 100} 
                  style={{ height: '8px' }}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>🟢 Low</span>
                  <span style={{ fontWeight: '600' }}>{analytics.priorityStats.Low}</span>
                </div>
                <ProgressBar 
                  value={(analytics.priorityStats.Low / analytics.totalTasks) * 100} 
                  style={{ height: '8px' }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <Card>
          <CardBody>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} />
              Completion Rate
            </h4>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)', marginBottom: '0.5rem' }}>
                {analytics.completionRate.toFixed(1)}%
              </div>
              <ProgressBar 
                value={analytics.completionRate} 
                style={{ marginBottom: '0.5rem' }}
              />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {analytics.completedTasks} of {analytics.totalTasks} tasks completed
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} />
              Average Completion Time
            </h4>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                {analytics.avgCompletionTime}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                days per task
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--success-color)',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}>
                <TrendingUp size={12} />
                15% faster than last month
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} />
              This Week
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Completed</span>
                <span style={{ fontWeight: '600', color: 'var(--success-color)' }}>
                  {analytics.thisWeekCompleted}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last Week</span>
                <span style={{ fontWeight: '600' }}>
                  {analytics.lastWeekCompleted}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: analytics.weeklyGrowth >= 0 ? 'rgba(16, 124, 16, 0.1)' : 'rgba(209, 52, 56, 0.1)',
                borderRadius: '4px'
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Growth</span>
                <span style={{ 
                  fontWeight: '600',
                  color: analytics.weeklyGrowth >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {analytics.weeklyGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(analytics.weeklyGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};