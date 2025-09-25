import { Box, Grid } from '@mui/material';
import React from 'react';
import { Country } from '../types/Country';
import {
  ChartLegend,
  CurrencyChart,
  EmptyChartState,
  getChartColors,
  LoadingChartState,
  prepareCurrencyData,
  prepareRegionData,
  prepareTimelineData,
  RegionBarChart,
  RegionPieChart,
  SummaryCards,
  TimelineChart,
} from './chartView';

interface CountriesChartViewProps {
  countries: Country[];
  loading: boolean;
  t: (key: string) => string;
}

const CountriesChartView: React.FC<CountriesChartViewProps> = ({
  countries,
  loading,
  t
}) => {

  // Handle loading state
  if (loading) {
    return <LoadingChartState t={t} />;
  }

  // Handle empty state
  if (!countries || countries.length === 0) {
    return <EmptyChartState t={t} />;
  }

  // Prepare chart data
  const regionData = prepareRegionData(countries);
  const currencyData = prepareCurrencyData(countries);
  const timelineData = prepareTimelineData(countries);
  const colors = getChartColors();

  // Calculate summary metrics
  const totalCountries = countries.length;
  const totalRegions = regionData.length;
  const totalCurrencies = currencyData.length;
  const avgPerRegion = Math.round(totalCountries / totalRegions);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Summary Cards */}
      <SummaryCards
        totalCountries={totalCountries}
        totalRegions={totalRegions}
        totalCurrencies={totalCurrencies}
        avgPerRegion={avgPerRegion}
        t={t}
      />

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Countries by Region - Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RegionBarChart data={regionData} t={t} />
        </Grid>

        {/* Countries by Region - Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RegionPieChart data={regionData} colors={colors} t={t} />
        </Grid>

        {/* Top Currencies */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrencyChart data={currencyData} t={t} />
        </Grid>

        {/* Timeline */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TimelineChart data={timelineData} t={t} />
        </Grid>
      </Grid>

      {/* Legend */}
      <ChartLegend data={regionData} colors={colors} />
    </Box>
  );
};

export default CountriesChartView;