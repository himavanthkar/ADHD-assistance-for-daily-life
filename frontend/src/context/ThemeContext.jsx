import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// Mood-based color schemes
const moodThemes = {
  calm: {
    primary: '#3B82F6',      // Blue
    secondary: '#60A5FA',
    accent: '#DBEAFE',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#2563EB',
    
    // CSS custom properties for mood-responsive styling
    '--mood-primary': '#3B82F6',
    '--mood-bg': '#F0F8FF',
    '--mood-text': '#1E3A8A',
    '--mood-border': '#BFDBFE'
  },
  energetic: {
    primary: '#F59E0B',      // Orange
    secondary: '#FBBF24',
    accent: '#FEF3C7',
    background: '#FFFBEB',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#F3F4F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#D97706',
    
    '--mood-primary': '#F59E0B',
    '--mood-bg': '#FFF7ED',
    '--mood-text': '#9A3412',
    '--mood-border': '#FED7AA'
  },
  focused: {
    primary: '#8B5CF6',      // Purple
    secondary: '#A78BFA',
    accent: '#EDE9FE',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#7C3AED',
    
    '--mood-primary': '#8B5CF6',
    '--mood-bg': '#FAF5FF',
    '--mood-text': '#581C87',
    '--mood-border': '#D8B4FE'
  },
  stressed: {
    primary: '#EF4444',      // Red
    secondary: '#F87171',
    accent: '#FEE2E2',
    background: '#FEF2F2',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#FCA5A5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#DC2626',
    
    '--mood-primary': '#EF4444',
    '--mood-bg': '#FEF2F2',
    '--mood-text': '#991B1B',
    '--mood-border': '#FCA5A5'
  },
  happy: {
    primary: '#10B981',      // Green
    secondary: '#34D399',
    accent: '#D1FAE5',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#BBF7D0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#059669',
    
    '--mood-primary': '#10B981',
    '--mood-bg': '#F0FDF4',
    '--mood-text': '#065F46',
    '--mood-border': '#BBF7D0'
  },
  neutral: {
    primary: '#6B7280',      // Gray
    secondary: '#9CA3AF',
    accent: '#F3F4F6',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    focus: '#4B5563',
    
    '--mood-primary': '#6B7280',
    '--mood-bg': '#F9FAFB',
    '--mood-text': '#374151',
    '--mood-border': '#D1D5DB'
  }
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodDetectionEnabled, setMoodDetectionEnabled] = useState(true);

  // AI Mood Detection
  const detectMoodFromAI = async () => {
    if (!moodDetectionEnabled) return;
    
    // In a real app, we'd check a global config or env var.
    // For this hackathon, we'll just disable it if the port is known to be down.
    const isAIServiceActive = false; // Set to false to disable
    if (!isAIServiceActive) {
      // console.log("AI Mood Detection is currently disabled.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/mood/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: 'anonymous',
          context: 'general_usage' 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.mood && moodThemes[data.mood]) {
          setCurrentMood(data.mood);
        }
      }
    } catch (error) {
      console.log('Mood detection unavailable:', error.message);
    }
  };

  // Apply mood-based CSS custom properties
  useEffect(() => {
    const theme = moodThemes[currentMood];
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value);
      }
    });
  }, [currentMood]);

  // Auto-detect mood periodically
  useEffect(() => {
    if (moodDetectionEnabled) {
      detectMoodFromAI();
      const interval = setInterval(detectMoodFromAI, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [moodDetectionEnabled]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const changeMood = (mood) => {
    if (moodThemes[mood]) {
      setCurrentMood(mood);
    }
  };

  const value = useMemo(() => ({
    darkMode,
    currentMood,
    moodThemes,
    currentTheme: moodThemes[currentMood],
    moodDetectionEnabled,
    toggleDarkMode,
    changeMood,
    setMoodDetectionEnabled,
    detectMoodFromAI
  }), [darkMode, currentMood, moodDetectionEnabled]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${darkMode ? 'dark' : ''} mood-${currentMood}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
} 