import React from "react";
import { Grid, useTheme } from "@mui/material";
import { GaugeChart, FunnelChart } from "@/shared/components/charts";
import { recruitmentFunnel, engagementScore, complianceScore } from "./data";

const HealthPipelineRow = () => {
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <GaugeChart
          value={engagementScore}
          maxValue={100}
          title="Employee Engagement"
          subtitle="Company-wide engagement index"
          height={300}
          gradient
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <GaugeChart
          value={complianceScore}
          maxValue={100}
          colors={[theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main]}
          title="Policy Compliance"
          subtitle="Mandatory trainings & policy checks"
          height={300}
          gradient
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FunnelChart
          data={recruitmentFunnel}
          title="Recruitment Pipeline"
          subtitle="Application to hire conversion"
          height={300}
          showLabels
          gradient
        />
      </Grid>
    </Grid>
  );
};

export default HealthPipelineRow;
