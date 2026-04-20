import { useState, useCallback } from 'react';
import { authStore } from '../features/auth/authStore';

export function useAuth() {
  const [token, setToken] = useState<string | null>(authStore.token);
  const [user, setUser] = useState<string | null>(authStore.user);

  const login = useCallback((newToken: string, newUser: string) => {
    authStore.setAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    authStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!authStore.token;
  }, []);

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated
  };
}
