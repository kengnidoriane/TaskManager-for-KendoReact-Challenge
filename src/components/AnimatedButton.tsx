import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Ripple } from '@progress/kendo-react-ripple';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon
}) => {
  return (
    <Ripple>
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        themeColor={variant === 'danger' ? 'error' : variant}
        size={size}
        style={{
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: loading ? 'scale(0.98)' : 'scale(1)',
          opacity: disabled ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {loading && (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
        {!loading && icon && icon}
        {children}
      </Button>
    </Ripple>
  );
};