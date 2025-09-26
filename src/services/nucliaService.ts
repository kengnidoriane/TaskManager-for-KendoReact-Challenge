// Nuclia RAG Service for Smart Task Insights
export class NucliaService {
  private apiKey: string;
  private knowledgeBoxId: string;

  constructor() {
    // Demo credentials - replace with your Nuclia trial
    this.apiKey = import.meta.env?.VITE_NUCLIA_API_KEY || 'demo-key';
    this.knowledgeBoxId = import.meta.env?.VITE_NUCLIA_KB_ID || 'demo-kb';
  }

  // Analyze task patterns and generate smart insights
  async generateTaskInsights(tasks: any[]): Promise<string[]> {
    try {
      const taskData = this.formatTasksForAnalysis(tasks);
      
      // Mock Nuclia RAG response for demo
      const insights = [
        "🎯 You complete 73% more tasks on Tuesdays - consider scheduling important work then",
        "⚠️ High priority tasks are taking 2.3x longer than estimated - adjust your planning",
        "🔥 You're most productive between 9-11 AM - block this time for complex tasks",
        "📊 Your completion rate drops 40% when you have >5 tasks per day - consider task batching"
      ];

      return insights;
    } catch (error) {
      console.error('Nuclia service error:', error);
      return ['📈 Enable Nuclia integration for AI-powered productivity insights'];
    }
  }

  // Generate smart deadline suggestions
  async suggestOptimalDeadline(taskTitle: string, priority: string): Promise<string> {
    try {
      // Mock intelligent deadline suggestion
      const suggestions = {
        'High': '2-3 days based on your high-priority task patterns',
        'Medium': '5-7 days for optimal work-life balance',
        'Low': '1-2 weeks when you typically handle low-priority items'
      };

      return suggestions[priority as keyof typeof suggestions] || '3-5 days recommended';
    } catch (error) {
      return 'Standard timeline recommended';
    }
  }

  // Detect workload patterns
  async analyzeWorkloadRisk(tasks: any[]): Promise<{
    risk: 'low' | 'medium' | 'high';
    message: string;
    suggestions: string[];
  }> {
    const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Done');
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Done');
    
    if (overdueTasks.length > 3 || highPriorityTasks.length > 5) {
      return {
        risk: 'high',
        message: '🚨 High workload detected! Risk of burnout.',
        suggestions: [
          'Consider delegating 2-3 low priority tasks',
          'Extend deadlines for non-critical items',
          'Focus on completing overdue tasks first'
        ]
      };
    }

    if (overdueTasks.length > 1 || highPriorityTasks.length > 3) {
      return {
        risk: 'medium',
        message: '⚠️ Moderate workload - monitor closely',
        suggestions: [
          'Prioritize high-impact tasks',
          'Consider time-blocking for focus'
        ]
      };
    }

    return {
      risk: 'low',
      message: '✅ Workload is manageable',
      suggestions: ['Great job maintaining balance!']
    };
  }

  private formatTasksForAnalysis(tasks: any[]): string {
    return tasks.map(task => 
      `Task: ${task.title}, Priority: ${task.priority}, Status: ${task.status}, Created: ${task.createdAt}`
    ).join('\n');
  }
}