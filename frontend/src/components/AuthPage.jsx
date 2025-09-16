import React from 'react';
import AuthModal from './AuthModal';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧠 NeuroBoost</h1>
          <p className="text-white/80">AI-Powered ADHD Productivity Platform</p>
        </div>
        <AuthModal isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
};

export default AuthPage; 