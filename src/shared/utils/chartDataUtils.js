import { formatDateOnly } from './dateFormat';

const EXERCISE_COLORS = {
  'Squat': { border: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)', point: '#4CAF50', hover: '#66BB6A' },
  'Bench': { border: '#2196F3', bg: 'rgba(33, 150, 243, 0.15)', point: '#2196F3', hover: '#42A5F5' },
  'Deadlift': { border: '#FF9800', bg: 'rgba(255, 152, 0, 0.15)', point: '#FF9800', hover: '#FFB74D' },
  'Overall': { border: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)', point: '#4CAF50', hover: '#66BB6A' }
};

const BAR_CHART_COLORS = [
  { bg: 'rgba(76, 175, 80, 0.8)', border: '#4CAF50' },
  { bg: 'rgba(33, 150, 243, 0.8)', border: '#2196F3' },
  { bg: 'rgba(255, 152, 0, 0.8)', border: '#FF9800' },
  { bg: 'rgba(156, 39, 176, 0.8)', border: '#9C27B0' },
  { bg: 'rgba(244, 67, 54, 0.8)', border: '#F44336' }
];

export function getScoreTrendData(metrics) {
  if (!metrics?.score_trend || metrics.score_trend.length === 0) {
    return null;
  }

  const sortedTrend = [...metrics.score_trend].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  const allDates = [...new Set(sortedTrend.map(item => item.date))].sort((a, b) => 
    new Date(a) - new Date(b)
  );
  const labels = allDates.map(date => formatDateOnly(date));

  const exerciseGroups = {};
  sortedTrend.forEach(item => {
    const exercise = item.exercise || 'Overall';
    if (!exerciseGroups[exercise]) {
      exerciseGroups[exercise] = {};
    }
    exerciseGroups[exercise][item.date] = item.score;
  });

  const datasets = Object.keys(exerciseGroups).map(exercise => {
    const color = EXERCISE_COLORS[exercise] || EXERCISE_COLORS['Overall'];
    const data = allDates.map(date => exerciseGroups[exercise][date] || null);
    
    return {
      label: exercise,
      data: data,
      borderColor: color.border,
      backgroundColor: color.bg,
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: color.point,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: color.hover,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 3,
      spanGaps: false
    };
  });

  return {
    labels,
    datasets
  };
}

export function getExerciseBreakdownData(metrics) {
  if (!metrics?.analyses_by_exercise) {
    return null;
  }

  const exerciseNames = {
    'Squat': 'Squat',
    'Bench': 'Bench',
    'Deadlift': 'Deadlift'
  };

  const labels = Object.keys(metrics.analyses_by_exercise).map(
    key => exerciseNames[key] || key
  );
  const data = Object.values(metrics.analyses_by_exercise);
  const maxValue = Math.max(...data, 0);

  return {
    labels,
    datasets: [
      {
        label: 'Number of Analyses',
        data,
        backgroundColor: labels.map((_, i) => BAR_CHART_COLORS[i % BAR_CHART_COLORS.length].bg),
        borderColor: labels.map((_, i) => BAR_CHART_COLORS[i % BAR_CHART_COLORS.length].border),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }
    ],
    maxValue
  };
}

export function getComputedColor(cssVar, fallback) {
  if (typeof window === 'undefined') return fallback;
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
  return value || fallback;
}

export function getChartColors() {
  return {
    text: getComputedColor('--text-primary', '#333333'),
    textSecondary: getComputedColor('--text-secondary', '#666666'),
    grid: getComputedColor('--border-color', 'rgba(0, 0, 0, 0.1)')
  };
}

export function getBaseChartOptions(colors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: colors.text,
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 500
          },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        ticks: {
          color: colors.textSecondary,
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        },
        grid: {
          color: colors.grid,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: colors.textSecondary,
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          stepSize: 1,
          precision: 0
        },
        grid: {
          color: colors.grid,
          drawBorder: false
        },
        beginAtZero: true
      }
    }
  };
}

