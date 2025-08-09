/* eslint-disable react/prop-types */
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  alpha,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { formatNumber, formatPercentage } from './chartUtils';

const MetricCard = ({
  title,
  value,
  previousValue = null,
  target = null,
  unit = '',
  icon: Icon = null,
  color = 'primary',
  showTrend = true,
  showProgress = false,
  showTarget = false,
  formatValue = (value) => formatNumber(value),
  onClick = null,
  elevation = 2,
  gradient = false,
  size = 'medium', // 'small', 'medium', 'large'
  ...props
}) => {
  const theme = useTheme();

  // Calculate trend
  const trend = previousValue !== null ? value - previousValue : 0;
  const trendPercentage = previousValue !== null && previousValue !== 0 
    ? ((value - previousValue) / Math.abs(previousValue)) * 100 
    : 0;

  // Calculate progress towards target
  const progress = target !== null ? Math.min((value / target) * 100, 100) : 0;

  // Get trend icon and color
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp fontSize="small" />;
    if (trend < 0) return <TrendingDown fontSize="small" />;
    return <TrendingFlat fontSize="small" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 2,
      titleVariant: 'body2',
      valueVariant: 'h6',
      iconSize: 32,
      avatarSize: 40
    },
    medium: {
      padding: 3,
      titleVariant: 'body1',
      valueVariant: 'h4',
      iconSize: 40,
      avatarSize: 56
    },
    large: {
      padding: 4,
      titleVariant: 'h6',
      valueVariant: 'h3',
      iconSize: 48,
      avatarSize: 64
    }
  };

  const config = sizeConfig[size];
  const themeColor = theme.palette[color] || theme.palette.primary;

  return (
    <Card
      elevation={elevation}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        background: gradient 
          ? `linear-gradient(135deg, ${alpha(themeColor.light, 0.1)} 0%, ${alpha(themeColor.main, 0.05)} 100%)`
          : theme.palette.background.paper,
        border: `1px solid ${alpha(themeColor.main, 0.2)}`,
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
          borderColor: themeColor.main,
        } : {},
        ...props.sx
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: config.padding }}>
        {/* Header with icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={config.titleVariant} 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
          </Box>
          
          {Icon && (
            <Avatar
              sx={{
                width: config.avatarSize,
                height: config.avatarSize,
                backgroundColor: alpha(themeColor.main, 0.1),
                color: themeColor.main,
                ml: 2
              }}
            >
              <Icon sx={{ fontSize: config.iconSize * 0.6 }} />
            </Avatar>
          )}
        </Box>

        {/* Main value */}
        <Box sx={{ mb: showTrend || showProgress || showTarget ? 2 : 0 }}>
          <Typography 
            variant={config.valueVariant} 
            fontWeight="bold" 
            color={themeColor.main}
            sx={{ lineHeight: 1.2 }}
          >
            {formatValue(value)}{unit}
          </Typography>
        </Box>

        {/* Trend indicator */}
        {showTrend && previousValue !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: getTrendColor(),
                backgroundColor: alpha(getTrendColor(), 0.1),
                borderRadius: 1,
                px: 1,
                py: 0.5
              }}
            >
              {trend > 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                {formatPercentage(Math.abs(trendPercentage))}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              vs previous period
            </Typography>
          </Box>
        )}

        {/* Progress towards target */}
        {showProgress && target !== null && (
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress to target
              </Typography>
              <Typography variant="caption" color={themeColor.main} fontWeight="bold">
                {formatPercentage(progress)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(themeColor.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: themeColor.main,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {/* Target chip */}
        {showTarget && target !== null && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Chip
              label={`Target: ${formatValue(target)}${unit}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: themeColor.main,
                color: themeColor.main,
                fontSize: '0.75rem'
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;