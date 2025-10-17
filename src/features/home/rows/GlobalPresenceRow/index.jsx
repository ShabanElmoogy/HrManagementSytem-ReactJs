import React from "react";
import { Grid } from "@mui/material";
import { SimpleTimelineChart } from "@/shared/components/charts";
import WorldMap from "@/shared/components/WorldMap";
import { hrTimeline, worldData } from "./data";

const GlobalPresenceRow = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={7}>
        <WorldMap data={worldData} height={460} showStats />
      </Grid>
      <Grid item xs={12} lg={5}>
        <SimpleTimelineChart
          data={hrTimeline}
          title="Recent HR Activity"
          subtitle="Latest milestones and changes"
          height={460}
          gradient
        />
      </Grid>
    </Grid>
  );
};

export default GlobalPresenceRow;
