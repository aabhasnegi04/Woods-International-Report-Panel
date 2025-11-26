import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Inactivity timeout: 15 minutes (in milliseconds)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('woods_international_user');
    sessionStorage.removeItem('woods_international_last_activity');
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Update last activity time
    sessionStorage.setItem('woods_international_last_activity', Date.now().toString());

    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = sessionStorage.getItem('woods_international_user');
    const lastActivity = sessionStorage.getItem('woods_international_last_activity');
    
    if (savedUser && lastActivity) {
      try {
        const userData = JSON.parse(savedUser);
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        
        // Check if session has expired due to inactivity
        if (timeSinceLastActivity < INACTIVITY_TIMEOUT) {
          setUser(userData);
          resetInactivityTimer();
        } else {
          // Session expired
          sessionStorage.removeItem('woods_international_user');
          sessionStorage.removeItem('woods_international_last_activity');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        sessionStorage.removeItem('woods_international_user');
        sessionStorage.removeItem('woods_international_last_activity');
      }
    }
    setLoading(false);
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!user) return;

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [user, resetInactivityTimer]);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('woods_international_user', JSON.stringify(userData));
    sessionStorage.setItem('woods_international_last_activity', Date.now().toString());
    resetInactivityTimer();
  };

  const isAuthenticated = () => {
    return user && user.isAuthenticated;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
