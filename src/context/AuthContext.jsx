import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Landing route for a given role
  const homeFor = (role) =>
    role === 'admin' ? '/admin' : role === 'supervisor' ? '/supervisor' : '/dashboard';

  return (
    <AuthContext.Provider value={{ user, login, logout, homeFor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);