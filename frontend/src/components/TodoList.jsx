import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TodoList = ({ tasks, onToggle, onDelete, onAdd, onClear, className = "" }) => {
  const { darkMode } = useTheme();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    onAdd(newTaskText);
    setNewTaskText('');
  };

  const completedCount = tasks.filter(task => task.done).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <DashboardCard 
      title="Today's Tasks" 
      className={className}
      headerContent={
        tasks.length > 0 && (
          <button
            onClick={onClear}
            className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )
      }
    >
      {tasks.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {completedCount} of {tasks.length} completed
            </span>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3 min-h-[6rem] flex flex-col justify-center">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} onClick={() => onToggle(task.id)} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                task.done 
                  ? 'bg-green-500 border-green-500' 
                  : darkMode 
                    ? 'border-gray-600 group-hover:border-green-500' 
                    : 'border-gray-300 group-hover:border-green-500'
              }`}>
                {task.done && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={`flex-1 ${task.done ? 'line-through opacity-60' : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {task.text}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No tasks for today. Add one to get started!
          </p>
        )}
      </div>

      <form onSubmit={handleAddTask} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
          Add
        </button>
      </form>
    </DashboardCard>
  );
};

export default TodoList; 