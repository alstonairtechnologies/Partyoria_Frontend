import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Check authentication status on every render
  const checkAuth = () => {
    const storedUser = sessionStorage.getItem('partyoria_user') || localStorage.getItem('partyoria_user');
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  };
  
  checkAuth();

  const login = (email: string, password: string) => {
    // Get users from JSON data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = { ...user };
      delete userData.password; // Remove password from stored data
      
      // Debug: Log user data
      console.log('Login successful for user:', userData);
      console.log('User isVendor flag:', userData.isVendor);
      
      sessionStorage.setItem('partyoria_user', JSON.stringify(userData));
      localStorage.setItem('partyoria_user', JSON.stringify(userData));
      setUser(userData);
      
      // Trigger user login event to update dashboard
      window.dispatchEvent(new CustomEvent('userLogin'));
      
      return true;
    }
    return false;
  };

  const register = (userData: any) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    sessionStorage.removeItem('partyoria_user');
    localStorage.removeItem('partyoria_user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isError: false,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}