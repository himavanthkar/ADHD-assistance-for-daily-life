import React from 'react';
import DashboardCard from './DashboardCard';
import { useTheme } from '../context/ThemeContext';

const DailyPKGSummary = () => {
  const { darkMode } = useTheme();
  return (
    <DashboardCard title="Daily PKG Summary">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">85%</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Focus Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">7/10</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">4.2h</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep Work</div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default DailyPKGSummary; 