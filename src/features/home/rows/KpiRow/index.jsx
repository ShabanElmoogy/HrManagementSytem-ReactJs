import { MetricCard, SparklineChart } from "@/shared/components/charts";
import {
  MonetizationOn,
  PeopleAlt,
  Public as PublicIcon,
  WorkOutline,
} from "@mui/icons-material";
import { Box, Grid, useTheme } from "@mui/material";
import { kpisCore, openPositionsByDept, payrollTrend6m } from "./data";

const KpiRow = () => {
  const theme = useTheme();

  const kpis = kpisCore.map((kpi) => ({
    ...kpi,
    icon:
      kpi.title === "Total Employees"
        ? PeopleAlt
        : kpi.title === "Open Positions"
        ? WorkOutline
        : kpi.title === "Monthly Payroll"
        ? MonetizationOn
        : PublicIcon,
  }));

  return (
    <Grid container spacing={2}>
      {kpis.map((kpi, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title={kpi.title}
            value={kpi.value}
            previousValue={kpi.previousValue}
            target={kpi.target}
            icon={kpi.icon}
            color={kpi.color}
            showTrend
            showProgress
            showTarget
            gradient
            variant="elevated"
            subtitle={kpi.description}
          />
        </Grid>
      ))}

      {/* Additional KPI charts */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Payroll Trend"
          value={payrollTrend6m[payrollTrend6m.length - 1].value}
          previousValue={payrollTrend6m[payrollTrend6m.length - 2].value}
          target={4_000_000}
          icon={MonetizationOn}
          color="success"
          showTrend
          showProgress
          showTarget
          gradient
          variant="elevated"
          subtitle="Last 6 months"
          description={"Cumulative gross payroll"}
        />
        <Box sx={{ mt: 1, px: 1 }}>
          <SparklineChart
            data={payrollTrend6m}
            type="area"
            width={220}
            height={50}
            color={theme.palette.success.main}
            showValue
            valueKey="value"
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Open Roles by Dept"
          value={openPositionsByDept.reduce((s, d) => s + d.value, 0)}
          previousValue={46}
          target={40}
          icon={WorkOutline}
          color="secondary"
          showTrend
          showProgress
          showTarget
          gradient
          variant="elevated"
          subtitle="Active requisitions"
          description="Distribution across departments"
        />
      </Grid>
    </Grid>
  );
};

export default KpiRow;
