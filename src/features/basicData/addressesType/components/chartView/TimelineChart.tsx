import { LineChart } from '@/shared/components/charts';
import { Card, CardContent, CardHeader } from '@mui/material';
import React from 'react';
import { TimelineData } from './chartDataUtils';

interface TimelineChartProps {
  data: TimelineData[];
  t: (key: string) => string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data, t }) => {
  return (
    <Card elevation={2}>
      <CardHeader 
        title={t("addressTypes.charts.timeline") || "Address Types Added Over Time"}
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent>
        <LineChart
          data={data}
          xKey="month"
          yKey="count"
          height={300}
          colors="blue"
          showGrid={true}
          showTooltip={true}
          curve="monotone"
        />
      </CardContent>
    </Card>
  );
};

export default TimelineChart;