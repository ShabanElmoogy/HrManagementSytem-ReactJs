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

  const getContrastColor = (hex) => {
    if (!hex) return theme.palette.text.primary;
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // Perceived luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#111' : '#fff';
  };

  const renderCustomLabel = (props) => {
    if (!showLabels) return null;
    const { x, y, payload, index } = props;
    const name = formatLabel(payload?.[nameKey] ?? '');
    const val = payload?.[dataKey] ?? 0;
    const valueStr = formatValue(val);
    const conv = Number(payload?.conversionRate ?? 0);

    // Choose segment color from palette if available for contrast calc
    const segColor = Array.isArray(colors) ? colors[index % colors.length] : undefined;
    const textColor = getContrastColor(segColor);
    const outlineColor = theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)';

    // For small slices, render compact single line with percentage
    const isSmall = conv < 12; // threshold
    const fontSize = isSmall ? 10 : 12;

    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          stroke={outlineColor}
          strokeWidth={1.4}
          paintOrder="stroke"
          fontSize={fontSize}
          fontFamily={theme.typography.fontFamily}
        >
          {isSmall ? (
            `${name} (${conv}%)`
          ) : (
            <tspan>
              <tspan x={x} dy={-4}>{name}</tspan>
              <tspan x={x} dy={12}>{valueStr}</tspan>
            </tspan>
          )}
        </text>
      </g>
    );
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