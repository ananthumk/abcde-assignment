import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const response = await axios.post('/users/', { name, email, password });
        login(response.data.token);
        setName('');
        setEmail('');
        setPassword('');
        setError('');
      } else {
        if (!email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const response = await axios.post('/users/login', { email, password });
        login(response.data.token);
        setEmail('');
        setPassword('');
        setError('');
      }
    } catch (err) {
      console.error('Error:', err);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = 'You are already logged in on another device. Please logout first.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.error || 'Invalid email/password';
        } else if (err.response.status === 409) {
          errorMessage = err.response.data?.error || 'Email already exists. Please choose a different one.';
        } else if (err.response.status === 500) {
          errorMessage = err.response.data?.error || 'Server error. Please try again.';
        } else {
          errorMessage = err.response.data?.error || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">E-Commerce</h1>
        <p className="text-center text-gray-600 mb-6">Shop Smart, Live Better</p>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegister ? 'Create Account' : 'Login'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              <>
                {isRegister ? <UserPlus className="mr-2" size={20} /> : <LogIn className="mr-2" size={20} />}
                {isRegister ? 'Register' : 'Login'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              {isRegister ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;