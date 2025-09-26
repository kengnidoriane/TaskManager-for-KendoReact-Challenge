import React from 'react';
import { ProgressBar } from '@progress/kendo-react-progressbars';

interface ProgressStats {
  total: number;
  completed: number;
  percentage: number;
}

interface HeaderProps {
  progressStats: ProgressStats;
  isDark?: boolean;
  onToggleDark?: () => void;
  smartNotificationCenter?: React.ReactNode;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ progressStats, isDark, onToggleDark, smartNotificationCenter, onToggleMobileSidebar }) => {

  return (
    <header style={{
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      flexShrink: 0, /* Empêche le header de rétrécir */
      zIndex: 100
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Menu Button */}
        {onToggleMobileSidebar && (
          <button 
            onClick={onToggleMobileSidebar}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.25rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.15s ease',
              display: 'none'
            }}
            className="mobile-menu-btn"
            title="Toggle menu"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ☰
          </button>
        )}
        
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--primary-color)',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          SmartTask Manager
        </h1>
      </div>
      
      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Compact Progress with Tooltip */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            fontSize: '0.875rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            cursor: 'help',
            transition: 'background-color 0.15s ease'
          }}
          title={`Daily Progress: ${progressStats.completed} completed out of ${progressStats.total} tasks (${progressStats.percentage}%)`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span style={{ 
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>
            Progress
          </span>
          <span style={{ 
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            {progressStats.completed}/{progressStats.total}
          </span>
          <div style={{ width: '60px' }}>
            <ProgressBar 
              value={progressStats.percentage} 
              style={{ height: '4px' }}
            />
          </div>
          <span style={{ 
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            minWidth: '35px'
          }}>
            {progressStats.percentage}%
          </span>
        </div>

        {/* Notifications */}
        {smartNotificationCenter && smartNotificationCenter}
        
        {/* Theme Toggle */}
        {onToggleDark && (
          <button 
            onClick={onToggleDark}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.25rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.15s ease'
            }}
            title={isDark ? 'Light mode' : 'Dark mode'}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        )}
      </div>
    </header>
  );
};