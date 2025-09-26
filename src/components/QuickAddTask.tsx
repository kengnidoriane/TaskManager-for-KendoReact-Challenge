import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Plus, Calendar, Flag, X } from 'lucide-react';

interface QuickAddTaskProps {
  onAddTask: (task: {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    deadline: Date;
  }) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onAddTask,
  onCancel,
  placeholder = "Type a task and press Enter..."
}) => {
  const [taskText, setTaskText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const inputRef = useRef<any>(null);

  const priorityOptions = [
    { text: '🔴 High', value: 'High' },
    { text: '🟡 Medium', value: 'Medium' },
    { text: '🟢 Low', value: 'Low' }
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Parse natural language (simple version)
  const parseTaskText = (text: string) => {
    let parsedTitle = text;
    let parsedPriority: 'High' | 'Medium' | 'Low' = 'Medium';
    let parsedDeadline = new Date();

    // Priority detection
    if (text.includes('urgent') || text.includes('important') || text.includes('!')) {
      parsedPriority = 'High';
    } else if (text.includes('low') || text.includes('maybe')) {
      parsedPriority = 'Low';
    }

    // Date detection (simple)
    if (text.includes('today')) {
      parsedDeadline = new Date();
    } else if (text.includes('tomorrow')) {
      parsedDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (text.includes('next week')) {
      parsedDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    // Clean title
    parsedTitle = text
      .replace(/\b(urgent|important|low|maybe|today|tomorrow|next week)\b/gi, '')
      .replace(/!+/g, '')
      .trim();

    return {
      title: parsedTitle,
      priority: parsedPriority,
      deadline: parsedDeadline
    };
  };

  const handleSubmit = () => {
    if (!taskText.trim()) return;

    const parsed = parseTaskText(taskText);
    
    onAddTask({
      title: parsed.title || taskText,
      description: '',
      priority: showDetails ? priority : parsed.priority,
      deadline: showDetails ? deadline : parsed.deadline
    });

    // Reset form
    setTaskText('');
    setShowDetails(false);
    setPriority('Medium');
    setDeadline(new Date());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      if (onCancel) {
        onCancel();
      } else {
        setTaskText('');
        setShowDetails(false);
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Main Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: showDetails ? '1rem' : '0' }}>
        <Plus size={16} style={{ color: 'var(--text-secondary)' }} />
        <Input
          ref={inputRef}
          value={taskText}
          onChange={(e) => setTaskText(e.value || '')}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          style={{ 
            flex: 1, 
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.875rem'
          }}
        />
        <Button
          size="small"
          fillMode="flat"
          onClick={() => setShowDetails(!showDetails)}
          title="More options"
          style={{ minWidth: '32px', height: '32px' }}
        >
          <Calendar size={14} />
        </Button>
      </div>

      {/* Quick Hints */}
      {!showDetails && taskText.length === 0 && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)',
          marginTop: '0.5rem',
          paddingLeft: '1.5rem'
        }}>
          💡 Try: "Call client tomorrow", "Fix bug urgent!", "Review docs next week"
        </div>
      )}

      {/* Detailed Options */}
      {showDetails && (
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flag size={14} style={{ color: 'var(--text-secondary)' }} />
            <DropDownList
              data={priorityOptions}
              textField="text"
              dataItemKey="value"
              value={priorityOptions.find(p => p.value === priority)}
              onChange={(e) => setPriority(e.target.value.value)}
              style={{ width: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
            <DatePicker
              value={deadline}
              onChange={(e) => setDeadline(e.target.value || new Date())}
              style={{ width: '140px' }}
            />
          </div>

          <Button
            size="small"
            fillMode="flat"
            onClick={() => setShowDetails(false)}
            style={{ minWidth: '32px', height: '32px' }}
          >
            <X size={14} />
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      {taskText.trim() && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '0.5rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <Button
            size="small"
            fillMode="outline"
            onClick={() => {
              setTaskText('');
              setShowDetails(false);
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            themeColor="primary"
            onClick={handleSubmit}
          >
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
};