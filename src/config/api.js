/**
 * API Configuration
 * Uses environment variables for production, defaults to localhost for development
 */

const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://127.0.0.1:8000';
};

export const API_URL = getApiUrl();
export const API_ENDPOINTS = {
  UPLOAD_VIDEO: `${API_URL}/upload-video`,
  HEALTH: `${API_URL}/health`,
  ROOT: `${API_URL}/`,
  CHECK_ANONYMOUS_LIMIT: `${API_URL}/api/check-anonymous-limit`,
  SIGNUP: `${API_URL}/api/auth/signup`,
  LOGIN: `${API_URL}/api/auth/login`,
  ME: `${API_URL}/api/auth/me`,
  CHANGE_PASSWORD: `${API_URL}/api/auth/change-password`,
  UPDATE_USERNAME: `${API_URL}/api/auth/update-username`
};

// Only log API URL in development mode for security
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL:', API_URL);
  console.log('🔗 Upload endpoint:', API_ENDPOINTS.UPLOAD_VIDEO);
}

