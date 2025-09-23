import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronUp, LucideProps } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mode, currentTheme, setLight, setDark, setSystem } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current icon based on theme
  const getCurrentIcon = () => {
    if (mode === 'system') return Monitor;
    return currentTheme === 'light' ? Sun : Moon;
  };

  const CurrentIcon = getCurrentIcon();

  const themeOptions = [
    {
      id: 'light',
      label: 'Light',
      icon: Sun,
      onClick: setLight,
      active: mode === 'light'
    },
    {
      id: 'dark', 
      label: 'Dark',
      icon: Moon,
      onClick: setDark,
      active: mode === 'dark'
    },
    {
      id: 'system',
      label: 'System',
      icon: Monitor,
      onClick: setSystem,
      active: mode === 'system'
    }
  ];

  const handleOptionClick = (option: { id?: string; label?: string; icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; onClick: any; active?: boolean; }) => {
    option.onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={dropdownRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  option.active 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <IconComponent size={16} />
                <span className="text-sm font-medium">{option.label}</span>
                {option.active && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105 ${
          isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        aria-label="Toggle theme"
      >
        <div className="relative">
          <CurrentIcon 
            size={20} 
            className={`text-gray-700 dark:text-gray-300 transition-transform duration-200 ${
              isOpen ? 'scale-110' : ''
            }`} 
          />
          
          {/* Small indicator arrow when dropdown is open */}
          {isOpen && (
            <ChevronUp 
              size={12} 
              className="absolute -top-1 -right-1 text-blue-500 animate-bounce"
            />
          )}
        </div>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;