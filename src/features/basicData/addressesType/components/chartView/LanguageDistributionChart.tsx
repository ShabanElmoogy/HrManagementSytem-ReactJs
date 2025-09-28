import { PieChart } from '@/shared/components/charts';
import { Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';
import { LanguageData, getChartColors } from './chartDataUtils';

interface LanguageDistributionChartProps {
  data: LanguageData[];
  t: (key: string) => string;
}

const LanguageDistributionChart: React.FC<LanguageDistributionChartProps> = ({ data, t }) => {
  const colors = getChartColors();

  return (
    <Card elevation={2}>
      <CardHeader 
        title={t("addressTypes.charts.languageDistribution") || "Language Distribution"}
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <PieChart
          data={data}
          nameKey="name"
          valueKey="value"
          height={300}
          colors={colors}
          showLegend={true}
          showTooltip={true}
        />
      </CardContent>
    </Card>
  );
};

export default LanguageDistributionChart;