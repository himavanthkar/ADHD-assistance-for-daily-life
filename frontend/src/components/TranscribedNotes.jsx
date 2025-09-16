import React, { useState, useEffect } from 'react';
import { Mic, Trash2, Download, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TranscribedNotes = () => {
  const { currentTheme, darkMode } = useTheme();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    // Filter notes based on search term
    if (searchTerm) {
      setFilteredNotes(
        notes.filter(note => 
          note.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchTerm]);

  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('voiceNotes') || '[]');
    setNotes(savedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('voiceNotes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const exportNotes = () => {
    const notesText = filteredNotes
      .map(note => `${new Date(note.timestamp).toLocaleString()}\n${note.text}\n${'='.repeat(50)}`)
      .join('\n\n');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voice-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: currentTheme.accent }}>
            <Mic size={24} style={{ color: currentTheme.primary }} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Transcribed Notes
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {notes.length} voice notes saved
            </p>
          </div>
        </div>
        
        {notes.length > 0 && (
          <button
            onClick={exportNotes}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: currentTheme.primary, 
              color: currentTheme.primary,
              backgroundColor: darkMode ? 'transparent' : currentTheme.accent
            }}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Search */}
      {notes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            style={{ focusRingColor: currentTheme.primary }}
          />
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {formatTimestamp(note.timestamp)}
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {note.text}
                  </p>
                  {note.source && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      📱 {note.source}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className={`ml-4 p-2 rounded-lg transition-colors hover:bg-red-100 ${
                    darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No notes match your search
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Mic size={48} className="mx-auto mb-4 text-gray-400" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No voice notes yet
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Use the voice assistant to create notes by saying "note" or "remember"
          </p>
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: currentTheme.accent }}>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-700' : 'text-gray-800'}`}>
              Try saying:
            </p>
            <ul className={`mt-2 text-sm space-y-1 ${darkMode ? 'text-gray-600' : 'text-gray-700'}`}>
              <li>• "Note that I need to call mom"</li>
              <li>• "Remember to buy milk"</li>
              <li>• "Write down meeting notes"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscribedNotes; 