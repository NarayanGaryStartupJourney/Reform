/**
 * Score utility functions
 */

/**
 * Get color CSS variable based on score
 * @param {number} score - Score value (0-100)
 * @returns {string} CSS variable for score color
 */
export const getScoreColor = (score) => {
  if (score >= 90) return 'var(--score-excellent)';
  if (score >= 75) return 'var(--score-good)';
  if (score >= 60) return 'var(--score-warning)';
  return 'var(--score-poor)';
};

