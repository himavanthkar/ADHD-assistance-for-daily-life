import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Testimonials = ({ testimonials }) => {
  const { darkMode } = useTheme();
  return (
    <section id="testimonials" className={`py-20 md:py-28 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Loved by People Like You
          </h2>
          <p className={`text-lg mt-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            See how NeuroBoost is making a real difference in our users' lives.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-xl shadow-lg flex flex-col justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                </div>
                <blockquote className={`text-lg italic border-l-4 pl-4 mb-6 ${darkMode ? 'text-gray-300 border-blue-500' : 'text-gray-600 border-blue-400'}`}>
                  "{testimonial.quote}"
                </blockquote>
              </div>
              <div>
                <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{testimonial.author}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
