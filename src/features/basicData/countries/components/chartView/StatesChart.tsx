import React from 'react';
import { BarChart } from '@/shared/components/charts';
import { StatesData } from './chartDataUtils';

interface StatesChartProps {
  data: StatesData[];
  t: (key: string) => string;
}

const StatesChart: React.FC<StatesChartProps> = ({ data, t }) => {
  // Transform data for the bar chart
  const chartData = data.map((item) => ({
    name: item.name,
    states: item.statesCount,
    total: item.totalStates,
  }));

  return (
    <BarChart
      title={t("countries.charts.statesByCountry") || "States by Country"}
      subtitle={t("countries.charts.statesByCountryDesc") || "Top countries with most states"}
      data={chartData}
      xAxisKey="name"
      yAxisKeys={[
        {
          key: 'states',
          name: t("countries.charts.activeStates") || 'Active States',
          color: '#2196F3',
        }
      ]}
      height={400}
      showLegend={true}
      showTooltip={true}
      showGrid={true}
    />
  );
};

export default StatesChart;