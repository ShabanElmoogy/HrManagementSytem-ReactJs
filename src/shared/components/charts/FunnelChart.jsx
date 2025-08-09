/* eslint-disable react/prop-types */
import { ResponsiveContainer, FunnelChart as RechartsFunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { useTheme } from '@mui/material';
import { getChartTheme } from './chartThemes';
import { COLOR_PALETTES, formatNumber, formatPercentage } from './chartUtils';
import ChartContainer from './ChartContainer';

const FunnelChart = ({
  data = [],
  title,
  subtitle,
  height = 400,
  colors = COLOR_PALETTES.primary,
  showTooltip = true,
  showLabels = true,
  loading = false,
  error = null,
  gradient = false,
  dataKey = 'value',
  nameKey = 'name',
  formatValue = (value) => formatNumber(value),
  formatLabel = (label) => label,
  onSegmentClick = null,
  labelPosition = 'center', // 'center', 'insideStart', 'insideEnd'
  ...props
}) => {
  const theme = useTheme();
  const chartTheme = getChartTheme(theme);

  // Calculate conversion rates
  const dataWithConversion = data.map((item, index) => {
    const conversionRate = index === 0 ? 100 : ((item[dataKey] / data[0][dataKey]) * 100);
    return {
      ...item,
      conversionRate: conversionRate.toFixed(1)
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div style={chartTheme.tooltip.contentStyle}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{formatLabel(data[nameKey])}</p>
        <p style={{ margin: '4px 0', color: payload[0].color }}>
          Value: {formatValue(data[dataKey])}
        </p>
        <p style={{ margin: '4px 0', color: payload[0].color }}>
          Conversion: {data.conversionRate}%
        </p>
      </div>
    );
  };

  const renderCustomLabel = (entry) => {
    if (!showLabels) return null;
    return `${formatLabel(entry[nameKey])}: ${formatValue(entry[dataKey])}`;
  };

  const handleSegmentClick = (data, index) => {
    if (onSegmentClick) {
      onSegmentClick(data, index);
    }
  };

  const chartContent = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsFunnelChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Funnel
          dataKey={dataKey}
          data={dataWithConversion}
          isAnimationActive
          onClick={handleSegmentClick}
        >
          {dataWithConversion.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke={theme.palette.background.paper}
              strokeWidth={2}
            />
          ))}
          {showLabels && (
            <LabelList 
              position={labelPosition}
              fill={theme.palette.text.primary}
              stroke="none"
              fontSize={12}
              fontFamily={theme.typography.fontFamily}
              content={renderCustomLabel}
            />
          )}
        </Funnel>
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
      </RechartsFunnelChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      height={height}
      loading={loading}
      error={error}
      gradient={gradient}
      {...props}
    >
      {chartContent}
    </ChartContainer>
  );
};

export default FunnelChart;