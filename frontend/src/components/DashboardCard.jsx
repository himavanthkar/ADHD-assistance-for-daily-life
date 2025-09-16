import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DashboardCard = ({ title, children, className = "", headerContent = null }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {headerContent}
      </div>
      {children}
    </div>
  );
};

export default DashboardCard; 