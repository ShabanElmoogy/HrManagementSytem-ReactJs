import { SimpleTimelineChart } from "@/shared/components/charts";
import WorldMap from "@/shared/components/WorldMap";
import { Grid } from "@mui/material";
import { hrTimeline, worldData } from "./data";

const GlobalPresenceRow = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <WorldMap data={worldData} height={460} showStats />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <SimpleTimelineChart
          data={hrTimeline}
          title="Recent HR Activity"
          subtitle="Latest milestones and changes"
          height={507}
          gradient
        />
      </Grid>
    </Grid>
  );
};

export default GlobalPresenceRow;
