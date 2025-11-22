// Plot data preparation utilities

export const padArrayToLength = (dataArray, targetLength) => {
  if (!Number.isInteger(targetLength) || targetLength < 0) return [];
  if (!dataArray) return Array(targetLength).fill(null);
  if (dataArray.length >= targetLength) return [...dataArray];
  return [...dataArray, ...Array(targetLength - dataArray.length).fill(null)];
};

export const padMultipleArrays = (arrays, targetLength) => {
  if (!arrays || typeof arrays !== 'object') return {};
  const result = {};
  for (const [key, value] of Object.entries(arrays)) {
    result[key] = padArrayToLength(value, targetLength);
  }
  return result;
};

export const calculateChartMinWidth = (frameCount, pixelsPerFrame = 3, minWidth = 1200) => {
  return Number.isInteger(frameCount) && frameCount >= 0
    ? Math.max(frameCount * pixelsPerFrame, minWidth)
    : minWidth;
};

export const calculateMinMaxFromArrays = (arrays, padding = 10, defaults = { min: 0, max: 100 }) => {
  if (!Array.isArray(arrays) || arrays.length === 0) return defaults;
  
  const allValues = arrays
    .flatMap(arr => Array.isArray(arr) ? arr.filter(v => v != null && typeof v === 'number' && !Number.isNaN(v)) : [])
    .filter(v => typeof v === 'number' && !Number.isNaN(v));

  if (allValues.length === 0) return defaults;
  
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  return { min: min - padding, max: max + padding };
};

