import React from 'react';
import { ChartContainer } from '../../../../../shared/components/charts';

interface EmptyChartStateProps {
  t: (key: string) => string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ t }) => {
  const emptyError = {
    message: t("states.noDataDescription") || "Start by adding your first state"
  };

  return (
    <ChartContainer
      title={t("states.charts.title") || "States Analytics"}
      error={emptyError}
      height={400}
      subtitle={undefined}
      children={undefined}
    >
      {/* Content will be handled by ChartContainer's error state */}
    </ChartContainer>
  );
};

export default EmptyChartState;