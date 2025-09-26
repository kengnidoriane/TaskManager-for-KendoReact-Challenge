import React, { useState } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Ctrl + N', action: 'Create new task', category: 'Task Management' },
  { key: 'Ctrl + E', action: 'Edit selected task', category: 'Task Management' },
  { key: 'Ctrl + D', action: 'Delete selected task', category: 'Task Management' },
  { key: 'Ctrl + F', action: 'Focus search', category: 'Navigation' },
  { key: 'Ctrl + K', action: 'Quick command palette', category: 'Navigation' },
  { key: 'Tab', action: 'Switch between views', category: 'Navigation' },
  { key: 'Ctrl + 1', action: 'Grid view', category: 'Views' },
  { key: 'Ctrl + 2', action: 'Kanban view', category: 'Views' },
  { key: 'Ctrl + 3', action: 'Calendar view', category: 'Views' },
  { key: 'Ctrl + Shift + A', action: 'Analytics dashboard', category: 'Views' },
  { key: 'Escape', action: 'Close dialogs/Cancel', category: 'General' },
  { key: 'Enter', action: 'Confirm action', category: 'General' },
  { key: '?', action: 'Show this help', category: 'General' }
];

export const KeyboardShortcutsHelper: React.FC<KeyboardShortcutsHelperProps> = ({
  isOpen,
  onClose
}) => {
  const categories = [...new Set(shortcuts.map(s => s.category))];

  if (!isOpen) return null;

  return (
    <Dialog
      title="Keyboard Shortcuts"
      onClose={onClose}
      visible={true}
      width={600}
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '1.5rem',
          color: 'var(--text-secondary)'
        }}>
          <Keyboard size={20} />
          <span>Master these shortcuts to boost your productivity</span>
        </div>

        {categories.map(category => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ 
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--primary-color)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Command size={16} />
              {category}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {shortcuts
                .filter(s => s.category === category)
                .map((shortcut, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.875rem' }}>{shortcut.action}</span>
                    <kbd style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)'
                    }}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius)',
          marginTop: '1rem'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Pro Tip:</strong> Press <kbd style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '0.125rem 0.25rem',
              borderRadius: '2px',
              fontSize: '0.75rem'
            }}>?</kbd> anytime to open this help dialog
          </div>
        </div>
      </div>

      <DialogActionsBar>
        <Button themeColor="primary" onClick={onClose}>
          Got it!
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
};