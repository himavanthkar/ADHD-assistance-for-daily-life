import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Sidebar from './components/Sidebar';
import DailyPKGSummary from './components/DailyPKGSummary';
import TodoList from './components/TodoList';
import SmartSchedule from './components/SmartSchedule';
import MotivationCard from './components/MotivationCard';
import WeeklyTasksView from './components/WeeklyTasksView';
import LevelUpStatus from './components/LevelUpStatus';
import CalendarView from './components/CalendarView';
import CBTPomodoroFlow from './components/CBTPomodoroFlow';
import AnalyticsView from './components/AnalyticsView';
import SettingsPage from './components/SettingsPage';
import AdminDashboard from './components/AdminDashboard';
import TranscribedNotes from './components/TranscribedNotes';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import SimpleVoiceWidget from './components/SimpleVoiceWidget';
import { supabase } from './services/supabase';

const notificationSound = new Audio('https://orangefreesounds.com/wp-content/uploads/2020/04/Alert-notification.mp3');
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

function MainApp() {
  const { darkMode } = useTheme();
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mood, setMood] = useState('focused');
  const [profilePic, setProfilePic] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // Use currentUser.id if available, otherwise use a fallback
      const userId = currentUser?.id || 'demo';
      console.log('Loading tasks for user:', userId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        // If RLS error, try without user filter
        if (error.code === 'PGRST116') {
          console.log('Trying to load all tasks due to RLS...');
          const { data: allData, error: allError } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (allError) {
            console.error('Error loading all tasks:', allError);
            // Fallback to demo tasks
            setDemoTasks();
            return;
          }
          
          // Transform and set tasks
          const transformedTasks = allData.map(task => ({
            id: task.id,
            text: task.text,
            done: task.done,
            date: task.date,
            completedAt: task.completed_at,
            type: task.type,
            energy_required: task.energy_required,
            difficulty: task.difficulty,
            source: task.source
          }));
          
          setTasks(transformedTasks);
          setTotalCompletedTasks(transformedTasks.filter(t => t.done).length);
          return;
        }
        // Fallback to demo tasks
        setDemoTasks();
        return;
      }

      // Transform Supabase data to match frontend format
      const transformedTasks = data.map(task => ({
        id: task.id,
        text: task.text,
        done: task.done,
        date: task.date,
        completedAt: task.completed_at,
        type: task.type,
        energy_required: task.energy_required,
        difficulty: task.difficulty,
        source: task.source
      }));

      console.log('Loaded tasks:', transformedTasks);
      setTasks(transformedTasks);
      setTotalCompletedTasks(transformedTasks.filter(t => t.done).length);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Fallback to demo tasks
      setDemoTasks();
    } finally {
      setLoading(false);
    }
  };

  // Set demo tasks for immediate functionality
  const setDemoTasks = () => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    const demoTasks = [
      {
        id: 1,
        text: "Complete math assignment",
        done: true,
        date: today,
        completedAt: new Date().toISOString(),
        type: "personal",
        energy_required: "high",
        difficulty: "hard",
        source: "manual"
      },
      {
        id: 2,
        text: "Review chemistry notes",
        done: false,
        date: today,
        completedAt: null,
        type: "personal",
        energy_required: "medium",
        difficulty: "medium",
        source: "manual"
      },
      {
        id: 3,
        text: "Write history essay outline",
        done: false,
        date: tomorrow,
        completedAt: null,
        type: "personal",
        energy_required: "high",
        difficulty: "hard",
        source: "manual"
      },
      {
        id: 4,
        text: "Buy groceries",
        done: false,
        date: dayAfter,
        completedAt: null,
        type: "personal",
        energy_required: "low",
        difficulty: "easy",
        source: "voice"
      }
    ];
    
    setTasks(demoTasks);
    setTotalCompletedTasks(demoTasks.filter(t => t.done).length);
  };

  // Load tasks on component mount and when user changes
  useEffect(() => {
    if (currentUser) {
      loadTasks();
    }
  }, [currentUser]);

  // Check if user is admin
  useEffect(() => {
    if (currentUser) {
      setIsAdmin(currentUser.email === 'admin@neuroboost.com');
    }
  }, [currentUser]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      if (data.event === 'tasks_updated' && data.tasks) {
        const newTasks = data.tasks.tasks.map(task => ({
          id: task.id || Date.now() + Math.random(),
          text: task.title,
          done: false,
          date: task.due_date || new Date().toISOString().slice(0, 10),
          completedAt: null
        }));
        
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
        notificationSound.play();
      }
      
      if (data.event === 'mood_updated' && data.mood) {
          setMood(data.mood.mood);
          notificationSound.play();
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Optional: implement reconnection logic here
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // CBT Timer state
  const [cbtMode, setCbtMode] = useState(true);
  const [cbtTimeLeft, setCbtTimeLeft] = useState(15 * 60);
  const [cbtTimerActive, setCbtTimerActive] = useState(false);

  const handleProfilePicChange = (newPic) => {
    setProfilePic(newPic);
  };

  // CBT Timer effect
  useEffect(() => {
    if (!cbtTimerActive) return;

    const timer = setInterval(() => {
      setCbtTimeLeft(prevTime => {
        if (prevTime <= 1) {
          notificationSound.play();
          // Switch mode and set time for the next phase
          if (cbtMode) {
            setCbtMode(false);
            return 10 * 60; // Play Zone duration
          } else {
            setCbtMode(true);
            return 15 * 60; // CBT duration
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cbtMode, cbtTimerActive]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const isNowDone = !task.done;
      
      // Update local state immediately
      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { 
            ...task, 
            done: isNowDone, 
            completedAt: isNowDone ? new Date().toISOString() : null 
          };
        }
        return task;
      }));

      // Update completed count
      if (isNowDone) {
        setTotalCompletedTasks(prevCount => prevCount + 1);
      } else {
        setTotalCompletedTasks(prevCount => Math.max(0, prevCount - 1));
      }
      
      // Try to sync with Supabase in the background
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ 
            done: isNowDone, 
            completed_at: isNowDone ? new Date().toISOString() : null 
          })
          .eq('id', id);

        if (error) {
          console.error('Error syncing task toggle to Supabase:', error);
          // Task is already updated in local state, so user can still use it
        }
      } catch (error) {
        console.error('Error syncing task toggle:', error);
        // Task is already updated in local state, so user can still use it
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleAddTask = async (taskInput, date) => {
    // Handle both simple text input and comprehensive task object
    let taskData;
    
    if (typeof taskInput === 'string') {
      // Simple text input (from quick add)
      if (taskInput.trim() === '') return;
      taskData = {
        text: taskInput.trim(),
        date: date || new Date().toISOString().slice(0, 10),
        time: null,
        priority: 'medium',
        energy_required: 'medium',
        difficulty: 'medium',
        deadline: null,
        done: false,
        type: 'personal',
        source: 'manual'
      };
    } else {
      // Comprehensive task object (from modal)
      taskData = {
        text: taskInput.text.trim(),
        date: taskInput.date,
        time: taskInput.time,
        priority: taskInput.priority,
        energy_required: taskInput.energy_required,
        difficulty: taskInput.difficulty,
        deadline: taskInput.deadline || null,
        done: false,
        type: 'personal',
        source: 'manual'
      };
    }
    
    // Create new task with local ID for immediate UI update
    const newTask = {
      id: Date.now() + Math.random(), // Local ID for immediate use
      ...taskData
    };

    // Add to local state immediately
    setTasks([newTask, ...tasks]);
    
    // Try to sync with Supabase in the background
    try {
      const userId = currentUser?.id || 'demo';
      console.log('Syncing task to Supabase for user:', userId);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          text: taskData.text,
          done: taskData.done,
          date: taskData.date,
          time: taskData.time,
          priority: taskData.priority,
          energy_required: taskData.energy_required,
          difficulty: taskData.difficulty,
          deadline: taskData.deadline,
          type: taskData.type,
          source: taskData.source
        })
        .select()
        .single();

      if (error) {
        console.error('Error syncing task to Supabase:', error);
        // Task is already in local state, so user can still use it
        return;
      }

      // Update local task with Supabase ID if successful
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === newTask.id 
            ? { ...task, id: data.id }
            : task
        )
      );
    } catch (error) {
      console.error('Error syncing task:', error);
      // Task is already in local state, so user can still use it
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      // Remove from local state immediately
      const taskToDelete = tasks.find(t => t.id === id);
      setTasks(tasks.filter(task => task.id !== id));
      
      // Update completed count if task was done
      if (taskToDelete?.done) {
        setTotalCompletedTasks(prevCount => Math.max(0, prevCount - 1));
      }
      
      // Try to sync with Supabase in the background
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error syncing task deletion to Supabase:', error);
          // Task is already removed from local state, so user can still use it
        }
      } catch (error) {
        console.error('Error syncing task deletion:', error);
        // Task is already removed from local state, so user can still use it
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClearAllTasks = () => {
    if (window.confirm("Are you sure you want to delete all tasks for this week? This action cannot be undone.")) {
      setTasks([]);
    }
  };

  const handleClearTodaysTasks = () => {
    if (window.confirm("Are you sure you want to delete all of today's tasks?")) {
      const today = new Date().toISOString().slice(0, 10);
      setTasks(tasks.filter(task => task.date !== today));
    }
  };

  const startCbtTimer = () => {
    setCbtTimerActive(true);
  };

  const stopCbtTimer = () => {
    setCbtTimerActive(false);
  };

  const resetCbtTimer = () => {
    setCbtTimerActive(false);
    setCbtMode(true);
    setCbtTimeLeft(15 * 60);
  };

  const skipToPlayZone = () => {
    setCbtMode(false);
    setCbtTimeLeft(10 * 60);
    setCbtTimerActive(true);
  };

  // Global function for voice integration
  useEffect(() => {
    window.addTaskToMainApp = (text, date) => {
      handleAddTask(text, date);
    };
    
    return () => {
      delete window.addTaskToMainApp;
    };
  }, []);

  const handleEditTask = async (id, newText) => {
    try {
      // Update local state immediately
      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { ...task, text: newText };
        }
        return task;
      }));
      
      // Try to sync with Supabase in the background
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ text: newText })
          .eq('id', id);

        if (error) {
          console.error('Error syncing task edit to Supabase:', error);
          // Task is already updated in local state, so user can still use it
        }
      } catch (error) {
        console.error('Error syncing task edit:', error);
        // Task is already updated in local state, so user can still use it
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DailyPKGSummary />
        <LevelUpStatus xp={totalCompletedTasks} />
        <TodoList
          tasks={tasks.filter(t => t.date === new Date().toISOString().slice(0, 10))}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onAdd={(text) => handleAddTask(text, new Date().toISOString().slice(0, 10))}
          onClear={handleClearTodaysTasks}
          className="lg:col-span-2"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartSchedule 
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
        <MotivationCard mood={mood} />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tasks':
        return <WeeklyTasksView
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onAdd={handleAddTask}
          onClearAll={handleClearAllTasks}
        />;
      case 'gamification':
        return <LevelUpStatus
          xp={totalCompletedTasks}
          isFullPage={true}
        />;
      case 'notes':
        return <TranscribedNotes />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'cbt':
        return <CBTPomodoroFlow
          cbtMode={cbtMode}
          cbtTimeLeft={cbtTimeLeft}
          cbtTimerActive={cbtTimerActive}
          startCbtTimer={startCbtTimer}
          stopCbtTimer={stopCbtTimer}
          resetCbtTimer={resetCbtTimer}
          skipToPlayZone={skipToPlayZone}
        />;
      case 'analytics':
        return <AnalyticsView tasks={tasks} />;
      case 'settings':
        return <SettingsPage onProfilePicChange={handleProfilePicChange} profilePic={profilePic}/>;
      case 'admin':
        return <AdminDashboard />;
      case 'voice':
        return <SimpleVoiceWidget />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar
          mood={mood}
          onTabChange={handleTabChange}
          profilePic={profilePic}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Always visible voice assistant */}
      <SimpleVoiceWidget />
    </div>
  );
}

export default MainApp;
