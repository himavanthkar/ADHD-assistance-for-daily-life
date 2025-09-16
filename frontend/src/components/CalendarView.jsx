import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SubscriptionModal from './SubscriptionModal';
import { useTheme } from '../context/ThemeContext';

const localizer = momentLocalizer(moment);

const CalendarView = ({ tasks }) => {
  const { darkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = tasks.map(task => ({
    id: task.id,
    title: task.text,
    start: new Date(task.date),
    end: new Date(task.date),
    allDay: true,
    resource: {
      isCompleted: task.done,
    },
  }));

  const eventStyleGetter = (event) => {
    const isCompleted = event.resource.isCompleted;
    let backgroundColor = isCompleted ? '#34D399' : '#3B82F6'; // Green for completed, Blue for pending
    if(darkMode) {
      backgroundColor = isCompleted ? '#10B981' : '#2563EB';
    }
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: isCompleted ? 0.7 : 1,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style,
    };
  };

  const handleAddSubscription = (url) => {
    console.log("Adding subscription for URL:", url);
    // Here we will later add the logic to fetch and parse the .ics file
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="p-6 h-[calc(100vh-100px)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Calendar
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Apple Calendar
            </button>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Connect Google Calendar
            </button>
          </div>
        </div>
        <div className={`p-4 rounded-lg h-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            style={{ height: '100%' }}
          />
        </div>
      </div>
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubscription}
      />
    </>
  );
};

export default CalendarView; 