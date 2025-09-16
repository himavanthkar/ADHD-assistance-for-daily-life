import React, { createContext, useState, useContext, useCallback } from 'react';

const TaskContext = createContext();
const VOICE_SERVICE_URL = import.meta.env.VITE_VOICE_SERVICE_URL || 'http://localhost:8002';

export const useTasks = () => useContext(TaskContext);

const initialTasks = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [lastAction, setLastAction] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const addTask = useCallback(async ({ task, day, type = 'general' }) => {
        setIsLoading(true);
        try {
            // Update local state optimistically
            const dayKey = day.toLowerCase();
            const newTask = {
                id: `task_${Date.now()}`,
                text: task,
                type: type,
                done: false,
                createdAt: new Date().toISOString(),
                source: 'voice'
            };
            setTasks(prev => ({
                ...prev,
                [dayKey]: [...(prev[dayKey] || []), newTask]
            }));

            // Call the new voice-service backend
            const response = await fetch(`${VOICE_SERVICE_URL}/tasks/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task, day, type })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add task via service');
            }

            const result = await response.json();
            setLastAction(`Added "${task}" to ${day}`);
            return result; // Forward success message from backend
        } catch (error) {
            console.error('Error adding task:', error);
            // Optionally revert optimistic update here
            setLastAction('');
            return { success: false, message: `Failed to add task: ${error.message}` };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeTask = useCallback(async ({ task, day }) => {
        setIsLoading(true);
        try {
            const dayKey = day.toLowerCase();
            // Optimistic update
            setTasks(prev => ({
                ...prev,
                [dayKey]: prev[dayKey].filter(t => 
                    !t.text.toLowerCase().includes(task.toLowerCase())
                )
            }));

            // Call the new voice-service backend
            const response = await fetch(`${VOICE_SERVICE_URL}/tasks/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task, day })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to remove task via service');
            }

            const result = await response.json();
            setLastAction(`Removed "${task}" from ${day}`);
            return result; // Forward success message from backend
        } catch (error) {
            console.error('Error removing task:', error);
            // Optionally revert optimistic update here
            setLastAction('');
            return { success: false, message: `Failed to remove task: ${error.message}` };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        tasks,
        addTask,
        removeTask,
        lastAction,
        isLoading
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}; 