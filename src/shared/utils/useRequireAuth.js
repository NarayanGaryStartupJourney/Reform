/**
 * Custom hook to require authentication for protected routes
 * 
 * Redirects to login page if user is not authenticated
 * 
 * @param {Function} navigate - React Router navigate function
 * @param {Function} callback - Optional callback to execute if authenticated (use useCallback)
 * @returns {boolean} Whether user is authenticated
 */
import { useEffect } from 'react';
import { isUserLoggedIn } from './authStorage';

export function useRequireAuth(navigate, callback = null) {
  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/?login=1');
      return;
    }
    
    if (callback) {
      callback();
    }
  }, [navigate, callback]); // Include callback in dependencies
  
  return isUserLoggedIn();
}

