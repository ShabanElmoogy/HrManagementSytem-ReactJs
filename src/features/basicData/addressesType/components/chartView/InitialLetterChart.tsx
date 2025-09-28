import { BarChart } from '@/shared/components/charts';
import { Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';
import { InitialLetterData } from './chartDataUtils';

interface InitialLetterChartProps {
  data: InitialLetterData[];
  t: (key: string) => string;
}

const InitialLetterChart: React.FC<InitialLetterChartProps> = ({ data, t }) => {
  return (
    <Card elevation={2}>
      <CardHeader 
        title={t("addressTypes.charts.byInitialLetter") || "Address Types by Initial Letter"}
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <BarChart
          data={data}
          xKey="name"
          yKey="value"
          height={300}
          colors="teal"
          showGrid={true}
          showTooltip={true}
        />
      </CardContent>
    </Card>
  );
};

export default InitialLetterChart;