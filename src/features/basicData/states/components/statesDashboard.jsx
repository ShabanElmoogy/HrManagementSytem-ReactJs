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
  Stack,
  Avatar,
  Divider,
  LinearProgress,
  Paper
} from "@mui/material";
import {
  LocationOn,
  Public,
  TrendingUp,
  Assessment,
  Flag,
  Language,
  People,
  Analytics,
  Star,
  DataUsage,
  Timeline,
  BarChart as BarChartIcon
} from "@mui/icons-material";

import {
  BarChart,
  PieChart,
  DonutChart,
  MetricCard,
  ProgressChart,
  HeatmapChart,
  TreemapChart,
  LineChart,
  AreaChart
} from "@/shared/components/charts";

import { COLOR_PALETTES } from "@/shared/components/charts/chartUtils";

const StatesDashboard = ({ states, loading = false }) => {
  const theme = useTheme();

  // Process states data for dashboard visualizations
  const dashboardData = useMemo(() => {
    if (!states || states.length === 0) {
      return {
        overview: { total: 0, countries: 0, avgPerCountry: 0, topCountry: 'N/A' },
        byCountry: [],
        byRegion: [],
        populationData: [],
        performanceMetrics: [],
        trendData: [],
        heatmapData: [],
        treemapData: [],
        topCountries: [],
        insights: []
      };
    }

    // Group by country with detailed stats
    const statesByCountry = states.reduce((acc, state) => {
      const countryName = state.country?.nameEn || state.countryName || "Unknown";
      if (!acc[countryName]) {
        acc[countryName] = {
          count: 0,
          states: [],
          population: 0,
          area: 0,
          avgDevelopment: 0
        };
      }
      acc[countryName].count++;
      acc[countryName].states.push(state);
      // Mock data for demonstration
      acc[countryName].population += Math.floor(Math.random() * 5000000) + 500000;
      acc[countryName].area += Math.floor(Math.random() * 50000) + 10000;
      acc[countryName].avgDevelopment = Math.floor(Math.random() * 40) + 60;
      return acc;
    }, {});

    const byCountry = Object.entries(statesByCountry)
      .map(([country, data]) => ({
        name: country,
        value: data.count,
        population: data.population,
        area: data.area,
        development: data.avgDevelopment,
        percentage: ((data.count / states.length) * 100).toFixed(1),
        density: Math.floor(data.population / data.area)
      }))
      .sort((a, b) => b.value - a.value);

    // Regional distribution (mock data)
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
    const byRegion = regions.map(region => ({
      name: region,
      value: Math.floor(Math.random() * 15) + 5,
      growth: (Math.random() * 20 - 10).toFixed(1),
      color: COLOR_PALETTES.rainbow[regions.indexOf(region)]
    }));

    // Performance metrics for different categories
    const performanceMetrics = [
      {
        name: 'Economic Development',
        current: 78,
        target: 85,
        trend: 5.2,
        color: theme.palette.success.main
      },
      {
        name: 'Infrastructure Quality',
        current: 65,
        target: 75,
        trend: 3.8,
        color: theme.palette.info.main
      },
      {
        name: 'Education Index',
        current: 82,
        target: 90,
        trend: 2.1,
        color: theme.palette.warning.main
      },
      {
        name: 'Healthcare Access',
        current: 71,
        target: 80,
        trend: 4.5,
        color: theme.palette.error.main
      }
    ];

    // Trend data over time
    const trendData = Array.from({ length: 12 }, (_, i) => ({
      month: `${2024 - Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`,
      newStates: Math.floor(Math.random() * 8) + 2,
      totalStates: states.length - Math.floor(Math.random() * 20),
      dataQuality: Math.floor(Math.random() * 10) + 85,
      coverage: Math.floor(Math.random() * 15) + 80
    })).reverse();

    // Heatmap data for states performance matrix
    const metrics = ['Population', 'Area', 'Development', 'Infrastructure'];
    const heatmapData = [];
    byCountry.slice(0, 8).forEach(country => {
      metrics.forEach(metric => {
        let value;
        switch(metric) {
          case 'Population': value = Math.floor(country.population / 100000); break;
          case 'Area': value = Math.floor(country.area / 1000); break;
          case 'Development': value = country.development; break;
          case 'Infrastructure': value = Math.floor(Math.random() * 40) + 60; break;
          default: value = Math.floor(Math.random() * 100);
        }
        heatmapData.push({
          x: country.name.length > 12 ? country.name.substring(0, 12) + '...' : country.name,
          y: metric,
          value: value
        });
      });
    });

    // Treemap data for hierarchical view
    const treemapData = byCountry.slice(0, 10).map(country => ({
      name: country.name,
      size: country.value,
      category: country.value > 8 ? 'High' : country.value > 4 ? 'Medium' : 'Low',
      population: country.population,
      development: country.development
    }));

    // Top countries with detailed info
    const topCountries = byCountry.slice(0, 5).map((country, index) => ({
      ...country,
      rank: index + 1,
      change: Math.floor(Math.random() * 6) - 3, // -3 to +3 change
      flag: `https://flagcdn.com/24x18/${country.name.toLowerCase().substring(0, 2)}.png`
    }));

    // Key insights
    const insights = [
      {
        title: 'Geographic Distribution',
        value: `${byCountry.length} countries covered`,
        trend: '+12%',
        positive: true,
        icon: Public
      },
      {
        title: 'Data Completeness',
        value: '94.2%',
        trend: '+2.1%',
        positive: true,
        icon: DataUsage
      },
      {
        title: 'Average States per Country',
        value: Math.round(states.length / byCountry.length),
        trend: '+5.8%',
        positive: true,
        icon: Analytics
      },
      {
        title: 'Quality Score',
        value: '4.7/5.0',
        trend: '+0.3',
        positive: true,
        icon: Star
      }
    ];

    const overview = {
      total: states.length,
      countries: byCountry.length,
      avgPerCountry: Math.round(states.length / byCountry.length),
      topCountry: byCountry[0]?.name || 'N/A'
    };

    return {
      overview,
      byCountry,
      byRegion,
      performanceMetrics,
      trendData,
      heatmapData,
      treemapData,
      topCountries,
      insights
    };
  }, [states, theme]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
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
          Add some states to see the dashboard
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Dashboard Header */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)` }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
              <Assessment />
            </Avatar>
            <Box>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                States Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive insights and performance metrics for {dashboardData.overview.total} states across {dashboardData.overview.countries} countries
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip icon={<LocationOn />} label={`${dashboardData.overview.total} States`} color="primary" />
            <Chip icon={<Public />} label={`${dashboardData.overview.countries} Countries`} color="secondary" />
            <Chip icon={<TrendingUp />} label="94.2% Data Quality" color="success" />
            <Chip icon={<Star />} label="4.7/5.0 Rating" color="warning" />
          </Stack>
        </CardContent>
      </Card>

      {/* Key Insights Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.insights.map((insight, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: `${theme.palette.primary.main}20`, color: theme.palette.primary.main }}>
                    <insight.icon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {insight.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {insight.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={insight.positive ? "success.main" : "error.main"}
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      {insight.positive ? <TrendingUp fontSize="small" /> : <TrendingUp fontSize="small" sx={{ transform: 'rotate(180deg)' }} />}
                      {insight.trend} vs last period
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* States Distribution by Country */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <BarChart
            data={dashboardData.byCountry.slice(0, 10)}
            title="States Distribution by Country"
            subtitle={`Top 10 countries with the most states (Total: ${dashboardData.overview.total} states)`}
            xKey="name"
            yKey="value"
            colors={COLOR_PALETTES.primary}
            showGrid={true}
            height={400}
            formatLabel={(label) => label.length > 15 ? `${label.substring(0, 15)}...` : label}
          />
        </Grid>

        {/* Regional Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <DonutChart
            data={dashboardData.byRegion}
            title="Regional Distribution"
            subtitle="States by geographical regions"
            nameKey="name"
            valueKey="value"
            colors={COLOR_PALETTES.rainbow}
            showLegend={false}
            centerLabel="Regions"
            height={400}
          />
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                Performance Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Key performance indicators across different categories
              </Typography>
              
              <Stack spacing={3}>
                {dashboardData.performanceMetrics.map((metric, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {metric.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {metric.current}%
                        </Typography>
                        <Chip 
                          label={`+${metric.trend}%`} 
                          size="small" 
                          color="success" 
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(metric.current / metric.target) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${metric.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: metric.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Current: {metric.current}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Target: {metric.target}%
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Countries Ranking */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                Top Countries Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Countries with the highest number of states
              </Typography>
              
              <Stack spacing={2}>
                {dashboardData.topCountries.map((country, index) => (
                  <Paper 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ 
                        bgcolor: index < 3 ? theme.palette.warning.main : theme.palette.grey[400],
                        width: 32, 
                        height: 32,
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        #{country.rank}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {country.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Population: {(country.population / 1000000).toFixed(1)}M | 
                          Development: {country.development}%
                        </Typography>
                      </Box>
                      
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {country.value}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color={country.change >= 0 ? "success.main" : "error.main"}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          {country.change >= 0 ? '+' : ''}{country.change}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Advanced Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Trend Analysis */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <LineChart
            data={dashboardData.trendData}
            title="States Management Trends"
            subtitle="Historical data and performance trends over time"
            xKey="month"
            multiSeries={[
              { key: 'totalStates', name: 'Total States', color: theme.palette.primary.main },
              { key: 'dataQuality', name: 'Data Quality %', color: theme.palette.success.main },
              { key: 'coverage', name: 'Coverage %', color: theme.palette.info.main }
            ]}
            showLegend={true}
            height={350}
          />
        </Grid>

        {/* Hierarchical View */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <TreemapChart
            data={dashboardData.treemapData}
            title="States Hierarchy"
            subtitle="Hierarchical view by country size"
            dataKey="size"
            nameKey="name"
            colors={COLOR_PALETTES.success}
            height={350}
          />
        </Grid>
      </Grid>

      {/* Performance Heatmap */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <HeatmapChart
            data={dashboardData.heatmapData}
            title="Countries Performance Matrix"
            subtitle="Comprehensive performance analysis across key metrics"
            xKey="x"
            yKey="y"
            valueKey="value"
            colors={['#ffffff', theme.palette.primary.main]}
            showLabels={false}
            showColorScale={true}
            height={400}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatesDashboard;