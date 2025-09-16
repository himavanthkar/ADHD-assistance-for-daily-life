import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SettingsPage = ({ profilePic, onProfilePicChange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfilePicChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      {/* Profile Section */}
      <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Profile</h3>
        <div className="flex items-center space-x-6 mb-6">
          <img 
            src={profilePic || `https://ui-avatars.com/api/?name=Demo+User&background=random`} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <label htmlFor="profile-upload" className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Upload Photo
            </label>
            <input id="profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <input 
              type="text" 
              defaultValue="Demo User" 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <input 
              type="email" 
              defaultValue="demo@example.com" 
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
            />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Save Profile
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <div className="flex items-center justify-between">
          <span>Enable Task Reminders</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Theme Settings */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4">Theme</h3>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 