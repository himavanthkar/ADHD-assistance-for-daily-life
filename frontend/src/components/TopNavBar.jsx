import React from 'react';
import { Mic, Settings, Sun, Moon, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TopNavBar = ({ mood, onTabChange, profilePic }) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMoodRingColor = (mood) => {
    const colors = {
      happy: 'ring-green-400',
      focused: 'ring-blue-400',
      stressed: 'ring-red-400',
      calm: 'ring-purple-400',
      energetic: 'ring-orange-400'
    };
    return colors[mood] || 'ring-gray-400';
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50`}>
      <h1 
        onClick={() => onTabChange('dashboard')}
        className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} cursor-pointer`}
      >
        NeuroBoost
      </h1>
      <div className="flex items-center space-x-4">
        <button className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Mic className="w-5 h-5" />
        </button>
        <button onClick={toggleDarkMode} className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button onClick={() => onTabChange('settings')} className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Settings className="w-5 h-5" />
        </button>
        <button onClick={handleLogout} className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <LogOut className="w-5 h-5" />
        </button>
        <div className={`relative p-1 rounded-full ring-2 ${getMoodRingColor(mood)}`}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar; 