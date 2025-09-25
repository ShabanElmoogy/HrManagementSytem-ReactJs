import React from 'react';
import { BarChart } from '../../../../../shared/components/charts';
import { COLOR_PALETTES } from '../../../../../shared/components/charts/chartUtils';

interface RegionData {
  name: string;
  value: number;
}

interface RegionBarChartProps {
  data: RegionData[];
  t: (key: string) => string;
}

const RegionBarChart: React.FC<RegionBarChartProps> = ({ data, t }) => {
  return (
    <BarChart
      data={data}
      title={t("countries.charts.byRegion") || "Countries by Region"}
      xKey="name"
      yKey="value"
      height={400}
      colors={COLOR_PALETTES.primary}
      showGrid={true}
      showTooltip={true}
      barRadius={4}
      orientation="vertical"
      formatValue={(value) => value.toString()}
      formatLabel={(label) => label} 
      subtitle={undefined}    />
  );
};

export default RegionBarChart;