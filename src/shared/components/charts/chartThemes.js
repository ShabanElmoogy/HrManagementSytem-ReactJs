// Chart theme configurations

export const getChartTheme = (muiTheme) => ({
  // Grid styles
  grid: {
    stroke: muiTheme.palette.divider,
    strokeDasharray: '3 3',
    strokeOpacity: 0.5
  },
  
  // Axis styles
  axis: {
    tick: {
      fontSize: 12,
      fill: muiTheme.palette.text.secondary,
      fontFamily: muiTheme.typography.fontFamily
    },
    line: {
      stroke: muiTheme.palette.divider
    },
    label: {
      fontSize: 14,
      fill: muiTheme.palette.text.primary,
      fontWeight: 500
    }
  },
  
  // Tooltip styles
  tooltip: {
    contentStyle: {
      backgroundColor: muiTheme.palette.background.paper,
      border: `1px solid ${muiTheme.palette.divider}`,
      borderRadius: muiTheme.shape.borderRadius,
      boxShadow: muiTheme.shadows[4],
      color: muiTheme.palette.text.primary,
      fontSize: 12,
      fontFamily: muiTheme.typography.fontFamily
    },
    cursor: {
      fill: muiTheme.palette.action.hover
    }
  },
  
  // Legend styles
  legend: {
    wrapperStyle: {
      fontSize: 12,
      color: muiTheme.palette.text.secondary,
      fontFamily: muiTheme.typography.fontFamily
    }
  },
  
  // Colors based on theme
  colors: {
    primary: muiTheme.palette.primary.main,
    secondary: muiTheme.palette.secondary.main,
    success: muiTheme.palette.success.main,
    warning: muiTheme.palette.warning.main,
    error: muiTheme.palette.error.main,
    info: muiTheme.palette.info.main
  },
  
  // Gradients
  gradients: {
    primary: `linear-gradient(135deg, ${muiTheme.palette.primary.light} 0%, ${muiTheme.palette.primary.main} 100%)`,
    secondary: `linear-gradient(135deg, ${muiTheme.palette.secondary.light} 0%, ${muiTheme.palette.secondary.main} 100%)`,
    success: `linear-gradient(135deg, ${muiTheme.palette.success.light} 0%, ${muiTheme.palette.success.main} 100%)`,
    warning: `linear-gradient(135deg, ${muiTheme.palette.warning.light} 0%, ${muiTheme.palette.warning.main} 100%)`,
    error: `linear-gradient(135deg, ${muiTheme.palette.error.light} 0%, ${muiTheme.palette.error.main} 100%)`,
    info: `linear-gradient(135deg, ${muiTheme.palette.info.light} 0%, ${muiTheme.palette.info.main} 100%)`
  }
});

// Dark theme adjustments
export const getDarkThemeAdjustments = (muiTheme) => ({
  grid: {
    strokeOpacity: 0.3
  },
  tooltip: {
    contentStyle: {
      backgroundColor: muiTheme.palette.grey[800],
      border: `1px solid ${muiTheme.palette.grey[700]}`
    }
  }
});

// Chart-specific themes
export const CHART_THEMES = {
  minimal: {
    grid: false,
    axis: {
      axisLine: false,
      tickLine: false
    }
  },
  
  modern: {
    borderRadius: 8,
    gradient: true,
    shadow: true
  },
  
  classic: {
    grid: true,
    border: true,
    legend: true
  },
  
  clean: {
    grid: false,
    border: false,
    minimal: true
  }
};