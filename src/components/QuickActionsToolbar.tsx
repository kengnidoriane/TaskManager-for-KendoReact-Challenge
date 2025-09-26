import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Archive, 
  Zap,
  Calendar,
  BarChart3
} from 'lucide-react';

interface QuickActionsToolbarProps {
  onQuickAdd: (title: string) => void;
  onSearch: (term: string) => void;
  onExport: () => void;
  onImport: () => void;
  onBulkArchive: () => void;
  onShowCalendar: () => void;
  onShowStats: () => void;
  selectedCount?: number;
}

export const QuickActionsToolbar: React.FC<QuickActionsToolbarProps> = ({
  onQuickAdd,
  onSearch,
  onExport,
  onImport,
  onBulkArchive,
  onShowCalendar,
  onShowStats,
  selectedCount = 0
}) => {
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleQuickAdd = () => {
    if (quickTitle.trim()) {
      onQuickAdd(quickTitle.trim());
      setQuickTitle('');
      setQuickAddMode(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAdd();
    } else if (e.key === 'Escape') {
      setQuickAddMode(false);
      setQuickTitle('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow)',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Quick Add Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
        {!quickAddMode ? (
          <Tooltip anchorElement="target" position="bottom">
            <Button
              themeColor="primary"
              onClick={() => setQuickAddMode(true)}
              title="Quick add task (Ctrl+N)"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              Quick Add
            </Button>
          </Tooltip>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <Input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.value || '')}
              onKeyDown={handleKeyPress}
              placeholder="Type task title and press Enter..."
              style={{ flex: 1 }}
              autoFocus
            />
            <Button
              themeColor="primary"
              onClick={handleQuickAdd}
              disabled={!quickTitle.trim()}
            >
              <Plus size={16} />
            </Button>
            <Button
              fillMode="flat"
              onClick={() => {
                setQuickAddMode(false);
                setQuickTitle('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div style={{ position: 'relative', minWidth: '250px' }}>
        <Search size={16} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }} />
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.value || '');
            onSearch(e.value || '');
          }}
          placeholder="Search tasks..."
          style={{ paddingLeft: '40px', width: '100%' }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Tooltip anchorElement="target" position="bottom">
          <Button
            fillMode="outline"
            onClick={onShowCalendar}
            title="Calendar view"
          >
            <Calendar size={16} />
          </Button>
        </Tooltip>

        <Tooltip anchorElement="target" position="bottom">
          <Button
            fillMode="outline"
            onClick={onShowStats}
            title="Statistics"
          >
            <BarChart3 size={16} />
          </Button>
        </Tooltip>

        <Tooltip anchorElement="target" position="bottom">
          <Button
            fillMode="outline"
            onClick={onExport}
            title="Export tasks"
          >
            <Download size={16} />
          </Button>
        </Tooltip>

        <Tooltip anchorElement="target" position="bottom">
          <Button
            fillMode="outline"
            onClick={onImport}
            title="Import tasks"
          >
            <Upload size={16} />
          </Button>
        </Tooltip>

        {selectedCount > 0 && (
          <Tooltip anchorElement="target" position="bottom">
            <Button
              fillMode="outline"
              themeColor="error"
              onClick={onBulkArchive}
              title={`Archive ${selectedCount} selected tasks`}
            >
              <Archive size={16} />
              {selectedCount}
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        marginLeft: 'auto'
      }}>
        <Zap size={12} />
        <span>Ctrl+N: Quick Add | Ctrl+F: Search | Ctrl+E: Export</span>
      </div>
    </div>
  );
};