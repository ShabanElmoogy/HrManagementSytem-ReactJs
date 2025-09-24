import React from 'react';
import { PieChart } from '../../../../../shared/components/charts';
import { COLOR_PALETTES } from '../../../../../shared/components/charts/chartUtils';

interface RegionData {
  name: string;
  value: number;
}

interface RegionPieChartProps {
  data: RegionData[];
  colors: string[];
  t: (key: string) => string;
}

const RegionPieChart: React.FC<RegionPieChartProps> = ({ data, colors, t }) => {
  return (
    <PieChart
      data={data}
      title={t("countries.charts.regionDistribution") || "Region Distribution"}
      nameKey="name"
      valueKey="value"
      height={400}
      colors={colors.length > 0 ? colors : COLOR_PALETTES.rainbow}
      showLegend={false}
      showTooltip={true}
      showLabels={true}
      outerRadius={120}
      formatValue={(value) => value.toString()}
      formatLabel={(label) => label}
      customLabel={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
    />
  );
};

export default RegionPieChart;