/* eslint-disable react/prop-types */
// components/CountriesMapView.jsx
import { appPermissions } from "@/constants";
import {
  Delete,
  Edit,
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
  ViewComfy,
  Phone,
  AttachMoney,
  Code
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

const CountriesMapView = ({
  countries,
  loading,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("cards"); // cards, list, compact
  const [filterBy, setFilterBy] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [bookmarkedCountries, setBookmarkedCountries] = useState(new Set());
  const [showStats, setShowStats] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Enhanced statistics and data processing
  const processedData = useMemo(() => {
    if (!countries) return { regions: {}, stats: {}, insights: [] };
    
    // Group countries and show their related states as details
    const grouped = countries.reduce((acc, country) => {
      const countryName = country.nameEn || `Country ${country.id}`;
      
      if (!acc[countryName]) {
        acc[countryName] = {
          countries: [],
          totalCountries: 0,
          states: [], // This will hold the related states for this country
          totalStates: 0,
          lastUpdated: null,
          avgPopulation: Math.floor(Math.random() * 10000000) + 1000000,
          totalArea: Math.floor(Math.random() * 500000) + 50000,
          developmentScore: Math.floor(Math.random() * 40) + 60,
          qualityScore: Math.floor(Math.random() * 30) + 70,
          growthRate: (Math.random() * 20 - 10).toFixed(1),
          coordinates: { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 },
          // Add country-specific details
          alpha2Code: country.alpha2Code,
          alpha3Code: country.alpha3Code,
          phoneCode: country.phoneCode,
          currencyCode: country.currencyCode,
          capital: country.capital || "N/A",
          language: country.language || "N/A",
          cities: Math.floor(Math.random() * 50) + 10,
          timezone: `UTC${Math.floor(Math.random() * 24) - 12}`,
          // Store country data for reference
          countryData: country
        };
      }
      
      acc[countryName].countries.push(country);
      acc[countryName].totalCountries++;
      
      if (country.updatedAt || country.createdOn) {
        const updateDate = new Date(country.updatedAt || country.createdOn);
        if (!acc[countryName].lastUpdated || updateDate > acc[countryName].lastUpdated) {
          acc[countryName].lastUpdated = updateDate;
        }
      }
      
      return acc;
    }, {});

    // Generate mock states for each country (replace with actual API call)
    Object.keys(grouped).forEach(countryName => {
      const countryData = grouped[countryName];
      // Mock states data - replace this with actual API call to get states for this country
      const mockStates = [
        {
          id: Math.floor(Math.random() * 1000) + 1,
          nameEn: `${countryName} Central State`,
          nameAr: `ولاية ${countryName} المركزية`,
          code: `${countryData.alpha2Code || 'XX'}01`,
          population: Math.floor(Math.random() * 5000000) + 500000,
          area: Math.floor(Math.random() * 50000) + 5000,
          capital: `${countryName} Capital City`,
          createdOn: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          countryId: countryData.countryData.id,
          countryName: countryName
        },
        {
          id: Math.floor(Math.random() * 1000) + 1001,
          nameEn: `${countryName} Northern State`,
          nameAr: `ولاية ${countryName} الشمالية`,
          code: `${countryData.alpha2Code || 'XX'}02`,
          population: Math.floor(Math.random() * 3000000) + 300000,
          area: Math.floor(Math.random() * 40000) + 4000,
          capital: `${countryName} North City`,
          createdOn: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          countryId: countryData.countryData.id,
          countryName: countryName
        },
        {
          id: Math.floor(Math.random() * 1000) + 2001,
          nameEn: `${countryName} Southern State`,
          nameAr: `ولاية ${countryName} الجنوبية`,
          code: `${countryData.alpha2Code || 'XX'}03`,
          population: Math.floor(Math.random() * 2000000) + 200000,
          area: Math.floor(Math.random() * 30000) + 3000,
          capital: `${countryName} South City`,
          createdOn: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          countryId: countryData.countryData.id,
          countryName: countryName
        },
        {
          id: Math.floor(Math.random() * 1000) + 3001,
          nameEn: `${countryName} Eastern State`,
          nameAr: `ولاية ${countryName} الشرقية`,
          code: `${countryData.alpha2Code || 'XX'}04`,
          population: Math.floor(Math.random() * 1500000) + 150000,
          area: Math.floor(Math.random() * 25000) + 2500,
          capital: `${countryName} East City`,
          createdOn: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          countryId: countryData.countryData.id,
          countryName: countryName
        },
        {
          id: Math.floor(Math.random() * 1000) + 4001,
          nameEn: `${countryName} Western State`,
          nameAr: `ولاية ${countryName} الغربية`,
          code: `${countryData.alpha2Code || 'XX'}05`,
          population: Math.floor(Math.random() * 1200000) + 120000,
          area: Math.floor(Math.random() * 20000) + 2000,
          capital: `${countryName} West City`,
          createdOn: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          countryId: countryData.countryData.id,
          countryName: countryName
        }
      ].slice(0, Math.floor(Math.random() * 4) + 2); // Random 2-5 states per country
      
      grouped[countryName].states = mockStates;
      grouped[countryName].totalStates = mockStates.length;
    });

    // Apply filters and search
    let filteredRegions = { ...grouped };
    
    if (searchTerm) {
      const filtered = {};
      Object.entries(grouped).forEach(([regionName, data]) => {
        const filteredCountries = data.countries.filter(country => 
          country.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.nameAr?.includes(searchTerm) ||
          country.alpha2Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.alpha3Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.phoneCode?.toString().includes(searchTerm) ||
          country.currencyCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          regionName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredCountries.length > 0) {
          filtered[regionName] = {
            ...data,
            countries: filteredCountries,
            totalCountries: filteredCountries.length
          };
        }
      });
      filteredRegions = filtered;
    }

    // Apply additional filters
    if (filterBy !== "all") {
      const filtered = {};
      Object.entries(filteredRegions).forEach(([regionName, data]) => {
        let shouldInclude = false;
        switch (filterBy) {
          case "high-countries":
            shouldInclude = data.totalCountries >= 10;
            break;
          case "low-countries":
            shouldInclude = data.totalCountries < 10;
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
          filtered[regionName] = data;
        }
      });
      filteredRegions = filtered;
    }

    // Sort regions
    const sortedEntries = Object.entries(filteredRegions).sort(([nameA, dataA], [nameB, dataB]) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = nameA.localeCompare(nameB);
          break;
        case "countries":
          comparison = dataA.totalCountries - dataB.totalCountries;
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

    const sortedRegions = Object.fromEntries(sortedEntries);

    // Calculate overall statistics
    const totalRegions = Object.keys(filteredRegions).length;
    const totalCountries = Object.values(filteredRegions).reduce((sum, region) => sum + region.totalCountries, 0);
    const avgCountriesPerRegion = totalRegions > 0 ? Math.round(totalCountries / totalRegions) : 0;
    const avgQualityScore = totalRegions > 0 ? 
      Math.round(Object.values(filteredRegions).reduce((sum, region) => sum + region.qualityScore, 0) / totalRegions) : 0;

    // Generate insights
    const insights = [
      {
        title: "Geographic Regions",
        value: `${totalRegions} regions`,
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
        title: "Total Countries",
        value: totalCountries,
        trend: "+8.1%",
        positive: true,
        icon: Flag,
        color: theme.palette.info.main
      },
      {
        title: "Avg per Region",
        value: avgCountriesPerRegion,
        trend: "+3.7%",
        positive: true,
        icon: Analytics,
        color: theme.palette.warning.main
      }
    ];

    return {
      regions: sortedRegions,
      stats: { totalRegions, totalCountries, avgCountriesPerRegion, avgQualityScore },
      insights
    };
  }, [countries, searchTerm, sortBy, sortOrder, filterBy, theme]);

  const toggleRegionExpansion = (regionName) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionName]: !prev[regionName]
    }));
  };

  const toggleBookmark = (countryId) => {
    setBookmarkedCountries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(countryId)) {
        newSet.delete(countryId);
      } else {
        newSet.add(countryId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    const allRegions = Object.keys(processedData.regions);
    const newExpanded = {};
    const allExpanded = allRegions.every(region => expandedRegions[region]);
    
    allRegions.forEach(region => {
      newExpanded[region] = !allExpanded;
    });
    setExpandedRegions(newExpanded);
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
      {Object.entries(processedData.regions).map(([regionName, regionData]) => {
        const isExpanded = expandedRegions[regionName] ?? true;
        
        return (
          <Paper
            key={regionName}
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
            {/* Region Header - Horizontal Layout */}
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
              onClick={() => toggleRegionExpansion(regionName)}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Badge
                  badgeContent={regionData.totalCountries}
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
                    {regionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {regionData.totalCountries} countries • {regionData.qualityScore}% quality • {regionData.growthRate}% growth
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 200 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Data Quality
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      {regionData.qualityScore}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={regionData.qualityScore}
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

            {/* Countries List - Horizontal Layout */}
            <Collapse in={isExpanded} timeout={300}>
              <Box sx={{ p: 2 }}>
                <List dense>
                  {regionData.countries.map((country, index) => (
                    <ListItem
                      key={country.id}
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
                          <Flag sx={{ fontSize: 18 }} />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" fontWeight="bold">
                              {country.nameEn || "N/A"}
                            </Typography>
                            {country.alpha2Code && (
                              <Chip
                                label={country.alpha2Code}
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
                            {country.alpha3Code && (
                              <Chip
                                label={country.alpha3Code}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.main,
                                  fontFamily: "monospace",
                                  fontSize: '0.7rem',
                                  height: 18
                                }}
                              />
                            )}
                            {bookmarkedCountries.has(country.id) && (
                              <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" spacing={2}>
                            {country.nameAr && (
                              <Typography variant="caption" sx={{ direction: "rtl" }}>
                                {country.nameAr}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              ID: {country.id}
                            </Typography>
                            {country.phoneCode && (
                              <Typography variant="caption" color="text.secondary">
                                Phone: +{country.phoneCode}
                              </Typography>
                            )}
                            {country.currencyCode && (
                              <Typography variant="caption" color="text.secondary">
                                Currency: {country.currencyCode}
                              </Typography>
                            )}
                          </Stack>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Bookmark">
                            <IconButton
                              size="small"
                              onClick={() => toggleBookmark(country.id)}
                            >
                              {bookmarkedCountries.has(country.id) ? 
                                <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} /> : 
                                <BookmarkBorder sx={{ fontSize: 16 }} />
                              }
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={t("actions.view") || "View"}>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => onView(country)}
                            >
                              <Visibility sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={t("actions.edit") || "Edit"}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(country)}
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          
                          <AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>
                            <Tooltip title={t("actions.delete") || "Delete"}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(country)}
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
                {Array.from({ length: 3 }).map((_, countryIndex) => (
                  <Skeleton key={countryIndex} variant="rectangular" width="100%" height={80} sx={{ mb: 1 }} />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)` }}>
        <MapIcon sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
        <Typography variant="h4" color="text.secondary" gutterBottom>
          No Countries Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          Start building your geographic database by adding countries. You'll be able to organize them by region, 
          search through them, and visualize your data in this interactive map view.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<Public />}
          onClick={onAdd}
          sx={{ mt: 2 }}
        >
          Add Your First Country
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
          <Link color="inherit" href="#" onClick={() => setSelectedRegion(null)}>
            All Regions
          </Link>
          {selectedRegion && (
            <Typography color="text.primary">{selectedRegion}</Typography>
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
              Interactive Countries Map
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore {processedData.stats.totalCountries} countries across {processedData.stats.totalRegions} regions with advanced filtering and visualization
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
              placeholder="Search countries, regions, codes..."
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
                <MenuItem value="countries">Countries Count</MenuItem>
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
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="high-countries">High Countries (10+)</MenuItem>
                <MenuItem value="low-countries">Low Countries (&lt;10)</MenuItem>
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
            {Object.values(expandedRegions).every(Boolean) ? 'Collapse All' : 'Expand All'}
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
          expandedRegions={expandedRegions}
          toggleRegionExpansion={toggleRegionExpansion}
          bookmarkedCountries={bookmarkedCountries}
          toggleBookmark={toggleBookmark}
          animationEnabled={animationEnabled}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          t={t}
        />
      ) : renderListView()}

      {/* Enhanced No Results */}
      {searchTerm && Object.keys(processedData.regions).length === 0 && (
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
            We couldn't find any countries matching "{searchTerm}". Try adjusting your search terms or filters.
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

export default CountriesMapView;