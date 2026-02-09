import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios with base URL for API
axios.defaults.baseURL = 'https://abcde-assignment-lfpx.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      setLoggedIn(true);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axios.post('/users/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Force logout on frontend even if API fails
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken('');
      setUser(null);
      setLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;