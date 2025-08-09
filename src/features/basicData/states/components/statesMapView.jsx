/* eslint-disable react/prop-types */
// components/StatesMapView.jsx
import { appPermissions } from "@/constants";
import {
  Delete,
  Edit,
  LocationOn,
  Public,
  Visibility,
  ZoomIn,
  Language,
  Flag,
  Analytics,
  TrendingUp,
  People,
  Place,
  Search,
  FilterList,
  Sort,
  ViewModule,
  ViewList,
  Map as MapIcon,
  Timeline,
  ExpandMore,
  ExpandLess,
  Info,
  Star,
  Speed,
  DataUsage,
  Refresh,
  Download,
  Share,
  Bookmark,
  BookmarkBorder,
  ViewComfy
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Paper,
  useTheme,
  alpha,
  Skeleton,
  Chip,
  Stack,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Badge,
  Collapse,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Breadcrumbs,
  Link,
  ListItemAvatar
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";
import EnhancedCardView from "./enhancedCardView";

const StatesMapView = ({
  states,
  loading,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCountries, setExpandedCountries] = useState({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("cards"); // cards, list, compact
  const [filterBy, setFilterBy] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [bookmarkedStates, setBookmarkedStates] = useState(new Set());
  const [showStats, setShowStats] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Enhanced statistics and data processing
  const processedData = useMemo(() => {
    if (!states) return { countries: {}, stats: {}, insights: [] };
    
    const grouped = states.reduce((acc, state) => {
      const countryName = state.country?.nameEn || state.countryName || "Unknown";
      if (!acc[countryName]) {
        acc[countryName] = {
          states: [],
          totalStates: 0,
          regions: new Set(),
          lastUpdated: null,
          avgPopulation: 0,
          totalArea: 0,
          developmentScore: 0,
          qualityScore: Math.floor(Math.random() * 30) + 70, // Mock quality score
          growthRate: (Math.random() * 20 - 10).toFixed(1), // Mock growth rate
          coordinates: { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 }
        };
      }
      
      acc[countryName].states.push(state);
      acc[countryName].totalStates++;
      
      // Enhanced mock data
      acc[countryName].avgPopulation += Math.floor(Math.random() * 1000000) + 100000;
      acc[countryName].totalArea += Math.floor(Math.random() * 50000) + 5000;
      acc[countryName].developmentScore = Math.floor(Math.random() * 40) + 60;
      
      if (state.region) acc[countryName].regions.add(state.region);
      if (state.updatedAt) {
        const updateDate = new Date(state.updatedAt);
        if (!acc[countryName].lastUpdated || updateDate > acc[countryName].lastUpdated) {
          acc[countryName].lastUpdated = updateDate;
        }
      }
      
      return acc;
    }, {});

    // Calculate final averages
    Object.values(grouped).forEach(country => {
      country.avgPopulation = Math.floor(country.avgPopulation / country.totalStates);
    });

    // Apply filters and search
    let filteredCountries = { ...grouped };
    
    if (searchTerm) {
      const filtered = {};
      Object.entries(grouped).forEach(([countryName, data]) => {
        const filteredStates = data.states.filter(state => 
          state.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          state.nameAr?.includes(searchTerm) ||
          state.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          countryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredStates.length > 0) {
          filtered[countryName] = {
            ...data,
            states: filteredStates,
            totalStates: filteredStates.length
          };
        }
      });
      filteredCountries = filtered;
    }

    // Apply additional filters
    if (filterBy !== "all") {
      const filtered = {};
      Object.entries(filteredCountries).forEach(([countryName, data]) => {
        let shouldInclude = false;
        switch (filterBy) {
          case "high-states":
            shouldInclude = data.totalStates >= 5;
            break;
          case "low-states":
            shouldInclude = data.totalStates < 5;
            break;
          case "high-quality":
            shouldInclude = data.qualityScore >= 85;
            break;
          case "recent":
            shouldInclude = data.lastUpdated && 
              (new Date() - data.lastUpdated) < 30 * 24 * 60 * 60 * 1000; // 30 days
            break;
          default:
            shouldInclude = true;
        }
        if (shouldInclude) {
          filtered[countryName] = data;
        }
      });
      filteredCountries = filtered;
    }

    // Sort countries
    const sortedEntries = Object.entries(filteredCountries).sort(([nameA, dataA], [nameB, dataB]) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = nameA.localeCompare(nameB);
          break;
        case "states":
          comparison = dataA.totalStates - dataB.totalStates;
          break;
        case "quality":
          comparison = dataA.qualityScore - dataB.qualityScore;
          break;
        case "growth":
          comparison = parseFloat(dataA.growthRate) - parseFloat(dataB.growthRate);
          break;
        default:
          comparison = nameA.localeCompare(nameB);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    const sortedCountries = Object.fromEntries(sortedEntries);

    // Calculate overall statistics
    const totalCountries = Object.keys(filteredCountries).length;
    const totalStates = Object.values(filteredCountries).reduce((sum, country) => sum + country.totalStates, 0);
    const avgStatesPerCountry = totalCountries > 0 ? Math.round(totalStates / totalCountries) : 0;
    const avgQualityScore = totalCountries > 0 ? 
      Math.round(Object.values(filteredCountries).reduce((sum, country) => sum + country.qualityScore, 0) / totalCountries) : 0;

    // Generate insights
    const insights = [
      {
        title: "Geographic Coverage",
        value: `${totalCountries} countries`,
        trend: "+12%",
        positive: true,
        icon: Public,
        color: theme.palette.primary.main
      },
      {
        title: "Data Quality",
        value: `${avgQualityScore}%`,
        trend: "+5.2%",
        positive: true,
        icon: DataUsage,
        color: theme.palette.success.main
      },
      {
        title: "Total States",
        value: totalStates,
        trend: "+8.1%",
        positive: true,
        icon: LocationOn,
        color: theme.palette.info.main
      },
      {
        title: "Avg per Country",
        value: avgStatesPerCountry,
        trend: "+3.7%",
        positive: true,
        icon: Analytics,
        color: theme.palette.warning.main
      }
    ];

    return {
      countries: sortedCountries,
      stats: { totalCountries, totalStates, avgStatesPerCountry, avgQualityScore },
      insights
    };
  }, [states, searchTerm, sortBy, sortOrder, filterBy, theme]);

  const toggleCountryExpansion = (countryName) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryName]: !prev[countryName]
    }));
  };

  const toggleBookmark = (stateId) => {
    setBookmarkedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stateId)) {
        newSet.delete(stateId);
      } else {
        newSet.add(stateId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    const allCountries = Object.keys(processedData.countries);
    const newExpanded = {};
    const allExpanded = allCountries.every(country => expandedCountries[country]);
    
    allCountries.forEach(country => {
      newExpanded[country] = !allExpanded;
    });
    setExpandedCountries(newExpanded);
  };

  const speedDialActions = [
    { icon: <Refresh />, name: 'Refresh Data', action: () => window.location.reload() },
    { icon: <Download />, name: 'Export Data', action: () => console.log('Export') },
    { icon: <Share />, name: 'Share View', action: () => console.log('Share') },
    { icon: <FilterList />, name: 'Advanced Filters', action: () => console.log('Filters') },
  ];

  // Render List View
  const renderListView = () => (
    <Stack spacing={2}>
      {Object.entries(processedData.countries).map(([countryName, countryData]) => {
        const isExpanded = expandedCountries[countryName] ?? true;
        
        return (
          <Paper
            key={countryName}
            elevation={2}
            sx={{
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.04)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: animationEnabled ? 'translateY(-2px)' : 'none',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
                borderColor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            {/* Country Header - Horizontal Layout */}
            <Box
              sx={{
                p: 2,
                cursor: 'pointer',
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
              onClick={() => toggleCountryExpansion(countryName)}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Badge
                  badgeContent={countryData.totalStates}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Flag sx={{ fontSize: 20 }} />
                  </Avatar>
                </Badge>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {countryName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {countryData.totalStates} states • {countryData.qualityScore}% quality • {countryData.growthRate}% growth
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 200 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Data Quality
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {countryData.qualityScore}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={countryData.qualityScore}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`
                      },
                    }}
                  />
                </Box>

                <IconButton
                  sx={{ 
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease-in-out',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </Stack>
            </Box>

            {/* States List - Horizontal Layout */}
            <Collapse in={isExpanded} timeout={300}>
              <Box sx={{ p: 2 }}>
                <List dense>
                  {countryData.states.map((state, index) => (
                    <ListItem
                      key={state.id}
                      sx={{
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        borderRadius: 1,
                        mb: 1,
                        transition: "all 0.2s ease-in-out",
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          transform: animationEnabled ? 'translateX(4px)' : 'none'
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                          <LocationOn sx={{ fontSize: 18 }} />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" fontWeight="bold">
                              {state.nameEn || "N/A"}
                            </Typography>
                            {state.code && (
                              <Chip
                                label={state.code}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  fontFamily: "monospace",
                                  fontSize: '0.7rem',
                                  height: 18
                                }}
                              />
                            )}
                            {bookmarkedStates.has(state.id) && (
                              <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" spacing={2}>
                            {state.nameAr && (
                              <Typography variant="caption" sx={{ direction: "rtl" }}>
                                {state.nameAr}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              ID: {state.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pop: {(Math.random() * 5 + 0.5).toFixed(1)}M
                            </Typography>
                          </Stack>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Bookmark">
                            <IconButton
                              size="small"
                              onClick={() => toggleBookmark(state.id)}
                            >
                              {bookmarkedStates.has(state.id) ? 
                                <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} /> : 
                                <BookmarkBorder sx={{ fontSize: 16 }} />
                              }
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={t("actions.view") || "View"}>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => onView(state)}
                            >
                              <Visibility sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={t("actions.edit") || "Edit"}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(state)}
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          
                          <AuthorizeView requiredPermissions={[appPermissions.DeleteStates]}>
                            <Tooltip title={t("actions.delete") || "Delete"}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(state)}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </AuthorizeView>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );

  if (loading) {
    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="text" width="70%" height={20} />
            </Box>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={40} />
          </Box>
        </Paper>
        
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={index}>
              <Paper sx={{ p: 3, height: 600 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                {Array.from({ length: 3 }).map((_, stateIndex) => (
                  <Skeleton key={stateIndex} variant="rectangular" width="100%" height={80} sx={{ mb: 1 }} />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!states || states.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)` }}>
        <MapIcon sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
        <Typography variant="h4" color="text.secondary" gutterBottom>
          No States Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          Start building your geographic database by adding states. You'll be able to organize them by country, 
          search through them, and visualize your data in this interactive map view.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<LocationOn />}
          onClick={onAdd}
          sx={{ mt: 2 }}
        >
          Add Your First State
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Enhanced Header with Advanced Controls */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 3
        }}
      >
        {/* Breadcrumb Navigation */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link color="inherit" href="#" onClick={() => setSelectedCountry(null)}>
            All Countries
          </Link>
          {selectedCountry && (
            <Typography color="text.primary">{selectedCountry}</Typography>
          )}
        </Breadcrumbs>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 56, 
              height: 56,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <MapIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              Interactive States Map
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore {processedData.stats.totalStates} states across {processedData.stats.totalCountries} countries with advanced filtering and visualization
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Toggle Statistics">
              <IconButton onClick={() => setShowStats(!showStats)} color={showStats ? "primary" : "default"}>
                <Analytics />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Animations">
              <IconButton onClick={() => setAnimationEnabled(!animationEnabled)} color={animationEnabled ? "primary" : "default"}>
                <Speed />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Enhanced Statistics Cards */}
        <Collapse in={showStats}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {processedData.insights.map((insight, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${insight.color}10 0%, ${insight.color}05 100%)`,
                    border: `1px solid ${alpha(insight.color, 0.2)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: animationEnabled ? 'translateY(-4px)' : 'none',
                      boxShadow: `0 8px 25px ${alpha(insight.color, 0.2)}`
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: insight.color, mx: 'auto', mb: 1, width: 40, height: 40 }}>
                      <insight.icon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color={insight.color}>
                      {insight.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {insight.title}
                    </Typography>
                    <Chip 
                      label={insight.trend} 
                      size="small" 
                      color={insight.positive ? "success" : "error"}
                      sx={{ fontSize: '0.7rem', height: 18 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Collapse>

        {/* Advanced Controls Row */}
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search states, countries, codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                }
              }}
            />
          </Grid>

          {/* Sort Controls */}
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="states">States Count</MenuItem>
                <MenuItem value="quality">Quality Score</MenuItem>
                <MenuItem value="growth">Growth Rate</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <ToggleButtonGroup
              value={sortOrder}
              exclusive
              onChange={(e, value) => value && setSortOrder(value)}
              size="small"
              fullWidth
            >
              <ToggleButton value="asc">
                <Tooltip title="Ascending">
                  <TrendingUp />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="desc">
                <Tooltip title="Descending">
                  <TrendingUp sx={{ transform: 'rotate(180deg)' }} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Filter */}
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                label="Filter"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <MenuItem value="all">All Countries</MenuItem>
                <MenuItem value="high-states">High States (5+)</MenuItem>
                <MenuItem value="low-states">Low States (&lt;5)</MenuItem>
                <MenuItem value="high-quality">High Quality (85%+)</MenuItem>
                <MenuItem value="recent">Recently Updated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* View Mode - Fixed */}
          <Grid size={{ xs: 6, md: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, value) => {
                if (value !== null) {
                  setViewMode(value);
                }
              }}
              size="small"
              fullWidth
            >
              <ToggleButton value="cards">
                <Tooltip title="Enhanced Card View">
                  <ViewModule />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list">
                <Tooltip title="List View">
                  <ViewList />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleExpandAll}
            startIcon={<ExpandMore />}
          >
            {Object.values(expandedCountries).every(Boolean) ? 'Collapse All' : 'Expand All'}
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
          >
            Clear Search
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => {
              setSortBy('name');
              setSortOrder('asc');
              setFilterBy('all');
            }}
          >
            Reset Filters
          </Button>
          <Chip 
            label={`Current View: ${viewMode === 'cards' ? 'Enhanced Cards' : 'List'}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Paper>

      {/* Render Different Views */}
      {viewMode === 'cards' ? (
        <EnhancedCardView
          processedData={processedData}
          expandedCountries={expandedCountries}
          toggleCountryExpansion={toggleCountryExpansion}
          bookmarkedStates={bookmarkedStates}
          toggleBookmark={toggleBookmark}
          animationEnabled={animationEnabled}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          t={t}
        />
      ) : renderListView()}

      {/* Enhanced No Results */}
      {searchTerm && Object.keys(processedData.countries).length === 0 && (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center', 
          mt: 3,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
        }}>
          <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Results Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            We couldn't find any states matching "{searchTerm}". Try adjusting your search terms or filters.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={() => setSearchTerm('')}
              startIcon={<Refresh />}
            >
              Clear Search
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setFilterBy('all');
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              Reset All Filters
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Floating Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
        direction="up"
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default StatesMapView;