/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack
} from "@mui/material";
import {
  Dashboard,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart,
  DonutLarge,
  Assessment,
  LocationOn
} from "@mui/icons-material";

// Import our reusable chart components
import {
  BarChart,
  PieChart,
  DonutChart,
  ChartShowcaseExtended
} from "@/shared/components/charts";

import { COLOR_PALETTES } from "@/shared/components/charts/chartUtils";
import StatesDashboard from "./statesDashboard";

const StatesChartView = ({
  states,
  loading,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState("dashboard");

  // Prepare chart data for individual charts
  const chartData = useMemo(() => {
    if (!states || states.length === 0) return { 
      byCountry: [], 
      stats: {}
    };

    // Group states by country
    const statesByCountry = states.reduce((acc, state) => {
      const countryName = state.country?.nameEn || state.countryName || "Unknown";
      if (!acc[countryName]) {
        acc[countryName] = 0;
      }
      acc[countryName]++;
      return acc;
    }, {});

    const byCountry = Object.entries(statesByCountry)
      .map(([country, count]) => ({
        name: country,
        value: count,
        percentage: ((count / states.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    const stats = {
      total: states.length,
      countries: byCountry.length,
      avgPerCountry: byCountry.length > 0 ? Math.round(states.length / byCountry.length) : 0,
      topCountry: byCountry[0]?.name || 'N/A'
    };

    return { 
      byCountry, 
      stats
    };
  }, [states]);

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const chartTypes = [
    { value: "dashboard", label: "Analytics Dashboard", icon: <Dashboard /> },
    { value: "bar", label: "Bar Chart", icon: <BarChartIcon /> },
    { value: "pie", label: "Pie Chart", icon: <PieChartIcon /> },
    { value: "donut", label: "Donut Chart", icon: <DonutLarge /> },
    { value: "showcase", label: "Chart Examples", icon: <Assessment /> }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading charts data...
        </Typography>
      </Box>
    );
  }

  if (!states || states.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          textAlign: "center",
        }}
      >
        <LocationOn sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {t("states.noData") || "No states data available"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t("states.noDataDescription") || "Add some states to see chart visualizations"}
        </Typography>
      </Box>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "dashboard":
        return (
          <StatesDashboard 
            states={states} 
            loading={loading}
          />
        );

      case "bar":
        return (
          <BarChart
            data={chartData.byCountry}
            title="States Distribution by Country"
            subtitle={`${chartData.stats.total} states across ${chartData.stats.countries} countries`}
            xKey="name"
            yKey="value"
            colors={COLOR_PALETTES.primary}
            showGrid={true}
            height={500}
            formatLabel={(label) => label.length > 12 ? `${label.substring(0, 12)}...` : label}
          />
        );

      case "pie":
        return (
          <PieChart
            data={chartData.byCountry.slice(0, 8)}
            title="States Distribution by Country"
            subtitle="Percentage distribution across countries"
            nameKey="name"
            valueKey="value"
            colors={COLOR_PALETTES.rainbow}
            showLegend={true}
            height={500}
          />
        );

      case "donut":
        return (
          <DonutChart
            data={chartData.byCountry.slice(0, 6)}
            title="Top Countries by States"
            subtitle="Distribution with total count in center"
            nameKey="name"
            valueKey="value"
            colors={COLOR_PALETTES.success}
            showLegend={true}
            centerLabel="Total States"
            height={500}
          />
        );

      case "showcase":
        return (
          <ChartShowcaseExtended
            data={chartData.byCountry}
            title="Chart Library Examples"
            subtitle="Complete collection of available chart types using states data"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Chart Content */}
      {renderChart()}
    </Box>
  );
};

export default StatesChartView;