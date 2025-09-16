import React from 'react';
import { Brain } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              NeuroBoost
            </span>
          </div>
          <div className="flex space-x-8 text-sm">
            <a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Privacy Policy
            </a>
            <a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              About
            </a>
            <a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Contact
            </a>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t text-center text-sm ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
          © 2025 NeuroBoost. Designed for minds that think differently.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
