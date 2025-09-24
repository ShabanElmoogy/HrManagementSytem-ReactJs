/* eslint-disable react/prop-types */
// components/CountriesCardView.jsx
import { appPermissions } from "@/constants";
import { 
  Delete, 
  Edit, 
  Public, 
  Visibility,
  Search,
  ViewModule,
  Star,
  StarBorder,
  Bookmark,
  BookmarkBorder,
  TrendingUp,
  CalendarToday,
  Phone,
  AttachMoney
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
  Pagination,
  useMediaQuery
} from "@mui/material";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";
import { useCountrySearch } from "../hooks/useCountryQueries";
import type { Country } from "../types/Country";
import type { SelectChangeEvent } from "@mui/material/Select";

interface CountriesCardViewProps {
  countries: Country[];
  loading: boolean;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
  onView: (country: Country) => void;
  onAdd: () => void;
  t: (key: string) => string;
}

const CountriesCardView = ({
  countries,
  loading,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}: CountriesCardViewProps) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [bookmarkedCountries, setBookmarkedCountries] = useState<Set<string | number>>(new Set());
  const [ratedCountries, setRatedCountries] = useState<Map<string | number, number>>(new Map());
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);

  // Search derived state using the new hook
  const normalizedSearch = useMemo(() => {
    const s = searchTerm.trim();
    return s.startsWith("+") ? s.slice(1) : s;
  }, [searchTerm]);
  const searchedCountries = useCountrySearch(normalizedSearch, countries || []);
  
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
    if (isLg) return 12;  // Desktop: 4 columns
    if (isXl) return 12;  // Large desktop: 5+ columns
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

  // Reset to first page when search or filters change
  useEffect(() => {
    setPage(0);
  }, [normalizedSearch, filterBy, sortBy]);

  // Enhanced data processing with search, filter, and sort
  const processedCountries = useMemo(() => {
    if (!countries) return [];

    let filteredCountries = [...searchedCountries];

    // Apply additional filters
    if (filterBy !== "all") {
      switch (filterBy) {
        case "bookmarked":
          filteredCountries = filteredCountries.filter(country => bookmarkedCountries.has(country.id));
          break;
        case "rated":
          filteredCountries = filteredCountries.filter(country => ratedCountries.has(country.id));
          break;
        case "recent":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filteredCountries = filteredCountries.filter(country => 
            country.createdOn && new Date(country.createdOn) > thirtyDaysAgo
          );
          break;
        case "hasPhone":
          filteredCountries = filteredCountries.filter(country => country.phoneCode);
          break;
        case "hasCurrency":
          filteredCountries = filteredCountries.filter(country => country.currencyCode);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filteredCountries.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = (a.nameEn || "").localeCompare(b.nameEn || "");
          break;
        case "alpha2":
          comparison = (a.alpha2Code || "").localeCompare(b.alpha2Code || "");
          break;
        case "alpha3":
          comparison = (a.alpha3Code || "").localeCompare(b.alpha3Code || "");
          break;
        case "phone": {
          const phoneA = Number(a.phoneCode) || 0;
          const phoneB = Number(b.phoneCode) || 0;
          comparison = phoneA - phoneB;
          break;
        }
        case "currency":
          comparison = (a.currencyCode || "").localeCompare(b.currencyCode || "");
          break;
        case "created":
          comparison = new Date(a.createdOn || 0).getTime() - new Date(b.createdOn || 0).getTime();
          break;
        case "rating":
          const ratingA = ratedCountries.get(a.id) || 0;
          const ratingB = ratedCountries.get(b.id) || 0;
          comparison = ratingA - ratingB;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filteredCountries;
  }, [searchedCountries, sortBy, sortOrder, filterBy, bookmarkedCountries, ratedCountries]);

  // Paginated data
  const paginatedCountries = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedCountries.slice(startIndex, startIndex + rowsPerPage);
  }, [processedCountries, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    void event;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // Simple navigation to last page
  const navigateToLastPage = () => {
    console.log('Navigating to last page...');
    const totalCountries = countries ? countries.length : 0;
    const totalPages = Math.ceil(totalCountries / rowsPerPage);
    const lastPage = Math.max(0, totalPages - 1);
    console.log(`Total countries: ${totalCountries}, Total pages: ${totalPages}, Last page: ${lastPage}`);
    setPage(lastPage);
  };

  // Enhanced onAdd function with multiple navigation attempts
  const handleAdd = () => {
    if (onAdd) {
      console.log('=== ADDING NEW COUNTRY ===');
      console.log('Current countries length:', countries ? countries.length : 0);
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

  const toggleBookmark = (countryId: string | number) => {
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

  const setRating = (countryId: string | number, rating: number) => {
    setRatedCountries(prev => {
      const newMap = new Map(prev);
      if (rating === 0) {
        newMap.delete(countryId);
      } else {
        newMap.set(countryId, rating);
      }
      return newMap;
    });
  };

  const getQualityScore = (country: Country) => {
    let score = 50; // Base score
    if (country.nameEn) score += 15;
    if (country.nameAr) score += 15;
    if (country.alpha2Code) score += 5;
    if (country.alpha3Code) score += 5;
    if (country.phoneCode) score += 5;
    if (country.currencyCode) score += 5;
    return Math.min(score, 100);
  };

  const getQualityLevel = (score: number) => {
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

  if (!countries || countries.length === 0) {
    return (
      <Box>
        {/* Empty State Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" color="primary.main" fontWeight="bold" gutterBottom>
            Countries Card View
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No countries available to display
          </Typography>
        </Paper>
        
        {/* Empty State Content */}
        <Paper sx={{ 
          p: 6, 
          textAlign: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`
        }}>
          <Public sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No Countries Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Start building your geographic database by adding countries. You'll be able to search, filter, and organize them in this enhanced card view.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<Public />}
            onClick={handleAdd}
            sx={{ mt: 2 }}
          >
            Add Your First Country
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
              Countries Card View
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and manage {processedCountries.length} countries with enhanced search and filtering
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`${processedCountries.length} Countries`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${bookmarkedCountries.size} Bookmarked`} 
              color="warning" 
              variant="outlined"
            />
            <Chip 
              label={`${ratedCountries.size} Rated`} 
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
              placeholder="Search countries by name, code, phone, or currency..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
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
                <MenuItem value="alpha2">Alpha-2 Code</MenuItem>
                <MenuItem value="alpha3">Alpha-3 Code</MenuItem>
                <MenuItem value="phone">Phone Code</MenuItem>
                <MenuItem value="currency">Currency</MenuItem>
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
              onChange={(event, value) => { void event; if (value) setSortOrder(value); }}
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
                <MenuItem value="all">All Countries</MenuItem>
                <MenuItem value="bookmarked">Bookmarked</MenuItem>
                <MenuItem value="rated">Rated</MenuItem>
                <MenuItem value="recent">Recent (30 days)</MenuItem>
                <MenuItem value="hasPhone">Has Phone Code</MenuItem>
                <MenuItem value="hasCurrency">Has Currency</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Stack direction="column" spacing={1}>
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
              </Stack>
              
                          </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Cards Grid */}
      <Grid container spacing={3}>
        {paginatedCountries.map((country, index) => {
          const qualityScore = getQualityScore(country);
          const qualityInfo = getQualityLevel(qualityScore);
          const isBookmarked = bookmarkedCountries.has(country.id);
          const rating = ratedCountries.get(country.id) || 0;
          const isHovered = hoveredCard === country.id;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.id}>
              <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  onMouseEnter={() => setHoveredCard(country.id)}
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
                      toggleBookmark(country.id);
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
                    {/* Country Names */}
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
                        {country.nameEn || "N/A"}
                      </Typography>
                      {country.nameAr && (
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
                          {country.nameAr}
                        </Typography>
                      )}
                    </Box>

                    {/* Country Codes and ID */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                      {country.alpha2Code && (
                        <Chip
                          label={country.alpha2Code}
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
                      {country.alpha3Code && (
                        <Chip
                          label={country.alpha3Code}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            fontFamily: 'monospace',
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.secondary.main, 0.2),
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      )}
                      <Chip
                        label={`ID: ${country.id}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </Stack>

                    {/* Country Details */}
                    <Box sx={{ mb: 2 }}>
                      {country.phoneCode && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" fontWeight="medium">
                            +{country.phoneCode}
                          </Typography>
                        </Stack>
                      )}
                      {country.currencyCode && (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <AttachMoney sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" fontWeight="medium">
                            {country.currencyCode}
                          </Typography>
                        </Stack>
                      )}
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
                              setRating(country.id, star === rating ? 0 : star);
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
                          {country.createdOn
                            ? format(new Date(country.createdOn), "MMM dd, yyyy")
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
                          onClick={() => onView(country)}
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
                      
                      <Tooltip title={t("actions.edit") || "Edit Country"} arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(country)}
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
                      
                      <AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>
                        <Tooltip title={t("actions.delete") || "Delete Country"} arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(country)}
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
              Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, processedCountries.length)} of {processedCountries.length} countries
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
            count={Math.ceil(processedCountries.length / rowsPerPage)}
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
      {searchTerm && processedCountries.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
        }}>
          <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Countries Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No countries match your search criteria "{searchTerm}"
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

export default CountriesCardView;