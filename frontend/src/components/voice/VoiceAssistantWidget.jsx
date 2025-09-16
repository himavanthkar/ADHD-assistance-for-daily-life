import React, { useState, useEffect, useMemo } from 'react';
import Vapi from '@vapi-ai/web';
import { useTasks } from '../../context/TaskContext';

// Initialize Vapi outside of the component
const vapi = import.meta.env.VITE_VAPI_PUBLIC_KEY 
    ? new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)
    : null;

const VoiceAssistantWidget = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const { tasks, addTask, removeTask, lastAction, isLoading } = useTasks();

    const vapiAssistantConfig = useMemo(() => ({
        model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful task management assistant for the NeuroBoost app. 
                    You can help users add, modify, and manage their tasks for different days of the week.
                    When users want to add tasks, use the addTask function. When they want to remove one, use removeTask.
                    Be conversational and confirm actions taken. Always specify the day of the week clearly.`
                }
            ]
        },
        voice: {
            provider: "elevenlabs",
            voiceId: "pNInz6obpgDQGcFmaJgB"
        },
        functions: [
            {
                name: "addTask",
                description: "Add a new task to a specific day of the week",
                parameters: {
                    type: "object",
                    properties: {
                        task: { type: "string", description: "The task description or title" },
                        day: { 
                            type: "string", 
                            description: "Day of the week", 
                            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] 
                        },
                        type: { type: "string", description: "Type of task (workout, assignment, etc.)", default: "general" }
                    },
                    required: ["task", "day"]
                }
            },
            {
                name: "removeTask",
                description: "Remove a task from a specific day",
                parameters: {
                    type: "object",
                    properties: {
                        task: { type: "string", description: "The task to remove" },
                        day: { 
                            type: "string", 
                            description: "Day of the week",
                            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                        }
                    },
                    required: ["task", "day"]
                }
            }
        ],
    }), []);

    useEffect(() => {
        if (!vapi) return;

        const handleFunctionCall = async (functionCall) => {
            console.log('Function call received:', functionCall);
            
            let result;
            if (functionCall.name === 'addTask') {
                result = await addTask(functionCall.parameters);
            } else if (functionCall.name === 'removeTask') {
                result = await removeTask(functionCall.parameters);
            } else {
                result = { success: false, message: `Unknown function: ${functionCall.name}` };
            }
            return result;
        };

        const onCallStart = () => setIsCallActive(true);
        const onCallEnd = () => setIsCallActive(false);
        const onError = (error) => {
            console.error('VAPI Error:', error);
            setIsCallActive(false);
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);
        vapi.on('function-call', handleFunctionCall);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
            vapi.off('function-call', handleFunctionCall);
        };
    }, [addTask, removeTask]);

    const handleVoiceCall = async () => {
        if (!vapi) {
            alert('Voice assistant is not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.');
            return;
        }
        if (isCallActive) {
            vapi.stop();
        } else {
            try {
                await vapi.start(vapiAssistantConfig);
            } catch (error) {
                console.error('Failed to start call:', error);
                alert('Failed to start voice assistant. Please check your permissions and configuration.');
            }
        }
    };

    const getTotalTasks = () => {
        return Object.values(tasks).reduce((total, dayTasks) => total + (dayTasks?.length || 0), 0);
    };

    if (!vapi) {
        return null; // Or render a disabled state
    }

    return (
        <div className="fixed bottom-10 right-10 z-50">
            {/* Task Summary */}
            {getTotalTasks() > 0 && (
                <div className="mb-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Voice Tasks ({getTotalTasks()})</h3>
                    {Object.entries(tasks).map(([day, dayTasks]) => 
                        dayTasks && dayTasks.length > 0 && (
                            <div key={day} className="mb-2">
                                <div className="text-xs font-medium text-gray-600 capitalize">{day}</div>
                                {dayTasks.map(task => (
                                    <div key={task.id} className="text-xs text-gray-500 ml-2">
                                        • {task.text}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    {lastAction && (
                        <div className="text-xs text-green-600 mt-2 font-medium">
                            ✓ {lastAction}
                        </div>
                    )}
                </div>
            )}

            {/* Voice Button */}
            <button
                onClick={handleVoiceCall}
                disabled={isLoading}
                className={`w-16 h-16 rounded-full text-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center relative
                    ${isCallActive 
                        ? 'bg-red-500 animate-pulse' 
                        : isLoading 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                aria-label={isCallActive ? 'End call' : 'Start voice assistant'}
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isCallActive ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {/* Status indicator */}
            {isCallActive && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            )}
        </div>
    );
};

export default VoiceAssistantWidget; 