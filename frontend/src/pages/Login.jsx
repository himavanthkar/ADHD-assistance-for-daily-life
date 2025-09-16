import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { darkMode } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/app');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (type) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (type === 'admin') {
        result = await login('admin@neuroboost.com', 'admin123');
      } else if (type === 'demo') {
        result = await login('demo@neuroboost.com', 'demo123');
      }
      
      if (result.success) {
        navigate('/app');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
      <div className={`w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
            <div className="inline-block">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-7 h-7 text-white" />
                </div>
            </div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign in to your account</h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Or <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-400">create a new account</Link>
          </p>
        </div>

        {/* Quick Login Credentials */}
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quick Login:</h3>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full text-left px-3 py-2 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
            >
              👑 Admin: admin@neuroboost.com / admin123
            </button>
            <button
              onClick={() => quickLogin('demo')}
              className="w-full text-left px-3 py-2 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              🎮 Demo: demo@neuroboost.com / demo123
            </button>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              autoComplete="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
            />
          </div>
          <div>
            <label htmlFor="password" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              autoComplete="current-password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${darkMode ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
            Google
          </button>
          <button type="button" className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${darkMode ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
            Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 