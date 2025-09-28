import { EmptyState } from '@/shared/components/common/feedback';
import { Add, BarChart } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface EmptyChartStateProps {
  t: (key: string) => string;
  onAdd?: () => void;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ t, onAdd }) => {
  return (
    <Card elevation={2} sx={{ minHeight: 400, display: 'flex', alignItems: 'center' }}>
      <CardContent sx={{ width: '100%' }}>
        <EmptyState
          icon={BarChart}
          title={t("addressTypes.noData") || "No Address Types Available"}
          subtitle={t("addressTypes.noDataDescription") || "Start by adding your first address type to see analytics"}
          action={
            onAdd ? (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAdd}
                size="large"
              >
                {t("addressTypes.add") || "Add Address Type"}
              </Button>
            ) : undefined
          }
        />
      </CardContent>
    </Card>
  );
};

export default EmptyChartState;