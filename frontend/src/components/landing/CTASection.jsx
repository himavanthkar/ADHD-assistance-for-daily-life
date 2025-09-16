import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CTASection = () => {
  const { darkMode } = useTheme();
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Work With Your Brain?
          </h2>
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of individuals who've found their flow with NeuroBoost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm mt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
