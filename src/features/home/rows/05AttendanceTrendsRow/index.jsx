import React from "react";
import { Grid, useTheme } from "@mui/material";
import { HeatmapChart, BarChart } from "@/shared/components/charts";
import { attendanceHeatmapData, microTrends, formatHeatmapLabel } from "./data";

const AttendanceTrendsRow = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <HeatmapChart
          data={attendanceHeatmapData}
          title="Attendance Heatmap"
          subtitle="Weekday vs hour in-office density"
          height={360}
          xKey="x"
          yKey="y"
          valueKey="value"
          colors={[theme.palette.grey[200], theme.palette.primary.main]}
          formatLabel={formatHeatmapLabel}
          showColorScale
          gradient
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <BarChart
          data={microTrends}
          xKey="name"
          yKey="value"
          title="Micro-Trends (14d)"
          subtitle="In-office rate, last 2 weeks"
          height={360}
          colors="success"
          showGrid
          gradient
        />
      </Grid>
    </Grid>
  );
};

export default AttendanceTrendsRow;
