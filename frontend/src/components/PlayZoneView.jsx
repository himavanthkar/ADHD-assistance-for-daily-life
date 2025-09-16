import React from 'react';
import { useTheme } from '../context/ThemeContext';

const PlayZoneView = ({ timeLeft }) => {
  const { darkMode } = useTheme();
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const games = [
    { name: 'Tetris', url: 'https://play.tetris.com/' },
    { name: 'Sudoku', url: 'https://sudoku.com/' },
    { name: '2048', url: 'https://play2048.co/' },
    { name: 'Slither.io', url: 'http://slither.io/' },
    { name: 'Wordle', url: 'https://www.nytimes.com/games/wordle/index.html' },
    { name: 'Chess', url: 'https://www.chess.com/play/computer' },
  ];

  return (
    <div className={`p-8 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Play Zone
      </h3>
      <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Enjoy a 10-minute break to relax and recharge before your next focus session.
      </p>
      <div className="text-center my-8">
        <p className={`text-7xl font-mono font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          {formatTime(timeLeft)}
        </p>
        <p className={`mt-2 text-sm uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Break Time Remaining
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {games.map(game => (
          <a
            key={game.name}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 rounded-lg text-center font-bold transition-transform transform hover:scale-105 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {game.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PlayZoneView;