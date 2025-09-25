import React from 'react';
import { Public } from '@mui/icons-material';
import { EmptyChartState as ReusableEmptyChartState } from '@/shared/components/common/feedback';

interface EmptyChartStateProps {
  t: (key: string) => string;
  onAdd?: () => void;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ t, onAdd }) => {
  return (
    <ReusableEmptyChartState
      title={t("countries.charts.title") || "Countries Analytics"}
      message={t("countries.charts.noData") || "No Countries Data Available"}
      subtitle={t("countries.noDataDescription") || "Start by adding your first country to see analytics and insights"}
      chartIcon={Public}
      emptyIcon={Public}
      actionText={onAdd ? (t("countries.addFirst") || "Add Your First Country") : undefined}
      onAction={onAdd}
      showRefresh={true}
      onRefresh={() => window.location.reload()}
      height={400}
    />
  );
};

export default EmptyChartState;