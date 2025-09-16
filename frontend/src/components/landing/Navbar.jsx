import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 shadow-md'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <a href="/">NeuroBoost</a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-blue-500 transition-colors">Testimonials</a>
          <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Sign Up
          </a>
          <button onClick={toggleDarkMode} className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleDarkMode} className="p-2 rounded-full mr-2">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-full focus:outline-none">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center space-y-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <a href="#features" className="hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#testimonials" className="hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
          <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
