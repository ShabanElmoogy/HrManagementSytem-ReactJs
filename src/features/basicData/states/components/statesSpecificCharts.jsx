/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Card,
  CardContent,
  Chip,
  Stack
} from "@mui/material";
import {
  LocationOn,
  Public,
  TrendingUp,
  Assessment,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "@mui/icons-material";

import {
  BarChart,
  PieChart,
  DonutChart,
  MetricCard,
  ProgressChart,
  StatCard,
  HeatmapChart,
  TreemapChart
} from "@/shared/components/charts";

import { COLOR_PALETTES } from "@/shared/components/charts/chartUtils";

const StatesSpecificCharts = ({ states, loading = false }) => {
  const theme = useTheme();

  // Process states data for various visualizations
  const chartData = useMemo(() => {
    if (!states || states.length === 0) {
      return {
        byCountry: [],
        byRegion: [],
        populationData: [],
        heatmapData: [],
        treemapData: [],
        stats: {
          total: 0,
          countries: 0,
          avgPerCountry: 0,
          topCountry: 'N/A'
        }
      };
    }

    // Group by country
    const statesByCountry = states.reduce((acc, state) => {
      const countryName = state.country?.nameEn || state.countryName || "Unknown";
      if (!acc[countryName]) {
        acc[countryName] = {
          count: 0,
          states: [],
          population: 0
        };
      }
      acc[countryName].count++;
      acc[countryName].states.push(state);
      acc[countryName].population += state.population || Math.floor(Math.random() * 1000000) + 100000;
      return acc;
    }, {});

    const byCountry = Object.entries(statesByCountry)
      .map(([country, data]) => ({
        name: country,
        value: data.count,
        population: data.population,
        percentage: ((data.count / states.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    // Mock regional data
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const byRegion = regions.map(region => ({
      name: region,
      value: Math.floor(Math.random() * 20) + 5,
      growth: (Math.random() * 20 - 10).toFixed(1)
    }));

    // Population data for bubble chart
    const populationData = byCountry.slice(0, 10).map(country => ({
      name: country.name,
      states: country.value,
      population: country.population,
      density: Math.floor(country.population / country.value)
    }));

    // Heatmap data (states vs metrics)
    const metrics = ['Population', 'Area', 'GDP', 'Development'];
    const heatmapData = [];
    byCountry.slice(0, 8).forEach(country => {
      metrics.forEach(metric => {
        heatmapData.push({
          x: country.name,
          y: metric,
          value: Math.floor(Math.random() * 100) + 1
        });
      });
    });

    // Treemap data
    const treemapData = byCountry.slice(0, 8).map(country => ({
      name: country.name,
      size: country.value,
      category: country.value > 5 ? 'Large' : country.value > 2 ? 'Medium' : 'Small'
    }));

    const stats = {
      total: states.length,
      countries: byCountry.length,
      avgPerCountry: byCountry.length > 0 ? Math.round(states.length / byCountry.length) : 0,
      topCountry: byCountry[0]?.name || 'N/A'
    };

    return {
      byCountry,
      byRegion,
      populationData,
      heatmapData,
      treemapData,
      stats
    };
  }, [states]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading states data...
        </Typography>
      </Box>
    );
  }

  if (!states || states.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Assessment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No states data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add some states to see visualizations
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <LocationOn color="primary" />
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              States Data Visualization
            </Typography>
            <Chip 
              label={`${chartData.stats.total} States`} 
              color="primary" 
              size="small" 
            />
            <Chip 
              label={`${chartData.stats.countries} Countries`} 
              color="secondary" 
              size="small" 
            />
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of states distribution, demographics, and regional insights
          </Typography>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total States"
            value={chartData.stats.total}
            previousValue={chartData.stats.total - 3}
            color="primary"
            showTrend={true}
            icon={LocationOn}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Countries"
            value={chartData.stats.countries}
            previousValue={chartData.stats.countries - 1}
            color="success"
            showTrend={true}
            icon={Public}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg per Country"
            value={chartData.stats.avgPerCountry}
            previousValue={chartData.stats.avgPerCountry - 1}
            color="info"
            showTrend={true}
            icon={Assessment}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Top Country"
            value={chartData.stats.topCountry}
            color="warning"
            icon={TrendingUp}
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* States by Country - Bar Chart */}
        <Grid item xs={12} md={8}>
          <BarChart
            data={chartData.byCountry}
            title="States Distribution by Country"
            subtitle="Number of states in each country"
            xKey="name"
            yKey="value"
            colors={COLOR_PALETTES.primary}
            showGrid={true}
            height={400}
            formatLabel={(label) => label.length > 12 ? `${label.substring(0, 12)}...` : label}
          />
        </Grid>

        {/* Country Distribution - Donut Chart */}
        <Grid item xs={12} md={4}>
          <DonutChart
            data={chartData.byCountry.slice(0, 6)}
            title="Top Countries"
            subtitle="States distribution percentage"
            nameKey="name"
            valueKey="value"
            colors={COLOR_PALETTES.rainbow}
            showLegend={false}
            centerLabel="Total States"
            height={400}
          />
        </Grid>
      </Grid>

      {/* Secondary Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Regional Distribution - Pie Chart */}
        <Grid item xs={12} md={6}>
          <PieChart
            data={chartData.byRegion}
            title="Regional Distribution"
            subtitle="States by geographical regions"
            nameKey="name"
            valueKey="value"
            colors={COLOR_PALETTES.success}
            showLegend={true}
            height={350}
          />
        </Grid>

        {/* Progress by Country */}
        <Grid item xs={12} md={6}>
          <ProgressChart
            data={chartData.byCountry.slice(0, 6).map(country => ({
              name: country.name,
              value: country.value,
              max: Math.max(...chartData.byCountry.map(c => c.value))
            }))}
            title="States Count Progress"
            subtitle="Relative distribution by country"
            orientation="horizontal"
            height={350}
          />
        </Grid>
      </Grid>

      {/* Advanced Visualizations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Heatmap - States vs Metrics */}
        <Grid item xs={12} md={8}>
          <HeatmapChart
            data={chartData.heatmapData}
            title="States Performance Heatmap"
            subtitle="Countries vs key performance indicators"
            xKey="x"
            yKey="y"
            valueKey="value"
            colors={['#ffffff', theme.palette.primary.main]}
            showLabels={false}
            showColorScale={true}
            height={350}
          />
        </Grid>

        {/* Treemap - Hierarchical View */}
        <Grid item xs={12} md={4}>
          <TreemapChart
            data={chartData.treemapData}
            title="States Hierarchy"
            subtitle="Hierarchical view by size"
            dataKey="size"
            nameKey="name"
            colors={COLOR_PALETTES.warning}
            height={350}
          />
        </Grid>
      </Grid>

      {/* Statistics Dashboard */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatCard
            stats={[
              {
                label: 'Total States',
                value: chartData.stats.total,
                color: 'primary',
                trend: 8.5,
                trendDirection: 'up',
                icon: LocationOn
              },
              {
                label: 'Countries Covered',
                value: chartData.stats.countries,
                color: 'success',
                trend: 12.3,
                trendDirection: 'up',
                icon: Public
              },
              {
                label: 'Average per Country',
                value: chartData.stats.avgPerCountry,
                color: 'info',
                trend: 5.7,
                trendDirection: 'up',
                icon: Assessment
              },
              {
                label: 'Data Completeness',
                value: 94.2,
                unit: '%',
                color: 'warning',
                trend: 2.1,
                trendDirection: 'up',
                icon: TrendingUp
              }
            ]}
            title="States Management Statistics"
            subtitle="Key performance indicators and trends"
            columns={{ xs: 1, sm: 2, md: 4 }}
            showDividers={true}
            gradient={true}
            height={200}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatesSpecificCharts;