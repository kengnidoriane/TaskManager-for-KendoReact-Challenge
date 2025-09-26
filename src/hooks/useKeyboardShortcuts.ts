import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onToggleView?: () => void;
  onSearch?: () => void;
}

export const useKeyboardShortcuts = ({ 
  onNewTask, 
  onToggleView, 
  onSearch 
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + N = New Task
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        onNewTask();
      }

      // N = New Task (simple)
      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault();
        onNewTask();
      }

      // V = Toggle View
      if ((event.key === 'v' || event.key === 'V') && onToggleView) {
        event.preventDefault();
        onToggleView();
      }

      // Ctrl/Cmd + K = Search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k' && onSearch) {
        event.preventDefault();
        onSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onToggleView, onSearch]);
};