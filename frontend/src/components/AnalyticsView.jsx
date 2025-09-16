import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { differenceInCalendarDays, parseISO, startOfDay, getHours } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsCard = ({ title, value }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
};

const calculateStreak = (tasks) => {
  const completedDates = tasks
    .filter(task => task.done && task.completedAt)
    .map(task => startOfDay(parseISO(task.completedAt)))
    .sort((a, b) => a - b);

  if (completedDates.length === 0) return 0;

  const uniqueDates = [...new Set(completedDates.map(d => d.getTime()))].map(t => new Date(t));

  if (uniqueDates.length === 0) return 0;
  
  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    if (differenceInCalendarDays(uniqueDates[i], uniqueDates[i - 1]) === 1) {
      currentStreak++;
    } else if (differenceInCalendarDays(uniqueDates[i], uniqueDates[i - 1]) > 1) {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  // Check if the streak includes today or yesterday
  const today = startOfDay(new Date());
  const lastCompletionDay = uniqueDates[uniqueDates.length - 1];
  if (differenceInCalendarDays(today, lastCompletionDay) > 1) {
    return 0; // Streak is broken
  }

  return longestStreak;
};

const getProductivityByHour = (tasks) => {
  const completedTasks = tasks.filter(task => task.done && task.completedAt);
  const hours = Array(24).fill(0);
  completedTasks.forEach(task => {
    const hour = getHours(parseISO(task.completedAt));
    hours[hour]++;
  });
  return hours;
};

const AnalyticsView = ({ tasks }) => {
  const { darkMode } = useTheme();
  const totalCompleted = tasks.filter(task => task.done).length;
  const streak = calculateStreak(tasks);
  const productivityByHour = getProductivityByHour(tasks);

  const streakText = `${streak} ${streak === 1 ? 'day' : 'days'}`;

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Tasks Completed',
        data: productivityByHour,
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.7)',
        borderColor: darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#333',
        },
      },
      title: {
        display: true,
        text: 'Peak Productivity Hours',
        color: darkMode ? '#fff' : '#333',
        font: {
          size: 18,
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#ccc' : '#666',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        ticks: {
          color: darkMode ? '#ccc' : '#666',
          stepSize: 1
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Tasks Completed" value={totalCompleted} />
        <AnalyticsCard title="Current Daily Streak" value={streak > 0 ? `${streakText} 🔥` : streakText} />
        <AnalyticsCard title="Focus Level" value="Coming Soon" />
      </div>
      <div className={`p-6 rounded-lg shadow-md h-96 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsView;