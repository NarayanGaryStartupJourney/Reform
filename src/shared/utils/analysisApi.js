/**
 * Analysis API Utilities
 * 
 * Provides reusable functions for fetching analysis history and progress data.
 * All functions require user authentication.
 * 
 * @module analysisApi
 */

import { API_ENDPOINTS } from '../../config/api';
import { getUserToken } from './authStorage';

/**
 * Get list of analyses with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of analyses to return (default: 20)
 * @param {number} params.offset - Number of analyses to skip (default: 0)
 * @param {number} params.exercise - Filter by exercise type (1=Squat, 2=Bench, 3=Deadlift)
 * @param {number} params.minScore - Minimum score filter (0-100)
 * @param {number} params.maxScore - Maximum score filter (0-100)
 * @param {string} params.startDate - Start date filter (YYYY-MM-DD)
 * @param {string} params.endDate - End date filter (YYYY-MM-DD)
 * @returns {Promise<Object>} Analysis list response with pagination
 * @throws {Error} If request fails
 */
export async function getAnalyses({
  limit = 20,
  offset = 0,
  exercise = null,
  minScore = null,
  maxScore = null,
  startDate = null,
  endDate = null
} = {}) {
  const token = getUserToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in to view your analyses.');
  }

  // Build query string
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  if (exercise !== null) params.append('exercise', exercise.toString());
  if (minScore !== null) params.append('min_score', minScore.toString());
  if (maxScore !== null) params.append('max_score', maxScore.toString());
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await fetch(`${API_ENDPOINTS.ANALYSES}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to fetch analyses';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Get single analysis details by ID
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Full analysis details
 * @throws {Error} If request fails or analysis not found
 */
export async function getAnalysis(analysisId) {
  const token = getUserToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in to view analysis details.');
  }

  const response = await fetch(API_ENDPOINTS.ANALYSIS(analysisId), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to fetch analysis';
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Get progress metrics and trends
 * @returns {Promise<Object>} Progress metrics including statistics and trends
 * @throws {Error} If request fails
 */
export async function getProgressMetrics() {
  const token = getUserToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in to view progress metrics.');
  }

  const response = await fetch(API_ENDPOINTS.ANALYSIS_PROGRESS, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || 'Failed to fetch progress metrics';
    throw new Error(errorMessage);
  }

  return data;
}

