import React, { useState } from 'react';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { PriorityBadge } from './TaskBadges';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'InProgress' | 'Done';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDateClick: (date: Date) => void;
  onAddTask: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskClick,
  onDateClick,
  onAddTask
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.deadline, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateTasks = getTasksForDate(date);
    setSelectedDateTasks(dateTasks);
    onDateClick(date);
  };

  const handleCellClick = (event: any, date: Date) => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length > 0) {
      setSelectedDateTasks(dateTasks);
      setPopupAnchor(event.currentTarget);
      setShowTaskPopup(true);
    }
  };

  const renderCell = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    const overdueTasks = dateTasks.filter(task => 
      task.deadline < new Date() && task.status !== 'Done'
    );
    const completedTasks = dateTasks.filter(task => task.status === 'Done');
    const pendingTasks = dateTasks.filter(task => task.status !== 'Done');

    return (
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          cursor: dateTasks.length > 0 ? 'pointer' : 'default'
        }}
        onClick={(e) => handleCellClick(e, date)}
      >
        <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          {date.getDate()}
        </div>
        
        {dateTasks.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1px',
            fontSize: '0.6rem'
          }}>
            {dateTasks.slice(0, 3).map((task, index) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: 
                    task.status === 'Done' ? 'var(--success-color)' :
                    overdueTasks.includes(task) ? 'var(--danger-color)' :
                    task.priority === 'High' ? 'var(--danger-color)' :
                    task.priority === 'Medium' ? 'var(--warning-color)' :
                    'var(--primary-color)',
                  color: 'white',
                  padding: '1px 3px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            
            {dateTasks.length > 3 && (
              <div style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                padding: '1px 3px',
                borderRadius: '2px',
                textAlign: 'center'
              }}>
                +{dateTasks.length - 3} more
              </div>
            )}
          </div>
        )}

        {/* Indicators */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2px', 
          right: '2px',
          display: 'flex',
          gap: '1px'
        }}>
          {overdueTasks.length > 0 && (
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--danger-color)',
              borderRadius: '50%'
            }} title={`${overdueTasks.length} overdue tasks`} />
          )}
          {completedTasks.length > 0 && (
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--success-color)',
              borderRadius: '50%'
            }} title={`${completedTasks.length} completed tasks`} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      background: 'var(--bg-primary)', 
      borderRadius: 'var(--border-radius)', 
      padding: '1.5rem',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: 'var(--text-primary)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📅 Calendar View
        </h2>
        
        <Button
          themeColor="primary"
          onClick={() => onAddTask(selectedDate)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} />
          Add Task for {format(selectedDate, 'MMM dd')}
        </Button>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--danger-color)', borderRadius: '50%' }} />
          Overdue
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--success-color)', borderRadius: '50%' }} />
          Completed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%' }} />
          Pending
        </div>
      </div>

      <Calendar
        value={selectedDate}
        onChange={(e) => handleDateClick(e.value)}
        cellRender={({ value }) => renderCell(value)}
        style={{ width: '100%' }}
      />

      {/* Task Details Popup */}
      <Popup
        anchor={popupAnchor}
        show={showTaskPopup}
        onClose={() => setShowTaskPopup(false)}
        style={{
          width: '350px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          zIndex: 1000
        }}
      >
        <div style={{ padding: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h4 style={{ margin: 0 }}>
              Tasks for {selectedDateTasks.length > 0 && format(selectedDateTasks[0].deadline, 'MMM dd, yyyy')}
            </h4>
            <span style={{ 
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}>
              {selectedDateTasks.length} tasks
            </span>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {selectedDateTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                    {task.title}
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
                
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}>
                  {task.description}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>
                  <Clock size={12} />
                  Status: {task.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  );
};