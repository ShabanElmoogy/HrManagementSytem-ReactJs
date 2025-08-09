/* eslint-disable react/prop-types */
// components/StatesCardView.jsx
import { appPermissions } from "@/constants";
import { 
  Delete, 
  Edit, 
  LocationOn, 
  Public, 
  Visibility,
  Search,
  FilterList,
  Sort,
  ViewModule,
  Star,
  StarBorder,
  Bookmark,
  BookmarkBorder,
  TrendingUp,
  TrendingDown,
  Analytics,
  Language,
  CalendarToday,
  Flag,
  Place,
  Speed,
  DataUsage,
  NavigateNext,
  NavigateBefore
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  alpha,
  useTheme,
  Skeleton,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Avatar,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Divider,
  LinearProgress,
  Fade,
  Zoom,
  Pagination,
  TablePagination,
  useMediaQuery
} from "@mui/material";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";

const StatesCardView = ({
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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [bookmarkedStates, setBookmarkedStates] = useState(new Set());
  const [ratedStates, setRatedStates] = useState(new Map());
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  // Responsive items per page calculation
  const getResponsiveItemsPerPage = () => {
    if (isXs) return 6;   // Mobile: 1 column
    if (isSm) return 8;   // Small tablet: 2 columns
    if (isMd) return 12;  // Medium tablet: 3 columns
    if (isLg) return 12;  // Desktop: 4 columns (changed to 12)
    if (isXl) return 12;  // Large desktop: 5+ columns (changed to 12)
    return 12; // Default
  };

  // Pagination state with responsive default
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => getResponsiveItemsPerPage());

  // Update items per page when screen size changes
  useEffect(() => {
    const newItemsPerPage = getResponsiveItemsPerPage();
    if (newItemsPerPage !== rowsPerPage) {
      setRowsPerPage(newItemsPerPage);
      setPage(0); // Reset to first page
    }
  }, [isXs, isSm, isMd, isLg, isXl]);

  // Enhanced data processing with search, filter, and sort
  const processedStates = useMemo(() => {
    if (!states) return [];

    let filteredStates = [...states];

    // Apply search filter
    if (searchTerm) {
      filteredStates = filteredStates.filter(state =>
        state.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.nameAr?.includes(searchTerm) ||
        state.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.country?.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.countryName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (filterBy !== "all") {
      switch (filterBy) {
        case "bookmarked":
          filteredStates = filteredStates.filter(state => bookmarkedStates.has(state.id));
          break;
        case "rated":
          filteredStates = filteredStates.filter(state => ratedStates.has(state.id));
          break;
        case "recent":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filteredStates = filteredStates.filter(state => 
            state.createdOn && new Date(state.createdOn) > thirtyDaysAgo
          );
          break;
        case "hasCode":
          filteredStates = filteredStates.filter(state => state.code);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filteredStates.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = (a.nameEn || "").localeCompare(b.nameEn || "");
          break;
        case "country":
          comparison = (a.country?.nameEn || a.countryName || "").localeCompare(
            b.country?.nameEn || b.countryName || ""
          );
          break;
        case "code":
          comparison = (a.code || "").localeCompare(b.code || "");
          break;
        case "created":
          comparison = new Date(a.createdOn || 0) - new Date(b.createdOn || 0);
          break;
        case "rating":
          const ratingA = ratedStates.get(a.id) || 0;
          const ratingB = ratedStates.get(b.id) || 0;
          comparison = ratingA - ratingB;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filteredStates;
  }, [states, searchTerm, sortBy, sortOrder, filterBy, bookmarkedStates, ratedStates]);

  // Paginated data
  const paginatedStates = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedStates.slice(startIndex, startIndex + rowsPerPage);
  }, [processedStates, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Simple navigation to last page
  const navigateToLastPage = () => {
    console.log('Navigating to last page...');
    const totalStates = states ? states.length : 0;
    const totalPages = Math.ceil(totalStates / rowsPerPage);
    const lastPage = Math.max(0, totalPages - 1);
    console.log(`Total states: ${totalStates}, Total pages: ${totalPages}, Last page: ${lastPage}`);
    setPage(lastPage);
  };

  // Enhanced onAdd function with multiple navigation attempts
  const handleAdd = () => {
    if (onAdd) {
      console.log('=== ADDING NEW STATE ===');
      console.log('Current states length:', states ? states.length : 0);
      console.log('Current page:', page);
      console.log('Rows per page:', rowsPerPage);
      
      // Call the original onAdd function
      onAdd();
      
      // Try multiple navigation attempts with different delays
      setTimeout(() => {
        console.log('First navigation attempt (500ms)');
        navigateToLastPage();
      }, 500);
      
      setTimeout(() => {
        console.log('Second navigation attempt (1000ms)');
        navigateToLastPage();
      }, 1000);
      
      setTimeout(() => {
        console.log('Third navigation attempt (1500ms)');
        navigateToLastPage();
      }, 1500);
      
      setTimeout(() => {
        console.log('Final navigation attempt (2000ms)');
        navigateToLastPage();
      }, 2000);
    }
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

  const setRating = (stateId, rating) => {
    setRatedStates(prev => {
      const newMap = new Map(prev);
      if (rating === 0) {
        newMap.delete(stateId);
      } else {
        newMap.set(stateId, rating);
      }
      return newMap;
    });
  };

  const getQualityScore = (state) => {
    let score = 50; // Base score
    if (state.nameEn) score += 15;
    if (state.nameAr) score += 15;
    if (state.code) score += 10;
    if (state.country?.nameEn || state.countryName) score += 10;
    return Math.min(score, 100);
  };

  const getQualityLevel = (score) => {
    if (score >= 90) return { level: 'excellent', color: theme.palette.success.main };
    if (score >= 75) return { level: 'good', color: theme.palette.info.main };
    if (score >= 60) return { level: 'average', color: theme.palette.warning.main };
    return { level: 'poor', color: theme.palette.error.main };
  };

  // Get responsive items per page options
  const getItemsPerPageOptions = () => {
    // For larger screens (lg and xl), use fixed options: 12, 24, 36, 48
    if (isLg || isXl) {
      return [12, 24, 36, 48];
    }
    
    const base = getResponsiveItemsPerPage();
    return [
      Math.max(4, Math.floor(base * 0.5)),  // Half
      base,                                  // Default
      Math.floor(base * 1.5),               // 1.5x
      base * 2,                             // Double
      base * 3                              // Triple
    ].filter((value, index, array) => array.indexOf(value) === index); // Remove duplicates
  };

  if (loading) {
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
  }

  if (!states || states.length === 0) {
    return (
      <Box>
        {/* Empty State Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" color="primary.main" fontWeight="bold" gutterBottom>
            States Card View
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No states available to display
          </Typography>
        </Paper>
        
        {/* Empty State Content */}
        <Paper sx={{ 
          p: 6, 
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`
        }}>
          <LocationOn sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No States Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Start building your geographic database by adding states. You'll be able to search, filter, and organize them in this enhanced card view.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<LocationOn />}
            onClick={handleAdd}
            sx={{ mt: 2 }}
          >
            Add Your First State
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Enhanced Header with Search and Controls */}
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
        {/* Title Section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 48, 
              height: 48,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            <ViewModule sx={{ fontSize: 24 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              States Card View
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and manage {processedStates.length} states with enhanced search and filtering
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`${processedStates.length} States`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${bookmarkedStates.size} Bookmarked`} 
              color="warning" 
              variant="outlined"
            />
            <Chip 
              label={`${ratedStates.size} Rated`} 
              color="success" 
              variant="outlined"
            />
            {/* Debug Info */}
            <Chip 
              label={`Page: ${page + 1}`} 
              color="info" 
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>

        {/* Search and Filter Controls */}
        <Grid container spacing={2} alignItems="center">
          {/* Search Bar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search states by name, code, or country..."
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
                  '&:hover': {
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
                  }
                }
              }}
            />
          </Grid>

          {/* Sort By */}
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="country">Country</MenuItem>
                <MenuItem value="code">Code</MenuItem>
                <MenuItem value="created">Created Date</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Order */}
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
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                label="Filter"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <MenuItem value="all">All States</MenuItem>
                <MenuItem value="bookmarked">Bookmarked</MenuItem>
                <MenuItem value="rated">Rated</MenuItem>
                <MenuItem value="recent">Recent (30 days)</MenuItem>
                <MenuItem value="hasCode">Has Code</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => setSearchTerm('')}
                disabled={!searchTerm}
              >
                Clear
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('name');
                  setSortOrder('asc');
                  setFilterBy('all');
                  setPage(0);
                }}
              >
                Reset
              </Button>
              {/* Debug Button */}
              <Button 
                size="small" 
                variant="contained" 
                color="secondary"
                onClick={navigateToLastPage}
              >
                Last Page
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Cards Grid */}
      <Grid container spacing={3}>
        {paginatedStates.map((state, index) => {
          const qualityScore = getQualityScore(state);
          const qualityInfo = getQualityLevel(qualityScore);
          const isBookmarked = bookmarkedStates.has(state.id);
          const rating = ratedStates.get(state.id) || 0;
          const isHovered = hoveredCard === state.id;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={state.id}>
              <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  onMouseEnter={() => setHoveredCard(state.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: 400, // Increased height for better action buttons layout
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: 'hidden',
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, isHovered ? 0.3 : 0.1)}`,
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${qualityInfo.color} 0%, ${theme.palette.primary.main} 100%)`,
                      opacity: isHovered ? 1 : 0.8,
                      transition: 'opacity 0.3s ease'
                    }
                  }}
                >
                  {/* Quality Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      label={`${qualityScore}%`}
                      size="small"
                      sx={{
                        bgcolor: qualityInfo.color,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        boxShadow: `0 2px 8px ${alpha(qualityInfo.color, 0.3)}`
                      }}
                    />
                  </Box>

                  {/* Bookmark Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(state.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      '&:hover': {
                        bgcolor: theme.palette.background.paper,
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {isBookmarked ? 
                      <Bookmark sx={{ fontSize: 18, color: theme.palette.warning.main }} /> : 
                      <BookmarkBorder sx={{ fontSize: 18 }} />
                    }
                  </IconButton>

                  <CardContent sx={{ flex: 1, pt: 4, pb: 1 }}>
                    {/* State Names */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {state.nameEn || "N/A"}
                      </Typography>
                      {state.nameAr && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            direction: "rtl",
                            fontStyle: 'italic',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {state.nameAr}
                        </Typography>
                      )}
                    </Box>

                    {/* State Code and ID */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {state.code && (
                        <Chip
                          label={state.code}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            fontFamily: 'monospace',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      )}
                      <Chip
                        label={`ID: ${state.id}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </Stack>

                    {/* Country Info */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Flag sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          {t("general.country") || "Country"}
                        </Typography>
                      </Stack>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {state.country?.nameEn || state.countryName || "N/A"}
                      </Typography>
                    </Box>

                    {/* Quality Progress */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Data Quality
                        </Typography>
                        <Typography variant="caption" color={qualityInfo.color} fontWeight="bold">
                          {qualityInfo.level.toUpperCase()}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={qualityScore}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.grey[300], 0.3),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: qualityInfo.color,
                          },
                        }}
                      />
                    </Box>

                    {/* Rating System */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
                        Your Rating
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IconButton
                            key={star}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRating(state.id, star === rating ? 0 : star);
                            }}
                            sx={{ p: 0.25 }}
                          >
                            {star <= rating ? 
                              <Star sx={{ fontSize: 16, color: theme.palette.warning.main }} /> : 
                              <StarBorder sx={{ fontSize: 16, color: theme.palette.grey[400] }} />
                            }
                          </IconButton>
                        ))}
                      </Stack>
                    </Box>

                    {/* Creation Date */}
                    <Box sx={{ mt: "auto" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {state.createdOn
                            ? format(new Date(state.createdOn), "MMM dd, yyyy")
                            : "N/A"}
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>

                  <Divider />

                  {/* Fixed Action Buttons */}
                  <CardActions 
                    sx={{ 
                      justifyContent: "space-between", 
                      px: 2, 
                      py: 1.5,
                      minHeight: 64, // Fixed height for consistent layout
                      alignItems: 'center'
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={t("actions.view") || "View Details"} arrow>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onView(state)}
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                              transform: 'scale(1.1)',
                              borderColor: theme.palette.info.main
                            }
                          }}
                        >
                          <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={t("actions.edit") || "Edit State"} arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(state)}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              transform: 'scale(1.1)',
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      
                      <AuthorizeView requiredPermissions={[appPermissions.DeleteStates]}>
                        <Tooltip title={t("actions.delete") || "Delete State"} arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(state)}
                            sx={{
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                transform: 'scale(1.1)',
                                borderColor: theme.palette.error.main
                              }
                            }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </AuthorizeView>
                    </Stack>
                    
                    {/* Status Indicators */}
                    <Stack direction="column" spacing={0.5} alignItems="flex-end">
                      {isBookmarked && (
                        <Chip
                          label="Saved"
                          size="small"
                          color="warning"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                      {rating > 0 && (
                        <Chip
                          label={`${rating}★`}
                          size="small"
                          color="success"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>

      {/* Enhanced Pagination */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          {/* Left side - Showing info and items per page */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, processedStates.length)} of {processedStates.length} states
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                Items per page:
              </Typography>
              <Select
                size="small"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{ minWidth: 80 }}
              >
                {getItemsPerPageOptions().map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
          
          {/* Right side - Pagination controls */}
          <Pagination
            count={Math.ceil(processedStates.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => handleChangePage(event, value - 1)}
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            size={isXs ? "small" : "medium"}
          />
        </Stack>
      </Paper>

      {/* No Results Message */}
      {searchTerm && processedStates.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
        }}>
          <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No States Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No states match your search criteria "{searchTerm}"
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => {
              setSearchTerm('');
              setPage(0);
            }}
            startIcon={<Search />}
          >
            Clear Search
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default StatesCardView;