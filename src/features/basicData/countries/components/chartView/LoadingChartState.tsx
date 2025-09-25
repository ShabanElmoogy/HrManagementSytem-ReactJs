import React from 'react';
import { ChartContainer } from '../../../../../shared/components/charts';

interface LoadingChartStateProps {
  t: (key: string) => string;
}

const LoadingChartState: React.FC<LoadingChartStateProps> = ({ t }) => {
  return (
    <ChartContainer
      title={t("countries.charts.title") || "Countries Analytics"}
      loading={true}
      height={400} 
      subtitle={undefined} 
      children={undefined}    >
      {/* Content will be handled by ChartContainer's loading state */}
    </ChartContainer>
  );
};

export default LoadingChartState;