/* eslint-disable react/prop-types */
// components/CountriesChartView.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Card,
  CardContent,
  Chip,
  alpha,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Public, TrendingUp, Assessment, DonutLarge } from "@mui/icons-material";

const CountriesChartView = ({ countries, loading, t }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter countries based on search term
  const filteredCountries = React.useMemo(() => {
    if (!searchTerm) return countries || [];
    return (countries || []).filter(
      (country) =>
        country.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.alpha2Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.alpha3Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.phoneCode?.toString().includes(searchTerm) ||
        country.currencyCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t("general.loading") || "Loading charts..."}
        </Typography>
      </Box>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Assessment sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          {t("countries.noData") || "No countries available"}
        </Typography>
        <Typography variant="body2">
          {t("countries.noDataDescription") || "Start by adding your first country"}
        </Typography>
      </Box>
    );
  }

  // Prepare chart data
  const prepareRegionData = () => {
    const regions = {};
    
    countries.forEach((country) => {
      let region = "Other";
      const countryCode = country.alpha2Code?.toUpperCase();
      
      if (["US", "CA", "MX"].includes(countryCode)) {
        region = "North America";
      } else if (["BR", "AR", "CL", "PE", "CO"].includes(countryCode)) {
        region = "South America";
      } else if (["GB", "FR", "DE", "IT", "ES", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI"].includes(countryCode)) {
        region = "Europe";
      } else if (["CN", "JP", "KR", "IN", "TH", "VN", "MY", "SG", "ID", "PH"].includes(countryCode)) {
        region = "Asia";
      } else if (["EG", "SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB", "SY", "IQ", "IR", "TR"].includes(countryCode)) {
        region = "MENA";
      } else if (["ZA", "NG", "KE", "GH", "ET", "TZ", "UG", "ZW", "BW", "ZM"].includes(countryCode)) {
        region = "Africa";
      } else if (["AU", "NZ", "FJ", "PG"].includes(countryCode)) {
        region = "Oceania";
      }
      
      regions[region] = (regions[region] || 0) + 1;
    });
    
    return Object.entries(regions).map(([name, value]) => ({ name, value }));
  };

  const prepareCurrencyData = () => {
    const currencies = {};
    
    countries.forEach((country) => {
      if (country.currencyCode) {
        currencies[country.currencyCode] = (currencies[country.currencyCode] || 0) + 1;
      }
    });
    
    return Object.entries(currencies)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 currencies
  };

  const prepareTimelineData = () => {
    const timeline = {};
    
    countries.forEach((country) => {
      if (country.createdOn) {
        const month = new Date(country.createdOn).toISOString().slice(0, 7); // YYYY-MM
        timeline[month] = (timeline[month] || 0) + 1;
      }
    });
    
    return Object.entries(timeline)
      .map(([month, count]) => ({ month, count, cumulative: 0 }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item, index, array) => ({
        ...item,
        cumulative: array.slice(0, index + 1).reduce((sum, curr) => sum + curr.count, 0),
      }));
  };

  const regionData = prepareRegionData();
  const currencyData = prepareCurrencyData();
  const timelineData = prepareTimelineData();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {countries.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {t("countries.dashboard.totalCountries") || "Total Countries"}
                  </Typography>
                </Box>
                <Public sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {regionData.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {t("countries.dashboard.regions") || "Regions"}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {currencyData.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {t("countries.dashboard.currencies") || "Currencies"}
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {Math.round(countries.length / regionData.length)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {t("countries.dashboard.avgPerRegion") || "Avg/Region"}
                  </Typography>
                </Box>
                <DonutLarge sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Countries by Region - Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t("countries.charts.byRegion") || "Countries by Region"}
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Bar
                  dataKey="value"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Countries by Region - Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t("countries.charts.regionDistribution") || "Region Distribution"}
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Currencies */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t("countries.charts.topCurrencies") || "Top Currencies"}
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={currencyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Bar
                  dataKey="value"
                  fill={theme.palette.secondary.main}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Timeline */}
        {timelineData.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: 400,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {t("countries.charts.timeline") || "Countries Added Over Time"}
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke={theme.palette.success.main}
                    fill={alpha(theme.palette.success.main, 0.3)}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Legend */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
        {regionData.map((region, index) => (
          <Chip
            key={region.name}
            label={`${region.name} (${region.value})`}
            size="small"
            sx={{
              backgroundColor: alpha(COLORS[index % COLORS.length], 0.1),
              color: COLORS[index % COLORS.length],
              border: `1px solid ${alpha(COLORS[index % COLORS.length], 0.3)}`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CountriesChartView;