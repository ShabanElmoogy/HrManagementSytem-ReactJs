import { SparklineChart } from "@/shared/components/charts";
import { GroupAdd, Schedule } from "@mui/icons-material";
import {
  alpha,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  sparklineHiring,
  sparklineOvertime,
  sparklineSatisfaction,
  timeToHireDays,
} from "./QuickInsights/data";

const QuickInsights = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ width: { xs: "100%", md: "auto" }, alignItems: "stretch" }}>
      {/* Hires (last 7d) */}
      <Grid size={{ xs: 12, md: 3.4 }} sx={{ display: "flex" }}>
        <Paper
          sx={{
            p: 1.25,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <GroupAdd color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Hires (7d)
              </Typography>
              <SparklineChart
                data={sparklineHiring}
                type="bar"
                width={100}
                height={40}
                color={theme.palette.primary.main}
                showValue
                valueKey="value"
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Time to Hire */}
      <Grid size={{ xs: 12, md: 2.6 }} sx={{ display: "flex" }}>
        <Paper
          sx={{
            p: 1.25,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Schedule color="success" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Time-to-Hire
              </Typography>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color="success.main"
              >
                {timeToHireDays} days
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Employee Satisfaction */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
        <Paper
          sx={{
            p: 1.25,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Satisfaction (7d)
              </Typography>
              <SparklineChart
                data={sparklineSatisfaction}
                type="line"
                width={100}
                height={40}
                color={theme.palette.info.main}
                showValue
                valueKey="value"
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Overtime Hours */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex" }}>
        <Paper
          sx={{
            p: 1.25,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Overtime (7d)
              </Typography>
              <SparklineChart
                data={sparklineOvertime}
                type="bar"
                width={100}
                height={40}
                color={theme.palette.warning.main}
                showValue
                valueKey="value"
              />
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default QuickInsights;
