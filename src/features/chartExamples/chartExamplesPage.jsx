/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Stack
} from '@mui/material';
import {
  Assessment,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart,
  Timeline,
  DonutLarge,
  TrendingUp,
  LinearScale,
  Dashboard,
  Star,
  Analytics
} from '@mui/icons-material';

import { ChartShowcaseExtended } from '@/shared/components/charts';
import MyHeaderWithAddButton from '@/shared/components/common/header/myHeaderWithAddButton';

const ChartExamplesPage = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const chartCategories = [
    {
      label: 'All Charts',
      icon: <Assessment />,
      description: 'Complete collection of all available chart types',
      count: '22+'
    },
    {
      label: 'Basic Charts',
      icon: <BarChartIcon />,
      description: 'Fundamental chart types for data visualization',
      count: '8'
    },
    {
      label: 'Advanced Charts',
      icon: <TrendingUp />,
      description: 'Complex visualizations for detailed analysis',
      count: '8'
    },
    {
      label: 'MUI Components',
      icon: <Dashboard />,
      description: 'Material-UI based chart components',
      count: '6'
    }
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <ChartShowcaseExtended
            title="Complete Chart Library"
            subtitle="All 22+ chart types with interactive examples and real-time data"
          />
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
              Basic Chart Types
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Essential chart types for everyday data visualization needs.
            </Typography>
            <ChartShowcaseExtended
              title="Basic Charts Collection"
              subtitle="Bar, Pie, Line, Area, Donut, Scatter, Radar, and Gauge charts"
            />
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
              Advanced Chart Types
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Sophisticated visualizations for complex data analysis and business intelligence.
            </Typography>
            <ChartShowcaseExtended
              title="Advanced Charts Collection"
              subtitle="Treemap, Funnel, Sankey, Heatmap, Candlestick, Waterfall, Bullet, and Composed charts"
            />
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
              MUI-Based Components
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Native Material-UI components for seamless integration and consistent design.
            </Typography>
            <ChartShowcaseExtended
              title="MUI Components Collection"
              subtitle="Progress, Metric Cards, Timeline, Stats, Sparklines, and Rating charts"
            />
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <MyHeaderWithAddButton
        title="Chart Examples & Library"
        subTitle="Comprehensive collection of reusable chart components"
        showAddButton={false}
      />

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {chartCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: selectedTab === index ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.primary.main,
                }
              }}
              onClick={() => setSelectedTab(index)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {category.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Chip
                  label={`${category.count} Charts`}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minHeight: 60,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
              '& .MuiTabs-indicator': {
                height: 3,
              },
            }}
          >
            {chartCategories.map((category, index) => (
              <Tab
                key={index}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {category.icon}
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {category.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.count} charts
                      </Typography>
                    </Box>
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <Box>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default ChartExamplesPage;