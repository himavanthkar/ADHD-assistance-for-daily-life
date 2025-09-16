import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Import the evolution images
import slumberbloomImg from '../assets/Slumberbloom.png';
import arborealmImg from '../assets/Arborealm.png';
import silvangaurdImg from '../assets/Silvangaurd.png';

const evolutions = [
  { name: 'Slumberbloom', xpThreshold: 0, image: slumberbloomImg, level: 1 },
  { name: 'Arborealm', xpThreshold: 10, image: arborealmImg, level: 2 },
  { name: 'Silvangaurd', xpThreshold: 25, image: silvangaurdImg, level: 3 },
];

const LevelUpStatus = ({ xp, isFullPage = false }) => {
  const { darkMode } = useTheme();
  const currentEvolution = [...evolutions].reverse().find(evo => xp >= evo.xpThreshold);
  const nextEvolutionIndex = evolutions.findIndex(evo => evo.name === currentEvolution.name) + 1;
  const nextEvolution = evolutions[nextEvolutionIndex];
  
  const currentEvolutionIndex = evolutions.findIndex(evo => evo.name === currentEvolution.name);
  const previousEvolutions = evolutions.slice(0, currentEvolutionIndex);

  let progressPercent = 100;
  let xpForNextLevel = 'Max';
  
  if (nextEvolution) {
    const xpBaseForCurrentLevel = currentEvolution.xpThreshold;
    const xpNeededForNextLevel = nextEvolution.xpThreshold - xpBaseForCurrentLevel;
    const xpEarnedThisLevel = xp - xpBaseForCurrentLevel;
    progressPercent = (xpEarnedThisLevel / xpNeededForNextLevel) * 100;
    xpForNextLevel = nextEvolution.xpThreshold;
  }

  const content = (
    <div className="flex flex-col items-center text-center p-4">
      <img 
        src={currentEvolution.image} 
        alt={currentEvolution.name} 
        className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6 transition-transform duration-500 hover:scale-110"
      />
      <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {currentEvolution.name}
      </h3>
      <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Level {currentEvolution.level}
      </p>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-2 text-sm font-medium">
          <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>XP</span>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {xp} / {xpForNextLevel}
          </span>
        </div>
        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4`}>
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="p-6">
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Companion's Evolution
        </h2>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {content}
        </div>
        
        {previousEvolutions.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Evolution History
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previousEvolutions.map(evo => (
                <div 
                  key={evo.name}
                  className={`p-4 rounded-lg text-center transition-opacity ${darkMode ? 'bg-gray-800' : 'bg-white'} opacity-60 hover:opacity-100`}
                >
                  <img 
                    src={evo.image} 
                    alt={evo.name} 
                    className="w-24 h-24 object-contain mx-auto mb-2"
                  />
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{evo.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lvl {evo.level}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // This is for the dashboard view, keeping it more compact
  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Companion</h3>
      {content}
    </div>
  );
};

export default LevelUpStatus;