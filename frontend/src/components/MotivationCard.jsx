import React from 'react';
import DashboardCard from './DashboardCard';
import { useTheme } from '../context/ThemeContext';

const MotivationCard = ({ mood }) => {
  const { darkMode } = useTheme();
  const quotes = {
    happy: "Your positive energy is contagious! Keep spreading those good vibes! ✨",
    focused: "You're in the zone! This is your superpower moment! 🎯",
    stressed: "Take a deep breath. You've overcome challenges before, and you will again. 🌱",
    calm: "Your peaceful energy is beautiful. Use this clarity to tackle your goals! 🧘‍♀️",
    energetic: "Channel that amazing energy into your most important task right now! ⚡"
  };

  const moodEmojis = {
    happy: "😊",
    focused: "🎯",
    stressed: "😤",
    calm: "😌",
    energetic: "⚡"
  };

  return (
    <DashboardCard title="Daily Motivation">
      <div className="text-center space-y-4">
        <div className="text-4xl">{moodEmojis[mood] || "😊"}</div>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {quotes[mood] || quotes.happy}
        </p>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          Current Mood: {mood || 'happy'}
        </div>
      </div>
    </DashboardCard>
  );
};

export default MotivationCard; 