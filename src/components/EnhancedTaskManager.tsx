import React, { useState } from 'react';
import { OptimizedKendoComponents } from './OptimizedKendoComponents';
import { EnhancedAIMotivation } from './EnhancedAIMotivation';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';

interface EnhancedTaskManagerProps {
  onTaskCreate?: (task: any) => void;
  onFilterChange?: (filter: any) => void;
}

export const EnhancedTaskManager: React.FC<EnhancedTaskManagerProps> = ({
  onTaskCreate,
  onFilterChange
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div style={{ padding: '1rem' }}>
      <TabStrip 
        selected={selectedTab} 
        onSelect={(e) => setSelectedTab(e.selected)}
        style={{ marginBottom: '1rem' }}
      >
        <TabStripTab title="Enhanced Components">
          <OptimizedKendoComponents 
            onTaskCreate={onTaskCreate}
            onFilterChange={onFilterChange}
          />
        </TabStripTab>
        
        <TabStripTab title="AI Motivation">
          <EnhancedAIMotivation />
        </TabStripTab>
        
        <TabStripTab title="Analytics Dashboard">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h3>📊 Analytics Dashboard</h3>
            <p>Ici vous pourrez ajouter des graphiques Kendo React Charts pour visualiser :</p>
            <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              <li>Productivité par jour/semaine</li>
              <li>Répartition des tâches par priorité</li>
              <li>Temps moyen de completion</li>
              <li>Tendances de performance</li>
            </ul>
          </div>
        </TabStripTab>
      </TabStrip>
    </div>
  );
};