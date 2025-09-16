import React from 'react';
import silvangaurdImg from '../../assets/Silvangaurd.png';
import { useTheme } from '../../context/ThemeContext';

const HeroSection = () => {
  const { darkMode } = useTheme();
  return (
    <section className={`py-20 md:py-32 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Unlock Your <span className="text-blue-500">Peak Focus</span>
            </h1>
            <p className={`text-lg md:text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              NeuroBoost helps you conquer distractions, manage your tasks, and build lasting habits with a personalized, gamified experience.
            </p>
            <a 
              href="/signup" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Get Started for Free
            </a>
          </div>
          <div className="flex justify-center">
            <img 
              src={silvangaurdImg} 
              alt="NeuroBoost Companion" 
              className="w-64 md:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
