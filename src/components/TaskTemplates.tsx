import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { ListBox } from '@progress/kendo-react-listbox';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Template, Plus, Save, Trash2 } from 'lucide-react';

interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedDuration: number; // in hours
  category: string;
}

interface TaskTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TaskTemplate) => void;
}

const defaultTemplates: TaskTemplate[] = [
  {
    id: '1',
    name: '📧 Email Campaign',
    title: 'Create email marketing campaign',
    description: 'Design and schedule email campaign for product launch',
    priority: 'High',
    estimatedDuration: 4,
    category: 'Marketing'
  },
  {
    id: '2',
    name: '🐛 Bug Fix',
    title: 'Fix critical bug',
    description: 'Investigate and resolve reported bug in production',
    priority: 'High',
    estimatedDuration: 2,
    category: 'Development'
  },
  {
    id: '3',
    name: '📊 Weekly Report',
    title: 'Prepare weekly status report',
    description: 'Compile team progress and metrics for weekly stakeholder meeting',
    priority: 'Medium',
    estimatedDuration: 1,
    category: 'Management'
  },
  {
    id: '4',
    name: '🎨 Design Review',
    title: 'Review design mockups',
    description: 'Review and provide feedback on new feature designs',
    priority: 'Medium',
    estimatedDuration: 2,
    category: 'Design'
  },
  {
    id: '5',
    name: '📞 Client Call',
    title: 'Client check-in call',
    description: 'Scheduled call to discuss project progress and next steps',
    priority: 'High',
    estimatedDuration: 1,
    category: 'Client Relations'
  }
];

export const TaskTemplates: React.FC<TaskTemplatesProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [templates, setTemplates] = useState<TaskTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<TaskTemplate>>({
    name: '',
    title: '',
    description: '',
    priority: 'Medium',
    estimatedDuration: 1,
    category: ''
  });

  const categories = ['Development', 'Design', 'Marketing', 'Management', 'Client Relations', 'Research', 'Testing'];
  const priorityOptions = [
    { text: 'High', value: 'High' },
    { text: 'Medium', value: 'Medium' },
    { text: 'Low', value: 'Low' }
  ];

  const handleSelectTemplate = (template: TaskTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.title) {
      const template: TaskTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name!,
        title: newTemplate.title!,
        description: newTemplate.description || '',
        priority: newTemplate.priority as 'High' | 'Medium' | 'Low',
        estimatedDuration: newTemplate.estimatedDuration || 1,
        category: newTemplate.category || 'General'
      };
      
      setTemplates([...templates, template]);
      setNewTemplate({
        name: '',
        title: '',
        description: '',
        priority: 'Medium',
        estimatedDuration: 1,
        category: ''
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      title="Task Templates"
      onClose={onClose}
      visible={true}
      width={800}
      height={600}
    >
      <div style={{ padding: '1rem', height: '500px', display: 'flex', gap: '1rem' }}>
        {/* Templates List */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Template size={18} />
              Available Templates
            </h4>
            <Button
              size="small"
              themeColor="primary"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={14} style={{ marginRight: '0.25rem' }} />
              New
            </Button>
          </div>

          <ListBox
            data={templates}
            textField="name"
            style={{ height: '400px', width: '100%' }}
            itemRender={(li, itemProps) => (
              <li {...itemProps} style={{ 
                padding: '0.75rem',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {itemProps.dataItem.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      {itemProps.dataItem.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                      <span style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        padding: '0.125rem 0.375rem', 
                        borderRadius: '4px' 
                      }}>
                        {itemProps.dataItem.category}
                      </span>
                      <span style={{ 
                        backgroundColor: 'var(--primary-color)', 
                        color: 'white',
                        padding: '0.125rem 0.375rem', 
                        borderRadius: '4px' 
                      }}>
                        {itemProps.dataItem.estimatedDuration}h
                      </span>
                    </div>
                  </div>
                  <Button
                    size="small"
                    fillMode="flat"
                    themeColor="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(itemProps.dataItem.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </li>
            )}
            onChange={(e) => setSelectedTemplate(e.value)}
          />
        </div>

        {/* Template Details or Create Form */}
        <div style={{ flex: 1 }}>
          {showCreateForm ? (
            <div>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                Create New Template
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Template Name"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.value || ''})}
                  placeholder="e.g., 📧 Email Campaign"
                />
                
                <Input
                  label="Task Title"
                  value={newTemplate.title || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.value || ''})}
                  placeholder="Default task title"
                />
                
                <TextArea
                  label="Description"
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.value || ''})}
                  placeholder="Default task description"
                  rows={3}
                />
                
                <DropDownList
                  label="Priority"
                  data={priorityOptions}
                  textField="text"
                  dataItemKey="value"
                  value={priorityOptions.find(p => p.value === newTemplate.priority)}
                  onChange={(e) => setNewTemplate({...newTemplate, priority: e.target.value.value})}
                />
                
                <Input
                  label="Estimated Duration (hours)"
                  type="number"
                  value={newTemplate.estimatedDuration?.toString() || '1'}
                  onChange={(e) => setNewTemplate({...newTemplate, estimatedDuration: parseInt(e.value || '1')})}
                />
                
                <DropDownList
                  label="Category"
                  data={categories}
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Button
                    themeColor="primary"
                    onClick={handleCreateTemplate}
                    disabled={!newTemplate.name || !newTemplate.title}
                  >
                    <Save size={14} style={{ marginRight: '0.25rem' }} />
                    Save Template
                  </Button>
                  <Button
                    fillMode="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedTemplate ? (
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Template Preview</h4>
              
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1rem', 
                borderRadius: 'var(--border-radius)',
                marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {selectedTemplate.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {selectedTemplate.description}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    color: 'white',
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px' 
                  }}>
                    {selectedTemplate.priority} Priority
                  </span>
                  <span style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {selectedTemplate.category}
                  </span>
                  <span style={{ 
                    backgroundColor: 'var(--success-color)', 
                    color: 'white',
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px' 
                  }}>
                    ~{selectedTemplate.estimatedDuration}h
                  </span>
                </div>
              </div>
              
              <Button
                themeColor="primary"
                onClick={() => handleSelectTemplate(selectedTemplate)}
                style={{ width: '100%' }}
              >
                Use This Template
              </Button>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              <div>
                <Template size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>Select a template to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <DialogActionsBar>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
};