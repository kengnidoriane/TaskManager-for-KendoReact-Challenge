import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { ColorPicker } from '@progress/kendo-react-inputs';
import { Slider } from '@progress/kendo-react-inputs';
import { Palette, Sun, Moon, Sparkles, Eye } from 'lucide-react';

interface Theme {
  name: string;
  colors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    background: string;
    surface: string;
    text: string;
  };
  borderRadius: number;
  shadows: boolean;
}

const presetThemes: Theme[] = [
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#0078d4',
      success: '#107c10',
      warning: '#ff8c00',
      danger: '#d13438',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#323130'
    },
    borderRadius: 8,
    shadows: true
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#2d7d32',
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      background: '#f1f8e9',
      surface: '#ffffff',
      text: '#1b5e20'
    },
    borderRadius: 12,
    shadows: true
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#ff6b35',
      success: '#4caf50',
      warning: '#ffc107',
      danger: '#e53935',
      background: '#fff3e0',
      surface: '#ffffff',
      text: '#bf360c'
    },
    borderRadius: 16,
    shadows: true
  },
  {
    name: 'Minimal Dark',
    colors: {
      primary: '#bb86fc',
      success: '#03dac6',
      warning: '#ffb74d',
      danger: '#cf6679',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff'
    },
    borderRadius: 4,
    shadows: false
  }
];

interface ThemeCustomizerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTheme, setCustomTheme] = useState<Theme>(currentTheme);
  const anchor = React.useRef<HTMLButtonElement>(null);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--success-color', theme.colors.success);
    root.style.setProperty('--warning-color', theme.colors.warning);
    root.style.setProperty('--danger-color', theme.colors.danger);
    root.style.setProperty('--bg-primary', theme.colors.surface);
    root.style.setProperty('--bg-secondary', theme.colors.background);
    root.style.setProperty('--text-primary', theme.colors.text);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--shadow', theme.shadows ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none');
    
    onThemeChange(theme);
  };

  const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    const newTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [colorKey]: value
      }
    };
    setCustomTheme(newTheme);
    applyTheme(newTheme);
  };

  const handlePresetSelect = (theme: Theme) => {
    setCustomTheme(theme);
    applyTheme(theme);
  };

  return (
    <>
      <Button
        ref={anchor}
        fillMode="flat"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Theme"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Palette size={16} />
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
          <h3 style={{ 
            margin: '0 0 1.5rem 0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <Sparkles size={20} color="var(--primary-color)" />
            Theme Customizer
          </h3>

          {/* Preset Themes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Preset Themes
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {presetThemes.map(theme => (
                <Button
                  key={theme.name}
                  fillMode="outline"
                  onClick={() => handlePresetSelect(theme)}
                  style={{
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    height: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: color,
                          borderRadius: '2px'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem' }}>{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Custom Colors
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ minWidth: '80px', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                    {key}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ColorPicker
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Border Radius: {customTheme.borderRadius}px
            </h4>
            <Slider
              value={customTheme.borderRadius}
              onChange={(e) => {
                const newTheme = { ...customTheme, borderRadius: e.value };
                setCustomTheme(newTheme);
                applyTheme(newTheme);
              }}
              min={0}
              max={20}
              step={2}
              style={{ width: '100%' }}
            />
          </div>

          {/* Shadows Toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius)'
          }}>
            <input
              type="checkbox"
              id="shadows-toggle"
              checked={customTheme.shadows}
              onChange={(e) => {
                const newTheme = { ...customTheme, shadows: e.target.checked };
                setCustomTheme(newTheme);
                applyTheme(newTheme);
              }}
            />
            <label htmlFor="shadows-toggle" style={{ fontSize: '0.875rem', flex: 1 }}>
              Enable shadows
            </label>
          </div>

          {/* Preview */}
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <Eye size={14} />
              Preview
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button size="small" themeColor="primary">Primary</Button>
              <Button size="small" themeColor="success">Success</Button>
              <Button size="small" themeColor="warning">Warning</Button>
              <Button size="small" themeColor="error">Error</Button>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};