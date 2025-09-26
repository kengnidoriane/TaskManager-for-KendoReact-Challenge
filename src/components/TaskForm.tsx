import React, { useState, useEffect } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: Date;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
}

const priorityOptions = [
  { text: 'High', value: 'High' },
  { text: 'Medium', value: 'Medium' },
  { text: 'Low', value: 'Low' }
];

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: new Date()
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'Medium',
        deadline: initialData?.deadline || new Date()
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Le formulaire sera réinitialisé par useEffect quand isOpen devient false
    }
  };

  const handleClose = () => {
    onClose();
    // Le formulaire sera réinitialisé par useEffect quand isOpen devient false
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog 
      title={initialData ? "Edit Task" : "Create New Task"} 
      onClose={handleClose}
      visible={true}
      width={520}
      style={{
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}
    >
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            fontSize: '0.875rem',
            color: 'var(--text-primary)'
          }}>
            Task Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.value || '' }))}
            placeholder="What needs to be done?"
            style={{ 
              width: '100%',
              height: '44px',
              fontSize: '0.875rem',
              border: errors.title ? '2px solid var(--danger-color)' : '1px solid var(--border-color)',
              borderRadius: '8px'
            }}
          />
          {errors.title && (
            <div style={{ 
              color: 'var(--danger-color)', 
              fontSize: '0.75rem', 
              marginTop: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              ⚠️ {errors.title}
            </div>
          )}
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            fontSize: '0.875rem',
            color: 'var(--text-primary)'
          }}>
            Description
          </label>
          <TextArea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.value || '' }))}
            placeholder="Add more details about this task..."
            rows={3}
            style={{ 
              width: '100%',
              fontSize: '0.875rem',
              border: errors.description ? '2px solid var(--danger-color)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              resize: 'vertical'
            }}
          />
          {errors.description && (
            <div style={{ 
              color: 'var(--danger-color)', 
              fontSize: '0.75rem', 
              marginTop: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              ⚠️ {errors.description}
            </div>
          )}
        </div>

        {/* Priority and Deadline Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: 'var(--text-primary)'
            }}>
              Priority
            </label>
            <DropDownList
              data={priorityOptions}
              textField="text"
              dataItemKey="value"
              value={priorityOptions.find(p => p.value === formData.priority)}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value.value }))}
              style={{ 
                width: '100%',
                height: '44px',
                borderRadius: '8px'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: 'var(--text-primary)'
            }}>
              Due Date
            </label>
            <DatePicker
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value || new Date() }))}
              style={{ 
                width: '100%',
                height: '44px',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      </div>

      <DialogActionsBar style={{ 
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem'
      }}>
        <Button 
          onClick={handleClose}
          fillMode="outline"
          style={{
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem'
          }}
        >
          Cancel
        </Button>
        <Button 
          themeColor="primary" 
          onClick={handleSubmit}
          style={{
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
};