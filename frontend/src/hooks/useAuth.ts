import { useState } from 'react';
import { api } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, motDePasse: string) => {
    const { data } = await api.post('/auth/login', { email, motDePasse });
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.profile));
    setUser(data.profile);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
}
