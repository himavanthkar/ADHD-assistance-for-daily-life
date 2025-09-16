import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Features = ({ features }) => {
  const { darkMode } = useTheme();
  return (
    <section id="features" className={`py-20 md:py-28 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Everything You Need to Stay on Track
          </h2>
          <p className={`text-lg mt-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            NeuroBoost isn't just another to-do list. It's a complete ecosystem designed to support your focus and well-being.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mb-6">
                <feature.icon size={32} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
