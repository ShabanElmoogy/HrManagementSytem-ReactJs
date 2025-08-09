/* eslint-disable react/prop-types */
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  alpha,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { formatNumber, formatPercentage } from './chartUtils';

const StatCard = ({
  stats = [],
  title,
  subtitle,
  height = 'auto',
  loading = false,
  error = null,
  gradient = false,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showDividers = true,
  cardElevation = 1,
  onClick = null,
  ...props
}) => {
  const theme = useTheme();

  const renderStat = (stat, index) => {
    const {
      label,
      value,
      unit = '',
      color = 'primary',
      icon: Icon = null,
      trend = null,
      trendDirection = null, // 'up', 'down', 'neutral'
      subtitle: statSubtitle = null,
      formatValue: customFormat = null
    } = stat;

    const themeColor = theme.palette[color] || theme.palette.primary;
    const formatFn = customFormat || formatNumber;

    const getTrendColor = () => {
      if (trendDirection === 'up') return theme.palette.success.main;
      if (trendDirection === 'down') return theme.palette.error.main;
      return theme.palette.text.secondary;
    };

    return (
      <Grid item xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg} key={index}>
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            cursor: onClick ? 'pointer' : 'default',
            borderRadius: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': onClick ? {
              backgroundColor: alpha(themeColor.main, 0.05),
              transform: 'translateY(-1px)'
            } : {}
          }}
          onClick={() => onClick && onClick(stat, index)}
        >
          {/* Icon */}
          {Icon && (
            <Box sx={{ mb: 1 }}>
              <Icon 
                sx={{ 
                  fontSize: 32, 
                  color: themeColor.main,
                  opacity: 0.8
                }} 
              />
            </Box>
          )}

          {/* Main value */}
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color={themeColor.main}
            sx={{ mb: 0.5, lineHeight: 1.2 }}
          >
            {formatFn(value)}{unit}
          </Typography>

          {/* Label */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: trend ? 1 : 0, fontWeight: 500 }}
          >
            {label}
          </Typography>

          {/* Subtitle */}
          {statSubtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'block', mb: trend ? 1 : 0 }}
            >
              {statSubtitle}
            </Typography>
          )}

          {/* Trend */}
          {trend !== null && (
            <Chip
              label={`${trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''}${formatPercentage(Math.abs(trend))}`}
              size="small"
              sx={{
                backgroundColor: alpha(getTrendColor(), 0.1),
                color: getTrendColor(),
                fontWeight: 'bold',
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>
        
        {/* Divider */}
        {showDividers && index < stats.length - 1 && (
          <Divider 
            orientation={columns.xs === 1 ? 'horizontal' : 'vertical'} 
            flexItem 
            sx={{ 
              display: { 
                xs: columns.xs === 1 ? 'block' : 'none',
                sm: columns.sm === 1 ? 'block' : 'none',
                md: 'none'
              }
            }} 
          />
        )}
      </Grid>
    );
  };

  const cardContent = (
    <Card
      elevation={cardElevation}
      sx={{
        background: gradient 
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : theme.palette.background.paper,
        height: height === 'auto' ? 'auto' : height,
        ...props.sx
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        {(title || subtitle) && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            {title && (
              <Typography 
                variant="h6" 
                color="primary.main" 
                fontWeight="bold"
                gutterBottom
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Stats Grid */}
        <Grid container spacing={2} divider={showDividers ? <Divider orientation="vertical" flexItem /> : null}>
          {stats.map((stat, index) => renderStat(stat, index))}
        </Grid>
      </CardContent>
    </Card>
  );

  return cardContent;
};

export default StatCard;