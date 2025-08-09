/* eslint-disable react/prop-types */
import { Box, Paper, Typography, Skeleton, useTheme, alpha } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const ChartContainer = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  height = 400,
  elevation = 2,
  gradient = false,
  icon: Icon = TrendingUp,
  actions = null,
  ...props
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper elevation={elevation} sx={{ p: 3, ...props.sx }}>
        {title && <Skeleton variant="text" width="30%" height={32} />}
        <Skeleton variant="rectangular" width="100%" height={height} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={elevation} sx={{ p: 3, ...props.sx }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height,
            textAlign: 'center',
            color: 'error.main'
          }}
        >
          <Typography variant="h6" color="error">
            Error loading chart
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {error.message || 'An unexpected error occurred'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        background: gradient
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : theme.palette.background.paper,
        ...props.sx
      }}
    >
      {(title || actions) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3
          }}
        >
          <Box>
            {title && (
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {Icon && <Icon sx={{ mr: 1 }} />}
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box sx={{ ml: 2 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}
      
      <Box sx={{ height, width: '100%' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default ChartContainer;