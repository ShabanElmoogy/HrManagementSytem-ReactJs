import React from 'react';
import { ChartContainer } from '../../../../../shared/components/charts';

interface EmptyChartStateProps {
  t: (key: string) => string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ t }) => {
  const emptyError = {
    message: t("countries.noDataDescription") || "Start by adding your first country"
  };

  return (
    <ChartContainer
      title={t("countries.charts.title") || "Countries Analytics"}
      error={emptyError}
      height={400} 
      subtitle={undefined} 
      children={undefined}    >
      {/* Content will be handled by ChartContainer's error state */}
    </ChartContainer>
  );
};

export default EmptyChartState;