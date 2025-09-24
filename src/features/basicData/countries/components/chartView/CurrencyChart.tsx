import { BarChart } from '@/shared/components/charts';
import { COLOR_PALETTES } from '@/shared/components/charts/chartUtils';
import React from 'react';

interface CurrencyData {
  name: string;
  value: number;
}

interface CurrencyChartProps {
  data: CurrencyData[];
  t: (key: string) => string;
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({ data, t }) => {
  return (
    <BarChart
      data={data}
      title={t("countries.charts.topCurrencies") || "Top Currencies"}
      xKey="name"
      yKey="value"
      height={400}
      colors={COLOR_PALETTES.secondary}
      showGrid={true}
      showTooltip={true}
      barRadius={4}
      orientation="horizontal"
      formatValue={(value) => value.toString()}
      formatLabel={(label) => label}
      subtitle={undefined} />
  );
};

export default CurrencyChart;