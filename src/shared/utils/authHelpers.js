/**
 * Authentication helper utilities
 * 
 * @module authHelpers
 */

import { clearUserData } from './authStorage';

/**
 * Handles authentication errors (401) by clearing user data and redirecting
 * 
 * @param {Function} navigate - React Router navigate function
 */
export function handleAuthError(navigate) {
  clearUserData();
  if (navigate) {
    navigate('/?login=1');
  }
}

