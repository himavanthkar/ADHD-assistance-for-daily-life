import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import MainApp from './MainApp';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <TaskProvider>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/app" element={<MainApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </TaskProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 