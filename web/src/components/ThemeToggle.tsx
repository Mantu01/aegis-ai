'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, ChevronUp } from 'lucide-react';

interface ThemeOption {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;
  }

  const themes: ThemeOption[] = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' }
  ];

  const currentTheme = themes.find(t => t.name === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          group flex items-center justify-between
          w-32 h-8 px-3
          border border-gray-200 dark:border-gray-700
          rounded-lg
          hover:border-red-300 dark:hover:border-red-700
          hover:shadow
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-red-500
        "
        aria-label="Theme selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          <CurrentIcon 
            size={14} 
            className="text-red-500 dark:text-red-400" 
          />
          <span className="text-xs font-medium">
            {currentTheme.label}
          </span>
        </div>
        
        <ChevronUp 
          size={12} 
          className={`
            text-gray-500 dark:text-gray-400
            transition-transform duration-200
            ${isOpen ? '' : 'rotate-180'}
          `} 
        />
      </button>

      {isOpen && (
        <div className="
          absolute bottom-8 left-0 right-0
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg
          py-1 z-50
          animate-in slide-in-from-bottom-2 duration-200
        ">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.name;
            
            return (
              <button
                key={themeOption.name}
                onClick={() => handleThemeChange(themeOption.name)}
                className={`
                  w-full flex items-center space-x-2 px-3 py-1.5
                  text-xs font-medium
                  transition-colors duration-150
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  ${isSelected 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <Icon 
                  size={14} 
                  className={`
                    ${isSelected 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `} 
                />
                <span>{themeOption.label}</span>
                {isSelected && (
                  <div className="ml-auto w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggler;