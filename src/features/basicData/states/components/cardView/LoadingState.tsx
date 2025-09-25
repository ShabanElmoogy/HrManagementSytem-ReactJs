import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Skeleton
} from "@mui/material";

const LoadingState = () => {
  return (
    <Box>
      {/* Loading Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 2 }} />
      </Paper>

      {/* Loading Cards */}
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card sx={{ height: 320 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
              </CardContent>
              <CardActions>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoadingState;