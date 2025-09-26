// Advanced Nuclia RAG Integration - Real Implementation Strategy
export class NucliaAdvancedService {
  private apiKey: string;
  private knowledgeBoxId: string;
  private baseUrl = 'https://nuclia.cloud/api/v1';

  constructor() {
    this.apiKey = import.meta.env?.VITE_NUCLIA_API_KEY || '';
    this.knowledgeBoxId = import.meta.env?.VITE_NUCLIA_KB_ID || '';
  }

  // 1. AGRÉGATION INTELLIGENTE DES DONNÉES
  private aggregateTaskData(tasks: any[]) {
    return {
      // Métriques temporelles
      temporal: {
        completionsByDay: this.getCompletionsByDay(tasks),
        averageCompletionTime: this.getAverageCompletionTime(tasks),
        deadlineAccuracy: this.getDeadlineAccuracy(tasks)
      },
      
      // Patterns de priorité
      priority: {
        highPriorityAvgTime: this.getAvgTimeByPriority(tasks, 'High'),
        priorityDistribution: this.getPriorityDistribution(tasks),
        prioritySuccessRate: this.getPrioritySuccessRate(tasks)
      },
      
      // Patterns de charge de travail
      workload: {
        tasksPerDay: this.getTasksPerDay(tasks),
        overloadThreshold: this.detectOverloadPattern(tasks),
        productivityCycles: this.getProductivityCycles(tasks)
      },
      
      // Contexte sémantique
      semantic: {
        taskCategories: this.categorizeTasksByContent(tasks),
        complexityPatterns: this.analyzeTaskComplexity(tasks),
        userBehaviorProfile: this.buildUserProfile(tasks)
      }
    };
  }

  // 2. REQUÊTE RAG INTELLIGENTE
  async queryNucliaRAG(aggregatedData: any, queryType: string): Promise<string[]> {
    try {
      // Construction du prompt contextuel pour Nuclia
      const contextualPrompt = this.buildContextualPrompt(aggregatedData, queryType);
      
      // Vraie requête Nuclia (remplacer par l'API réelle)
      const response = await fetch(`${this.baseUrl}/kb/${this.knowledgeBoxId}/ask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: contextualPrompt,
          features: ['semantic', 'keyword'],
          max_tokens: 200,
          show_relations: true
        })
      });

      if (!response.ok) {
        throw new Error('Nuclia API error');
      }

      const data = await response.json();
      return this.parseNucliaResponse(data, queryType);
      
    } catch (error) {
      console.error('Nuclia RAG query failed:', error);
      return this.getFallbackInsights(aggregatedData, queryType);
    }
  }

  // 3. CONSTRUCTION DE PROMPTS CONTEXTUELS
  private buildContextualPrompt(data: any, queryType: string): string {
    const baseContext = `
User Task Management Profile:
- Completion Rate: ${data.temporal.deadlineAccuracy}%
- Average Task Duration: ${data.temporal.averageCompletionTime} days
- High Priority Success Rate: ${data.priority.prioritySuccessRate}%
- Daily Task Load: ${data.workload.tasksPerDay} tasks/day
- Productivity Peak: ${data.workload.productivityCycles.peak}
- Task Categories: ${data.semantic.taskCategories.join(', ')}
`;

    const queryPrompts = {
      productivity: `${baseContext}
Based on this user's task management patterns, provide 3 specific productivity insights that would help them optimize their workflow. Focus on actionable recommendations.`,
      
      workload: `${baseContext}
Analyze this user's workload patterns and provide risk assessment with specific suggestions for workload management.`,
      
      deadline: `${baseContext}
Given this user's historical performance with ${data.priority.highPriorityAvgTime} days average for high-priority tasks, suggest optimal deadline for a new task.`
    };

    return queryPrompts[queryType as keyof typeof queryPrompts] || queryPrompts.productivity;
  }

  // 4. ANALYSE COMPORTEMENTALE AVANCÉE
  private getCompletionsByDay(tasks: any[]): Record<string, number> {
    const completions: Record<string, number> = {};
    tasks.filter(t => t.status === 'Done').forEach(task => {
      const day = new Date(task.updatedAt).toLocaleDateString('en', { weekday: 'long' });
      completions[day] = (completions[day] || 0) + 1;
    });
    return completions;
  }

  private getAverageCompletionTime(tasks: any[]): number {
    const completedTasks = tasks.filter(t => t.status === 'Done');
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, task) => {
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.updatedAt).getTime();
      return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
    }, 0);
    
    return Math.round(totalTime / completedTasks.length * 10) / 10;
  }

  private detectOverloadPattern(tasks: any[]): { threshold: number; riskFactors: string[] } {
    const dailyLoads = this.getDailyTaskLoads(tasks);
    const avgLoad = dailyLoads.reduce((a, b) => a + b, 0) / dailyLoads.length;
    
    return {
      threshold: Math.ceil(avgLoad * 1.5),
      riskFactors: [
        avgLoad > 5 ? 'High daily task volume' : '',
        this.getOverdueRate(tasks) > 0.2 ? 'Frequent deadline misses' : '',
        this.getHighPriorityRatio(tasks) > 0.4 ? 'Too many high-priority tasks' : ''
      ].filter(Boolean)
    };
  }

  // 5. INTELLIGENCE SÉMANTIQUE
  private categorizeTasksByContent(tasks: any[]): string[] {
    // Analyse sémantique simple basée sur les mots-clés
    const categories = new Set<string>();
    const keywords = {
      'Development': ['code', 'bug', 'feature', 'api', 'database', 'frontend', 'backend'],
      'Design': ['design', 'ui', 'ux', 'mockup', 'prototype', 'wireframe'],
      'Meeting': ['meeting', 'call', 'discussion', 'review', 'standup'],
      'Documentation': ['doc', 'documentation', 'readme', 'guide', 'manual'],
      'Testing': ['test', 'qa', 'bug', 'validation', 'verification']
    };

    tasks.forEach(task => {
      const text = `${task.title} ${task.description}`.toLowerCase();
      Object.entries(keywords).forEach(([category, words]) => {
        if (words.some(word => text.includes(word))) {
          categories.add(category);
        }
      });
    });

    return Array.from(categories);
  }

  // 6. FALLBACK INTELLIGENT (si Nuclia échoue)
  private getFallbackInsights(data: any, queryType: string): string[] {
    const insights = {
      productivity: [
        `🎯 Your best completion day is ${this.getBestDay(data.temporal.completionsByDay)} - schedule important tasks then`,
        `⏱️ Tasks typically take ${data.temporal.averageCompletionTime} days - adjust your planning accordingly`,
        `📊 Your deadline accuracy is ${data.temporal.deadlineAccuracy}% - ${data.temporal.deadlineAccuracy > 80 ? 'excellent!' : 'room for improvement'}`
      ],
      workload: [
        `⚠️ Your overload threshold is ${data.workload.overloadThreshold} tasks/day`,
        `🔄 Peak productivity: ${data.workload.productivityCycles.peak}`,
        ...data.workload.overloadThreshold > 5 ? ['Consider task batching strategies'] : []
      ]
    };

    return insights[queryType as keyof typeof insights] || insights.productivity;
  }

  // Méthodes utilitaires
  private getBestDay(completions: Record<string, number>): string {
    return Object.entries(completions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private getDailyTaskLoads(tasks: any[]): number[] {
    // Implémentation simplifiée
    return [3, 5, 4, 6, 3, 2, 1]; // Mock data
  }

  private getOverdueRate(tasks: any[]): number {
    const overdue = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Done');
    return tasks.length > 0 ? overdue.length / tasks.length : 0;
  }

  private getHighPriorityRatio(tasks: any[]): number {
    const highPriority = tasks.filter(t => t.priority === 'High');
    return tasks.length > 0 ? highPriority.length / tasks.length : 0;
  }

  private getAvgTimeByPriority(tasks: any[], priority: string): number {
    const priorityTasks = tasks.filter(t => t.priority === priority && t.status === 'Done');
    return this.getAverageCompletionTime(priorityTasks);
  }

  private getPriorityDistribution(tasks: any[]): Record<string, number> {
    const dist: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(task => dist[task.priority]++);
    return dist;
  }

  private getPrioritySuccessRate(tasks: any[]): number {
    const highPriority = tasks.filter(t => t.priority === 'High');
    const completed = highPriority.filter(t => t.status === 'Done');
    return highPriority.length > 0 ? Math.round(completed.length / highPriority.length * 100) : 0;
  }

  private getTasksPerDay(tasks: any[]): number {
    // Calcul basé sur les 7 derniers jours
    const recent = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return taskDate > weekAgo;
    });
    return Math.round(recent.length / 7 * 10) / 10;
  }

  private getProductivityCycles(tasks: any[]): { peak: string; low: string } {
    const hourly = this.getCompletionsByHour(tasks);
    const peak = Object.entries(hourly).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const low = Object.entries(hourly).reduce((a, b) => a[1] < b[1] ? a : b)[0];
    return { peak: `${peak}:00`, low: `${low}:00` };
  }

  private getCompletionsByHour(tasks: any[]): Record<string, number> {
    const hourly: Record<string, number> = {};
    tasks.filter(t => t.status === 'Done').forEach(task => {
      const hour = new Date(task.updatedAt).getHours().toString();
      hourly[hour] = (hourly[hour] || 0) + 1;
    });
    return hourly;
  }

  private analyzeTaskComplexity(tasks: any[]): string[] {
    // Analyse de complexité basée sur la longueur des descriptions
    const complex = tasks.filter(t => t.description.length > 100);
    const simple = tasks.filter(t => t.description.length < 50);
    
    return [
      `${Math.round(complex.length / tasks.length * 100)}% complex tasks`,
      `${Math.round(simple.length / tasks.length * 100)}% simple tasks`
    ];
  }

  private buildUserProfile(tasks: any[]): Record<string, any> {
    return {
      taskStyle: this.getAverageCompletionTime(tasks) > 3 ? 'thorough' : 'quick',
      priorityPreference: this.getHighPriorityRatio(tasks) > 0.3 ? 'high-pressure' : 'balanced',
      consistency: this.getOverdueRate(tasks) < 0.1 ? 'consistent' : 'variable'
    };
  }

  private parseNucliaResponse(data: any, queryType: string): string[] {
    // Parse la réponse Nuclia et extrait les insights
    try {
      return data.answer?.split('\n').filter((line: string) => line.trim()) || [];
    } catch {
      return ['Unable to parse Nuclia response'];
    }
  }

  private getDeadlineAccuracy(tasks: any[]): number {
    const completed = tasks.filter(t => t.status === 'Done');
    const onTime = completed.filter(t => new Date(t.updatedAt) <= new Date(t.deadline));
    return completed.length > 0 ? Math.round(onTime.length / completed.length * 100) : 0;
  }
}