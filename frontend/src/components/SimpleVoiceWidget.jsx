import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const SimpleVoiceWidget = () => {
  const { currentTheme, changeMood } = useTheme();
  const { addTask, removeTask } = useTasks();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text) => {
    if (!isMuted && synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    setLastCommand(command);

    // Clean up common speech recognition errors
    const cleanCommand = lowerCommand
      .replace(/\band ask\b/g, 'add task')
      .replace(/\bbuy\b/g, 'buy')
      .replace(/\bgroceries\b/g, 'groceries')
      .replace(/\bon monday\b/g, 'on monday')
      .replace(/\band\s+/g, '')
      .trim();

    // More flexible task management commands
    if (cleanCommand.includes('add task') || cleanCommand.includes('create task') || 
        cleanCommand.includes('new task') || cleanCommand.includes('task')) {
      
      // Extract task and day with more flexible patterns
      let taskText = '';
      let day = 'today';
      
      // Try different patterns to extract task
      const patterns = [
        /(?:add task|create task|new task)\s+(.+?)(?:\s+on\s+(\w+))?$/,
        /task\s+(.+?)(?:\s+on\s+(\w+))?$/,
        /(?:add|create)\s+(.+?)(?:\s+on\s+(\w+))?$/
      ];
      
      for (const pattern of patterns) {
        const match = cleanCommand.match(pattern);
        if (match) {
          taskText = match[1].trim();
          day = match[2] || 'today';
          break;
        }
      }
      
      if (taskText) {
        try {
          const result = await addTask({
            task: taskText,
            day: day === 'today' ? getCurrentDay() : day,
            type: 'voice'
          });
          
          if (result && result.success !== false) {
            speak(`Task "${taskText}" added to ${day}`);
            // Also add to main app task list
            if (window.addTaskToMainApp) {
              window.addTaskToMainApp(taskText, day === 'today' ? new Date().toISOString().slice(0, 10) : day);
            }
          } else {
            speak('Sorry, I could not add that task');
          }
        } catch (error) {
          console.error('Error adding task:', error);
          speak('Sorry, there was an error adding the task');
        }
      } else {
        speak('I could not understand the task. Please try again.');
      }
    }
    
    else if (cleanCommand.includes('remove task') || cleanCommand.includes('delete task') || 
             cleanCommand.includes('cancel task')) {
      
      // Extract task and day for removal
      let taskText = '';
      let day = 'today';
      
      const patterns = [
        /(?:remove task|delete task|cancel task)\s+(.+?)(?:\s+from\s+(\w+))?$/,
        /(?:remove|delete|cancel)\s+(.+?)(?:\s+from\s+(\w+))?$/
      ];
      
      for (const pattern of patterns) {
        const match = cleanCommand.match(pattern);
        if (match) {
          taskText = match[1].trim();
          day = match[2] || 'today';
          break;
        }
      }
      
      if (taskText) {
        try {
          const result = await removeTask({
            task: taskText,
            day: day === 'today' ? getCurrentDay() : day
          });
          
          if (result && result.success !== false) {
            speak(`Task "${taskText}" removed from ${day}`);
          } else {
            speak('Sorry, I could not find that task');
          }
        } catch (error) {
          console.error('Error removing task:', error);
          speak('Sorry, there was an error removing the task');
        }
      }
    }
    
    // Mood commands with AI integration
    else if (cleanCommand.includes('change mood') || cleanCommand.includes('set mood') || 
             cleanCommand.includes('mood')) {
      
      const moodMatch = cleanCommand.match(/(?:change mood|set mood|mood)\s+(?:to\s+)?(\w+)/);
      if (moodMatch) {
        const mood = moodMatch[1];
        const validMoods = ['calm', 'energetic', 'focused', 'stressed', 'happy', 'neutral'];
        
        if (validMoods.includes(mood)) {
          changeMood(mood);
          speak(`Mood changed to ${mood}`);
          
          // Send to AI Agents for mood tracking
          try {
            await fetch('http://localhost:8000/mood/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mood, source: 'voice', timestamp: new Date().toISOString() })
            });
          } catch (error) {
            console.log('Could not sync mood with AI agents');
          }
        } else {
          speak(`Sorry, I don't recognize the mood "${mood}". Try calm, energetic, focused, stressed, happy, or neutral.`);
        }
      }
    }
    
    // AI assistance commands
    else if (cleanCommand.includes('analyze') || cleanCommand.includes('suggest') || 
             cleanCommand.includes('recommend')) {
      speak('Let me analyze your tasks and mood...');
      
      try {
        const response = await fetch('http://localhost:8000/analyze/productivity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tasks: Object.values(tasks).flat(),
            currentMood: currentTheme.mood || 'neutral'
          })
        });
        
        if (response.ok) {
          const analysis = await response.json();
          speak(analysis.suggestion || 'Based on your tasks, I recommend taking a short break and focusing on your top priority.');
        } else {
          speak('I am analyzing your productivity patterns. Try focusing on your most important task first.');
        }
      } catch (error) {
        speak('I recommend reviewing your task list and prioritizing the most important items.');
      }
    }
    
    // Help command
    else if (cleanCommand.includes('help') || cleanCommand.includes('what can you do') || 
             cleanCommand.includes('commands')) {
      speak('I can help you add tasks, remove tasks, change your mood, and analyze your productivity. Try saying "add task buy groceries on monday", "change mood to calm", or "analyze my tasks"');
    }
    
    // Note taking
    else if (cleanCommand.includes('note') || cleanCommand.includes('remember') || 
             cleanCommand.includes('write down')) {
      const noteMatch = cleanCommand.match(/(?:note|remember|write down)\s+(.+)/);
      if (noteMatch) {
        const noteText = noteMatch[1];
        
        // Store note in local storage for now
        const notes = JSON.parse(localStorage.getItem('voiceNotes') || '[]');
        notes.push({
          id: Date.now(),
          text: noteText,
          timestamp: new Date().toISOString(),
          source: 'voice'
        });
        localStorage.setItem('voiceNotes', JSON.stringify(notes));
        
        speak(`Note saved: ${noteText}`);
      }
    }
    
    // Default response with AI processing
    else {
      // Send to AI for general processing
      try {
        const response = await fetch('http://localhost:8000/process/general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: command })
        });
        
        if (response.ok) {
          const result = await response.json();
          speak(result.response || `I heard you say: ${command}. Try asking for help to see what I can do.`);
        } else {
          speak(`I heard you say: ${command}. Try asking for help to see what I can do.`);
        }
      } catch (error) {
        speak(`I heard you say: ${command}. Try asking for help to see what I can do.`);
      }
    }
  };

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // Cancel any ongoing speech
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 p-4 rounded-lg border">
        <p className="text-sm text-gray-600">Voice features not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border-2 p-4 min-w-[300px]"
         style={{ borderColor: currentTheme.primary }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">🎤 Voice Assistant</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <button
            onClick={toggleListening}
            className={`p-2 rounded-lg transition-all ${
              isListening 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
      </div>

      {/* Status */}
      {isListening && (
        <div className="bg-blue-50 p-2 rounded-lg mb-3 border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">🎧 Listening...</p>
          {transcript && (
            <p className="text-xs text-blue-600 mt-1">"{transcript}"</p>
          )}
        </div>
      )}

      {/* Last Command */}
      {lastCommand && (
        <div className="bg-green-50 p-2 rounded-lg mb-3 border-l-4 border-green-400">
          <p className="text-xs text-green-600">Last: "{lastCommand}"</p>
        </div>
      )}

      {/* Quick Commands */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Try saying:</p>
        <div className="text-xs text-gray-500 space-y-1">
          <div>• "Add task buy groceries on Monday"</div>
          <div>• "Remove task meeting from Tuesday"</div>
          <div>• "Change mood to calm"</div>
          <div>• "Help" - for more commands</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVoiceWidget; 