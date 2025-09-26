import React, { useState } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { DateInput } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ListBox, ListBoxToolbar } from '@progress/kendo-react-listbox';
import { Button } from '@progress/kendo-react-buttons';

interface OptimizedKendoComponentsProps {
  onTaskCreate?: (task: any) => void;
  onFilterChange?: (filter: any) => void;
}

export const OptimizedKendoComponents: React.FC<OptimizedKendoComponentsProps> = ({
  onTaskCreate,
  onFilterChange
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedPriority, setSelectedPriority] = useState<string>('Medium');
  const [taskTemplates, setTaskTemplates] = useState([
    'Daily Standup Meeting',
    'Code Review Session',
    'Client Presentation',
    'Team Planning',
    'Bug Fix Task'
  ]);

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const categories = ['Development', 'Meeting', 'Review', 'Planning', 'Bug Fix'];

  const handleCreateTask = () => {
    const newTask = {
      title: 'New Task',
      deadline: selectedDate,
      priority: selectedPriority,
      category: 'Development',
      status: 'To Do'
    };
    
    onTaskCreate?.(newTask);
    setShowDialog(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Enhanced Task Creation Dialog */}
      <Button 
        themeColor="primary" 
        onClick={() => setShowDialog(true)}
        style={{ marginBottom: '1rem' }}
      >
        Create Task with Enhanced Dialog
      </Button>

      {showDialog && (
        <Dialog 
          title="Create New Task"
          onClose={() => setShowDialog(false)}
          width={500}
          height={400}
        >
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Date Input for Deadline */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Deadline
              </label>
              <DateInput
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                format="dd/MM/yyyy"
                placeholder="Select deadline"
              />
            </div>

            {/* Priority Dropdown */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Priority
              </label>
              <DropDownList
                data={priorities}
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Category
              </label>
              <DropDownList
                data={categories}
                defaultValue="Development"
                onChange={(e) => onFilterChange?.({ category: e.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <DialogActionsBar>
            <Button onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button themeColor="primary" onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Layout Splitter for Resizable Panels */}
      <div style={{ height: '400px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
        <Splitter
          style={{ height: '100%' }}
          panes={[
            { size: '30%', min: '200px', resizable: true },
            { min: '300px', resizable: true }
          ]}
        >
          <SplitterPane>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                Task Templates
              </h3>
              
              {/* ListBox for Task Templates */}
              <ListBox
                data={taskTemplates}
                style={{ height: '250px' }}
                toolbar={
                  <ListBoxToolbar>
                    <Button onClick={() => setTaskTemplates([...taskTemplates, `Template ${taskTemplates.length + 1}`])}>
                      Add Template
                    </Button>
                  </ListBoxToolbar>
                }
              />
            </div>
          </SplitterPane>
          
          <SplitterPane>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                Task Preview
              </h3>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '6px',
                height: '200px'
              }}>
                <p>Selected template will appear here with preview</p>
                <p><strong>Deadline:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Priority:</strong> {selectedPriority}</p>
              </div>
            </div>
          </SplitterPane>
        </Splitter>
      </div>

      {/* Quick Filters with Dropdowns */}
      <div style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '6px'
      }}>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          Quick Filters:
        </span>
        
        <DropDownList
          data={priorities}
          defaultValue="All Priorities"
          onChange={(e) => onFilterChange?.({ priority: e.value })}
          style={{ width: '150px' }}
        />
        
        <DropDownList
          data={categories}
          defaultValue="All Categories"
          onChange={(e) => onFilterChange?.({ category: e.value })}
          style={{ width: '150px' }}
        />
        
        <DateInput
          placeholder="Filter by date"
          onChange={(e) => onFilterChange?.({ date: e.value })}
          format="dd/MM/yyyy"
        />
      </div>
    </div>
  );
};