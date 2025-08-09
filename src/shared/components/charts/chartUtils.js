// Chart utility functions and constants

// Default color palettes
export const COLOR_PALETTES = {
  primary: [
    '#1976d2', '#42a5f5', '#90caf9', '#e3f2fd',
    '#0d47a1', '#1565c0', '#1e88e5', '#64b5f6'
  ],
  secondary: [
    '#9c27b0', '#ba68c8', '#ce93d8', '#f3e5f5',
    '#4a148c', '#6a1b9a', '#8e24aa', '#ab47bc'
  ],
  success: [
    '#2e7d32', '#4caf50', '#81c784', '#c8e6c9',
    '#1b5e20', '#388e3c', '#66bb6a', '#a5d6a7'
  ],
  warning: [
    '#ed6c02', '#ff9800', '#ffb74d', '#ffe0b2',
    '#e65100', '#f57c00', '#ff8f00', '#ffab00'
  ],
  error: [
    '#d32f2f', '#f44336', '#e57373', '#ffcdd2',
    '#b71c1c', '#c62828', '#e53935', '#ef5350'
  ],
  info: [
    '#0288d1', '#03a9f4', '#4fc3f7', '#b3e5fc',
    '#01579b', '#0277bd', '#0288d1', '#039be5'
  ],
  neutral: [
    '#424242', '#616161', '#757575', '#9e9e9e',
    '#212121', '#424242', '#616161', '#757575'
  ],
  rainbow: [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
    '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
  ]
};

// Chart dimensions
export const CHART_DIMENSIONS = {
  small: { width: '100%', height: 200 },
  medium: { width: '100%', height: 300 },
  large: { width: '100%', height: 400 },
  xlarge: { width: '100%', height: 500 }
};

// Animation configurations
export const ANIMATION_CONFIG = {
  duration: 800,
  easing: 'ease-out',
  delay: 0
};

// Format number with locale
export const formatNumber = (value, locale = 'en-US', options = {}) => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};

// Format currency
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

// Generate gradient colors
export const generateGradient = (color, steps = 5) => {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const opacity = 1 - (i * 0.2);
    colors.push(`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
  }
  return colors;
};

// Get responsive font size
export const getResponsiveFontSize = (size, breakpoint = 'md') => {
  const sizes = {
    xs: size * 0.75,
    sm: size * 0.85,
    md: size,
    lg: size * 1.1,
    xl: size * 1.2
  };
  return sizes[breakpoint] || size;
};

// Calculate chart margins
export const calculateMargins = (hasLegend, hasTitle, hasLabels) => {
  return {
    top: hasTitle ? 40 : 20,
    right: hasLegend ? 100 : 20,
    bottom: hasLabels ? 60 : 40,
    left: hasLabels ? 60 : 40
  };
};

// Data transformation utilities
export const transformDataForChart = (data, xKey, yKey, groupKey = null) => {
  if (!data || !Array.isArray(data)) return [];
  
  if (groupKey) {
    // Group data by groupKey
    const grouped = data.reduce((acc, item) => {
      const group = item[groupKey];
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([key, items]) => ({
      [xKey]: key,
      [yKey]: items.reduce((sum, item) => sum + (item[yKey] || 0), 0),
      items: items
    }));
  }
  
  return data.map(item => ({
    [xKey]: item[xKey],
    [yKey]: item[yKey],
    ...item
  }));
};

// Sort data for charts
export const sortChartData = (data, key, direction = 'desc') => {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

// Filter top N items
export const getTopItems = (data, key, count = 10) => {
  return sortChartData(data, key, 'desc').slice(0, count);
};

// Calculate statistics
export const calculateStats = (data, key) => {
  if (!data || data.length === 0) return null;
  
  const values = data.map(item => item[key]).filter(val => typeof val === 'number');
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return { sum, avg, min, max, count: values.length };
};

// Generate mock data for testing
export const generateMockData = (count = 10, type = 'bar') => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      name: categories[i % categories.length] + ` ${Math.floor(i / categories.length) + 1}`,
      value: Math.floor(Math.random() * 100) + 10,
      category: categories[i % categories.length],
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0]
    });
  }
  
  return data;
};