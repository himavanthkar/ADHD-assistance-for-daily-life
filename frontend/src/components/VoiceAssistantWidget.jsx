import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || '38a5bc22-1c43-4d10-95b6-29dcad2aa65d');

const vapiAssistantConfig = {
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful task management assistant for the NeuroBoost app. 
        You can help users add, modify, and manage their tasks for different days of the week.
        When users want to add tasks, use the addTask function. When they want to remove one, use removeTask.
        Be conversational and confirm actions taken.`
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
          day: { type: "string", description: "Day of the week", enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
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
          day: { type: "string", description: "Day of the week" }
        },
        required: ["task", "day"]
      }
    }
  ],
  serverUrl: "https://2b59-2607-f140-400-39-3071-598e-3edf-4736.ngrok-free.app/vapi-webhook"
};


const VoiceAssistantWidget = () => {
    const [isCallActive, setIsCallActive] = useState(false);

    useEffect(() => {
        vapi.on('call-start', () => setIsCallActive(true));
        vapi.on('call-end', () => setIsCallActive(false));
        vapi.on('error', (e) => {
            console.error('VAPI Error:', e);
            setIsCallActive(false);
        });

        return () => {
            vapi.removeAllListeners();
        };
    }, []);

    const handleVoiceCall = () => {
        if (isCallActive) {
            vapi.stop();
        } else {
            vapi.start(vapiAssistantConfig);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            <button
                onClick={handleVoiceCall}
                className={`w-24 h-24 rounded-full text-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center
          ${isCallActive ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}
                aria-label={isCallActive ? 'End call' : 'Start voice assistant'}
            >
                {isCallActive ?
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072" /></svg>
                    :
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm5 9.5a.5.5 0 01.5.5h-5a.5.5 0 010-1h4.5zM3 9a1 1 0 00-1 1v1a7 7 0 0014 0v-1a1 1 0 10-2 0v1a5 5 0 01-10 0v-1a1 1 0 00-1-1z" /></svg>
                }
            </button>
        </div>
    );
};

export default VoiceAssistantWidget; 