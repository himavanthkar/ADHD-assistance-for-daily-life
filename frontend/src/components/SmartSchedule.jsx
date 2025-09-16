import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { useTheme } from '../context/ThemeContext';

const TaskCreationModal = ({ isOpen, onClose, onAddTask }) => {
  const { darkMode } = useTheme();
  const [taskData, setTaskData] = useState({
    text: '',
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    priority: 'medium',
    energy_required: 'medium',
    difficulty: 'medium',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskData.text.trim()) {
      onAddTask(taskData);
      setTaskData({
        text: '',
        date: new Date().toISOString().slice(0, 10),
        time: '09:00',
        priority: 'medium',
        energy_required: 'medium',
        difficulty: 'medium',
        deadline: ''
      });
      onClose();
    }
  };

  const handlePriorityChange = (priority) => {
    setTaskData(prev => ({
      ...prev,
      priority,
      energy_required: priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low'
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h3 className="text-lg font-bold mb-4">Create New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Task Description</label>
            <input
              type="text"
              value={taskData.text}
              onChange={(e) => setTaskData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter task description..."
              className={`w-full px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={taskData.date}
              onChange={(e) => setTaskData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              value={taskData.time}
              onChange={(e) => setTaskData(prev => ({ ...prev, time: e.target.value }))}
              className={`w-full px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'high', label: 'High', color: 'bg-red-500 hover:bg-red-600' },
                { value: 'medium', label: 'Medium', color: 'bg-blue-500 hover:bg-blue-600' },
                { value: 'low', label: 'Low', color: 'bg-green-500 hover:bg-green-600' }
              ].map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handlePriorityChange(priority.value)}
                  className={`px-3 py-2 rounded text-white text-sm font-medium transition-colors ${
                    taskData.priority === priority.value 
                      ? priority.color 
                      : darkMode 
                        ? 'bg-gray-600 hover:bg-gray-500' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={taskData.difficulty}
              onChange={(e) => setTaskData(prev => ({ ...prev, difficulty: e.target.value }))}
              className={`w-full px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
            <input
              type="datetime-local"
              value={taskData.deadline}
              onChange={(e) => setTaskData(prev => ({ ...prev, deadline: e.target.value }))}
              className={`w-full px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded font-medium ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SmartSchedule = ({ tasks = [], onAddTask, onToggleTask, onDeleteTask, onEditTask }) => {
  const { darkMode } = useTheme();
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Convert tasks to timeline format
  const getTimelineItems = () => {
    if (!tasks || tasks.length === 0) {
      return [
        { time: "9:00 AM", task: "No tasks scheduled", type: "empty", duration: "Add tasks below" }
      ];
    }

    // Sort tasks by date and time, with completed tasks at the end
    const sortedTasks = [...tasks].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.done !== b.done) {
        return a.done ? 1 : -1;
      }
      // Then sort by date
      return new Date(a.date) - new Date(b.date);
    });

    // Convert tasks to timeline items with distributed times
    return sortedTasks.map((task, index) => {
      const taskDate = new Date(task.date);
      const isToday = taskDate.toDateString() === new Date().toDateString();
      const isPast = taskDate < new Date() && !isToday;
      
      // Use the task's actual time if available, otherwise distribute
      let time = "9:00 AM"; // default
      
      if (task.done) {
        // Completed tasks at 4 PM
        time = "4:00 PM";
      } else if (task.time) {
        // Use the task's assigned time
        const [hours, minutes] = task.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        time = `${displayHour}:${minutes} ${ampm}`;
      } else {
        // Distribute incomplete tasks across morning and afternoon
        if (task.energy_required === 'high') {
          time = "9:00 AM";
        } else if (task.energy_required === 'medium') {
          // Distribute medium priority tasks across different times
          const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM"];
          time = timeSlots[index % timeSlots.length];
        } else if (task.energy_required === 'low') {
          // Distribute low priority tasks across afternoon
          const timeSlots = ["1:00 PM", "2:00 PM", "3:00 PM"];
          time = timeSlots[index % timeSlots.length];
        }
      }

      // Format the date for display
      const dateDisplay = isToday ? "Today" : taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });

      // Add deadline info if available
      let duration = `${task.difficulty} priority • ${dateDisplay}`;
      if (task.deadline) {
        const deadline = new Date(task.deadline);
        duration += ` • Due: ${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }

      return {
        id: task.id,
        time: time,
        task: task.text,
        type: task.energy_required,
        duration: duration,
        done: task.done,
        originalTask: task,
        date: task.date,
        isToday: isToday,
        isPast: isPast
      };
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-blue-100 text-blue-700 border-blue-200',
      low: 'bg-green-100 text-green-700 border-green-200',
      empty: 'bg-gray-100 text-gray-500 border-gray-200'
    };
    return darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : colors[type] || colors.medium;
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setNewTaskText(task.text);
    }
  };

  const handleSaveEdit = () => {
    if (editingTask && newTaskText.trim() && onEditTask) {
      onEditTask(editingTask, newTaskText.trim());
      setEditingTask(null);
      setNewTaskText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTaskText('');
  };

  const handleAddQuickTask = () => {
    if (newTaskText.trim() && onAddTask) {
      onAddTask(newTaskText.trim(), new Date().toISOString().slice(0, 10));
      setNewTaskText('');
    }
  };

  const handleCreateTask = (taskData) => {
    if (onAddTask) {
      // Create a task object with all the specified properties
      const newTask = {
        text: taskData.text,
        date: taskData.date,
        time: taskData.time,
        priority: taskData.priority,
        energy_required: taskData.energy_required,
        difficulty: taskData.difficulty,
        deadline: taskData.deadline,
        done: false,
        type: 'personal',
        source: 'manual'
      };
      
      // Call the parent's onAddTask with the full task object
      onAddTask(newTask);
    }
  };

  const timelineItems = getTimelineItems();

  return (
    <>
      <DashboardCard title="Smart Schedule Timeline">
        <div className="space-y-3">
          {/* Quick Add Task */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a quick task..."
              className={`flex-1 px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyPress={(e) => e.key === 'Enter' && handleAddQuickTask()}
            />
            <button
              onClick={handleAddQuickTask}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              Quick Add
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
            >
              Create Task
            </button>
          </div>

          {/* Timeline Items */}
          {timelineItems.map((item, index) => (
            <div key={item.id || index} className="flex items-center space-x-4">
              <div className={`text-sm font-medium w-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.time}
              </div>
              <div className={`flex-1 px-3 py-2 rounded-lg border ${getTypeColor(item.type)}`}>
                {editingTask === item.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className={`flex-1 px-2 py-1 rounded border ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium flex items-center space-x-2">
                        <span className={item.done ? 'line-through opacity-60' : ''}>
                          {item.task}
                        </span>
                        {item.done && <span className="text-green-600 text-xs">✓</span>}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.duration}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {!item.done && (
                        <>
                          <button
                            onClick={() => handleEditTask(item.id)}
                            className={`text-xs px-2 py-1 rounded ${
                              darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            } transition-colors`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onToggleTask && onToggleTask(item.id)}
                            className={`text-xs px-2 py-1 rounded ${
                              darkMode 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            } transition-colors`}
                          >
                            Done
                          </button>
                        </>
                      )}
                      {onDeleteTask && (
                        <button
                          onClick={() => onDeleteTask(item.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            darkMode 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          } transition-colors`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {timelineItems.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No tasks scheduled. Add some tasks above!
            </div>
          )}
        </div>
      </DashboardCard>

      <TaskCreationModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onAddTask={handleCreateTask}
      />
    </>
  );
};

export default SmartSchedule; 