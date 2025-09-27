import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import type { AddressType } from "../types/AddressType";
import { BarChart } from "@/shared/components/charts";
import { EmptyChartState } from "@/shared/components/common/feedback";

interface AddressTypesChartViewProps {
  items: AddressType[];
  loading: boolean;
  onAdd?: () => void;
  t: (key: string) => string;
}

// Prepare counts by initial letter (A, B, C, ...)
const prepareInitialData = (items: AddressType[]): { name: string; value: number }[] => {
  const counts: Record<string, number> = {};
  items.forEach((it) => {
    const first = (it.nameEn || it.nameAr || "?").trim().charAt(0).toUpperCase() || "?";
    const key = /[A-Z]/.test(first) ? first : "?";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Prepare monthly timeline counts (YYYY-MM)
const prepareMonthlyTimeline = (items: AddressType[]): { name: string; value: number }[] => {
  const timeline: Record<string, number> = {};
  items.forEach((it) => {
    const created = (it as any).createdOn;
    if (created) {
      const month = new Date(created).toISOString().slice(0, 7); // YYYY-MM
      timeline[month] = (timeline[month] || 0) + 1;
    }
  });
  return Object.entries(timeline)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const AddressTypesChartView: React.FC<AddressTypesChartViewProps> = ({ items, loading, onAdd, t }) => {
  // Show empty state when no data
  if (!loading && (!items || items.length === 0)) {
    return (
      <EmptyChartState
        title={t("addressTypes.title") || "Address Types"}
        subtitle={t("addressTypes.noDataDescription") || "Start by adding your first address type"}
        actionText={onAdd ? (t("addressTypes.add") || "Add Address Type") : undefined}
        onAction={onAdd}
        height={400}
      />
    );
  }

  const initialData = useMemo(() => prepareInitialData(items || []), [items]);
  const monthlyData = useMemo(() => prepareMonthlyTimeline(items || []), [items]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* By Initial Letter */}
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChart
            data={initialData}
            xKey="name"
            yKey="value"
            title={t("addressTypes.byInitial") || "Address Types by Initial Letter"}
            height={380}
            loading={loading}
            colors="teal"
          />
        </Grid>

        {/* Timeline by Month */}
        <Grid size={{ xs: 12, md: 6 }}>
          <BarChart
            data={monthlyData}
            xKey="name"
            yKey="value"
            title={t("addressTypes.timeline") || "Address Types Added Over Time"}
            height={380}
            loading={loading}
            colors="blue"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressTypesChartView;
