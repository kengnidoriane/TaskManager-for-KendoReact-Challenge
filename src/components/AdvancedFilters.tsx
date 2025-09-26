import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Popup } from '@progress/kendo-react-popup';
import { Filter, X, Calendar, Tag, AlertCircle } from 'lucide-react';

interface FilterState {
  priorities: string[];
  statuses: string[];
  dateRange: { start: Date | null; end: Date | null };
  overdue: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  taskCount: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  taskCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priorities: [],
    statuses: [],
    dateRange: { start: null, end: null },
    overdue: false
  });

  const anchor = React.useRef<HTMLButtonElement>(null);

  const priorityOptions = [
    { text: '🔴 High Priority', value: 'High' },
    { text: '🟡 Medium Priority', value: 'Medium' },
    { text: '🟢 Low Priority', value: 'Low' }
  ];

  const statusOptions = [
    { text: '📝 To Do', value: 'Todo' },
    { text: '⚡ In Progress', value: 'InProgress' },
    { text: '✅ Done', value: 'Done' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      priorities: [],
      statuses: [],
      dateRange: { start: null, end: null },
      overdue: false
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = 
    filters.priorities.length + 
    filters.statuses.length + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.overdue ? 1 : 0);

  return (
    <>
      <Button
        ref={anchor}
        fillMode="outline"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <Filter size={16} />
        Advanced Filters
        {activeFiltersCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <Popup
        anchor={anchor.current}
        show={isOpen}
        onClose={() => setIsOpen(false)}
        style={{
          width: '400px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          zIndex: 1000
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} />
              Filter Tasks
            </h3>
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                fillMode="flat"
                onClick={clearAllFilters}
              >
                <X size={14} style={{ marginRight: '0.25rem' }} />
                Clear All
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>
                <Tag size={14} style={{ marginRight: '0.5rem' }} />
                Priority
              </label>
              <MultiSelect
                data={priorityOptions}
                textField="text"
                dataItemKey="value"
                value={filters.priorities}
                onChange={(e) => handleFilterChange('priorities', e.value)}
                placeholder="Select priorities..."
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={14} style={{ marginRight: '0.5rem' }} />
                Status
              </label>
              <MultiSelect
                data={statusOptions}
                textField="text"
                dataItemKey="value"
                value={filters.statuses}
                onChange={(e) => handleFilterChange('statuses', e.value)}
                placeholder="Select statuses..."
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>
                <Calendar size={14} style={{ marginRight: '0.5rem' }} />
                Date Range
              </label>
              <DateRangePicker
                startDateInput={{
                  placeholder: 'Start date',
                  value: filters.dateRange.start
                }}
                endDateInput={{
                  placeholder: 'End date',
                  value: filters.dateRange.end
                }}
                onChange={(e) => handleFilterChange('dateRange', {
                  start: e.value.start,
                  end: e.value.end
                })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius)'
            }}>
              <input
                type="checkbox"
                id="overdue-filter"
                checked={filters.overdue}
                onChange={(e) => handleFilterChange('overdue', e.target.checked)}
              />
              <label htmlFor="overdue-filter" style={{ fontSize: '0.875rem' }}>
                Show only overdue tasks
              </label>
            </div>
          </div>

          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Showing {taskCount} tasks with current filters
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};