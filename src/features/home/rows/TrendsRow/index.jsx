import React from "react";
import { Grid, useTheme } from "@mui/material";
import { LineChart, DonutChart, AreaChart, BarChart } from "@/shared/components/charts";
import { monthlyTrend, monthlySeriesKeys, departmentDistribution, monthlyNetAdds } from "./data";

const TrendsRow = () => {
  const theme = useTheme();
  const monthlySeries = [
    { key: monthlySeriesKeys[0].key, name: monthlySeriesKeys[0].name, color: theme.palette.primary.main },
    { key: monthlySeriesKeys[1].key, name: monthlySeriesKeys[1].name, color: theme.palette.success.main },
    { key: monthlySeriesKeys[2].key, name: monthlySeriesKeys[2].name, color: theme.palette.error.main },
  ];

  return (
    <Grid container spacing={2}>
      {/* Row 1: Existing trends */}
      <Grid item xs={12} md={7}>
        <LineChart
          data={monthlyTrend}
          xKey="month"
          height={320}
          title="Headcount & Hiring Trends"
          subtitle="Track headcount growth with hires and attrition"
          multiSeries={monthlySeries}
          showLegend
          showGrid
          gradient
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <DonutChart
          data={departmentDistribution}
          title="Workforce by Department"
          subtitle="Distribution across key functions"
          height={320}
          showLegend
          centerLabel="Employees"
          gradient
        />
      </Grid>

      {/* Row 2: Additional trends */}
      <Grid item xs={12} md={7}>
        <AreaChart
          data={monthlyNetAdds}
          xKey="month"
          yKey="net"
          title="Monthly Net Adds"
          subtitle="Hires minus attrition"
          height={280}
          showGrid
          smooth
          gradient
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <BarChart
          data={monthlyTrend}
          xKey="month"
          title="Hires vs Attrition"
          subtitle="Monthly comparison"
          height={280}
          showGrid
          showLegend
          multiSeries={[
            { key: "hires", name: "Hires", color: theme.palette.success.main },
            { key: "attrition", name: "Attrition", color: theme.palette.error.main },
          ]}
          stacked={false}
          gradient
        />
      </Grid>
    </Grid>
  );
};

export default TrendsRow;
