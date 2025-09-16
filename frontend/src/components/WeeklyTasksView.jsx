import React, { useState, useEffect } from 'react';
import { addDays, format, startOfWeek, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import slothImage from '../assets/sloth.jpg';
import { useTheme } from '../context/ThemeContext';

const DayColumn = ({ day, tasks, onToggle, onDelete, onAdd, isCurrentMonth }) => {
  const { darkMode } = useTheme();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    onAdd(newTaskText, format(day, 'yyyy-MM-dd'));
    setNewTaskText('');
  };

  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isPast = day < new Date() && !isToday;

  return (
    <div className={`p-3 rounded-lg border ${
      darkMode 
        ? `bg-gray-800 ${isCurrentMonth ? 'border-gray-600' : 'border-gray-700'} ${isToday ? 'border-blue-500' : ''}` 
        : `bg-gray-100 ${isCurrentMonth ? 'border-gray-300' : 'border-gray-200'} ${isToday ? 'border-blue-500' : ''}`
    } ${!isCurrentMonth ? 'opacity-60' : ''}`}>
      <h3 className={`font-bold text-center mb-2 text-sm ${
        darkMode ? 'text-white' : 'text-gray-900'
      } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
        {format(day, 'EEE')}
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {format(day, 'MMM d')}
        </div>
      </h3>
      <div className="space-y-1 min-h-[120px]">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center space-x-1 p-1 rounded-md group transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
              className="form-checkbox h-3 w-3 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className={`flex-1 text-xs ${task.done ? 'line-through opacity-60' : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {task.text}
            </span>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTask} className="mt-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add task..."
          className={`w-full px-2 py-1 rounded border text-xs ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
      </form>
    </div>
  );
};

const WeeklyTasksView = ({ tasks, onToggle, onDelete, onAdd, onClearAll }) => {
  const { darkMode } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const noTasks = tasks.length === 0;
  const allTasksCompleted = !noTasks && tasks.every(task => task.done);

  useEffect(() => {
    // Automatically hide calendar if all tasks are completed or list is empty
    if (noTasks || allTasksCompleted) {
      setShowCalendar(false);
    } else {
      setShowCalendar(true);
    }
  }, [tasks, noTasks, allTasksCompleted]);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Get all days in the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get the start of the week that contains the month start
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  // Get the end of the week that contains the month end
  const calendarEnd = startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 1 });
  
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const renderSlothView = () => (
    <div className={`text-center p-8 rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <img src={slothImage} alt="Sleeping sloth" className="mx-auto mb-4 w-48" />
        <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {noTasks ? "No tasks for this month. Add one to get started!" : "Assignments are all completed"}
        </p>
        <button
            onClick={() => setShowCalendar(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
        >
            Add Task
        </button>
    </div>
  );

  return (
      <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Monthly Tasks
            </h2>
            {!noTasks && (
              <button
                onClick={onClearAll}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {(noTasks || allTasksCompleted) && !showCalendar ? renderSlothView() : (
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-4">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <button
                    onClick={goToCurrentMonth}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Today
                  </button>
                </div>
                <button
                  onClick={goToNextMonth}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className={`text-center font-semibold text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Week Rows */}
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {week.map(day => (
                      <DayColumn
                        key={day}
                        day={day}
                        tasks={tasks.filter(t => t.date === format(day, 'yyyy-MM-dd'))}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onAdd={onAdd}
                        isCurrentMonth={day.getMonth() === currentMonth.getMonth()}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
  );
};

export default WeeklyTasksView; 