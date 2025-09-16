import React from 'react';
import { useTheme } from '../context/ThemeContext';

const MoodSelector = () => {
  const { currentMood, changeMood, availableMoods, moodThemes, isDetecting } = useTheme();

  const moodEmojis = {
    calm: '😌',
    energetic: '⚡',
    focused: '🎯',
    stressed: '😰',
    happy: '😊',
    neutral: '😐'
  };

  const moodDescriptions = {
    calm: 'Peaceful and relaxed',
    energetic: 'High energy and motivated',
    focused: 'Concentrated and productive',
    stressed: 'Overwhelmed or anxious',
    happy: 'Joyful and positive',
    neutral: 'Balanced and steady'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood & Theme
        </h3>
        {isDetecting && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Detecting...
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Current mood: <span className="font-medium">{moodThemes[currentMood]?.name}</span>
        </p>
        <div className={`w-full h-3 rounded-full ${moodThemes[currentMood]?.gradient} bg-gradient-to-r`}></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableMoods.map((mood) => {
          const theme = moodThemes[mood];
          const isActive = currentMood === mood;
          
          return (
            <button
              key={mood}
              onClick={() => changeMood(mood)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-center
                ${isActive 
                  ? `${theme.primary} border-transparent text-white shadow-lg transform scale-105` 
                  : `${theme.secondary} border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 ${theme.text} hover:shadow-md`
                }
              `}
            >
              <div className="text-2xl mb-1">{moodEmojis[mood]}</div>
              <div className="text-sm font-medium capitalize">{mood}</div>
              <div className="text-xs opacity-75 mt-1">
                {moodDescriptions[mood]}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 <strong>Tip:</strong> Your mood affects the app's colors and theme. 
          The AI can also detect your mood from voice input automatically!
        </p>
      </div>
    </div>
  );
};

export default MoodSelector; 