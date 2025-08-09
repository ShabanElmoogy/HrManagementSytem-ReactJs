/* eslint-disable react/prop-types */
// components/EnhancedCardView.jsx
import { appPermissions } from "@/constants";
import {
  Delete,
  Edit,
  Visibility,
  Public,
  Flag,
  Phone,
  AttachMoney,
  Code,
  ExpandMore,
  ExpandLess,
  Bookmark,
  BookmarkBorder,
  Star,
  StarBorder,
  CalendarToday,
  TrendingUp,
  Analytics,
  Speed,
  DataUsage
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  alpha,
  useTheme,
  Stack,
  Avatar,
  Badge,
  LinearProgress,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Fade,
  Paper
} from "@mui/material";
import { format } from "date-fns";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";

const EnhancedCardView = ({
  processedData,
  expandedRegions,
  toggleRegionExpansion,
  bookmarkedCountries,
  toggleBookmark,
  animationEnabled,
  onView,
  onEdit,
  onDelete,
  t,
}) => {
  const theme = useTheme();

  const getQualityScore = (country) => {
    let score = 50; // Base score
    if (country.nameEn) score += 15;
    if (country.nameAr) score += 15;
    if (country.alpha2Code) score += 5;
    if (country.alpha3Code) score += 5;
    if (country.phoneCode) score += 5;
    if (country.currencyCode) score += 5;
    return Math.min(score, 100);
  };

  const getQualityLevel = (score) => {
    if (score >= 90) return { level: 'excellent', color: theme.palette.success.main };
    if (score >= 75) return { level: 'good', color: theme.palette.info.main };
    if (score >= 60) return { level: 'average', color: theme.palette.warning.main };
    return { level: 'poor', color: theme.palette.error.main };
  };

  return (
    <Grid container spacing={3}>
      {Object.entries(processedData.regions).map(([regionName, regionData]) => {
        const isExpanded = expandedRegions[regionName] ?? true;
        const regionColor = theme.palette.primary.main;
        
        return (
          <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={regionName}>
            <Fade in={true} timeout={600}>
              <Paper
                elevation={3}
                sx={{
                  height: 600, // Fixed height for all cards
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${alpha(regionColor, 0.04)} 0%, ${alpha(regionColor, 0.01)} 100%)`,
                  border: `2px solid ${alpha(regionColor, 0.1)}`,
                  borderRadius: 3,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: animationEnabled ? 'translateY(-8px)' : 'none',
                    boxShadow: `0 16px 48px ${alpha(regionColor, 0.15)}`,
                    borderColor: alpha(regionColor, 0.3)
                  }
                }}
              >
                {/* Region Header */}
                <Box
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    borderBottom: `2px solid ${alpha(regionColor, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(regionColor, 0.08)} 0%, ${alpha(regionColor, 0.03)} 100%)`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(regionColor, 0.12)
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
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          minWidth: 24,
                          height: 24
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: regionColor,
                          width: 56,
                          height: 56,
                          boxShadow: `0 4px 12px ${alpha(regionColor, 0.3)}`
                        }}
                      >
                        <Public sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Badge>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: regionColor,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {regionName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {regionData.totalCountries} countries • {regionData.qualityScore}% avg quality
                      </Typography>
                      
                      {/* Country Details */}
                      <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                        {regionData.alpha2Code && (
                          <Chip
                            label={`Code: ${regionData.alpha2Code}`}
                            size="small"
                            color="primary"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {regionData.phoneCode && (
                          <Chip
                            icon={<Phone sx={{ fontSize: 14 }} />}
                            label={`+${regionData.phoneCode}`}
                            size="small"
                            color="info"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {regionData.currencyCode && (
                          <Chip
                            icon={<AttachMoney sx={{ fontSize: 14 }} />}
                            label={regionData.currencyCode}
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Stack>
                      
                      {/* States Information */}
                      {regionData.states && regionData.states.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            States: {regionData.states.join(', ')}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Additional Details */}
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Chip
                          icon={<TrendingUp sx={{ fontSize: 16 }} />}
                          label={`${regionData.growthRate}%`}
                          size="small"
                          color={parseFloat(regionData.growthRate) >= 0 ? "success" : "error"}
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip
                          icon={<Analytics sx={{ fontSize: 16 }} />}
                          label={`${regionData.cities} cities`}
                          size="small"
                          color="info"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip
                          icon={<DataUsage sx={{ fontSize: 16 }} />}
                          label={`${regionData.qualityScore}%`}
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Stack>
                    </Box>

                    {/* Quality Progress */}
                    <Box sx={{ minWidth: 120 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Quality
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color={regionColor}>
                          {regionData.qualityScore}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={regionData.qualityScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.grey[300], 0.3),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${regionColor} 100%)`
                          },
                        }}
                      />
                    </Box>

                    <IconButton
                      sx={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        bgcolor: alpha(regionColor, 0.1),
                        border: `2px solid ${alpha(regionColor, 0.2)}`,
                        '&:hover': {
                          bgcolor: alpha(regionColor, 0.2),
                          borderColor: regionColor,
                          transform: isExpanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
                        }
                      }}
                    >
                      <ExpandMore sx={{ fontSize: 24 }} />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Countries List */}
                <Collapse in={isExpanded} timeout={500}>
                  <Box sx={{ p: 2 }}>
                    <List dense>
                      {regionData.countries.map((country, index) => {
                        const qualityScore = getQualityScore(country);
                        const qualityInfo = getQualityLevel(qualityScore);
                        const isBookmarked = bookmarkedCountries.has(country.id);
                        
                        return (
                          <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={country.id}>
                            <ListItem
                              sx={{
                                border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                                borderRadius: 2,
                                mb: 1.5,
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                  borderColor: alpha(theme.palette.primary.main, 0.3),
                                  transform: animationEnabled ? 'translateX(8px) scale(1.02)' : 'none',
                                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`
                                },
                              }}
                            >
                              <ListItemAvatar>
                                <Badge
                                  badgeContent={qualityScore}
                                  color={qualityScore >= 80 ? "success" : qualityScore >= 60 ? "warning" : "error"}
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      fontSize: '0.6rem',
                                      minWidth: 18,
                                      height: 18
                                    }
                                  }}
                                >
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: alpha(qualityInfo.color, 0.1), 
                                      color: qualityInfo.color,
                                      border: `2px solid ${alpha(qualityInfo.color, 0.2)}`
                                    }}
                                  >
                                    <Flag sx={{ fontSize: 20 }} />
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              
                              <ListItemText
                                primary={
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                      {country.nameEn || "N/A"}
                                    </Typography>
                                    
                                    {/* Country Codes */}
                                    {country.alpha2Code && (
                                      <Chip
                                        label={country.alpha2Code}
                                        size="small"
                                        sx={{
                                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                          color: theme.palette.primary.main,
                                          fontFamily: "monospace",
                                          fontSize: '0.7rem',
                                          height: 20,
                                          fontWeight: 'bold'
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
                                          height: 20,
                                          fontWeight: 'bold'
                                        }}
                                      />
                                    )}
                                    
                                    {isBookmarked && (
                                      <Bookmark sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                                    )}
                                  </Stack>
                                }
                                secondary={
                                  <Box>
                                    {/* Arabic Name */}
                                    {country.nameAr && (
                                      <Typography variant="body2" sx={{ direction: "rtl", mb: 0.5, fontStyle: 'italic' }}>
                                        {country.nameAr}
                                      </Typography>
                                    )}
                                    
                                    {/* Country Details */}
                                    <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                                      <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          ID:
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {country.id}
                                        </Typography>
                                      </Stack>
                                      
                                      {country.phoneCode && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                          <Phone sx={{ fontSize: 12, color: "text.secondary" }} />
                                          <Typography variant="caption" color="text.secondary">
                                            +{country.phoneCode}
                                          </Typography>
                                        </Stack>
                                      )}
                                      
                                      {country.currencyCode && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                          <AttachMoney sx={{ fontSize: 12, color: "text.secondary" }} />
                                          <Typography variant="caption" color="text.secondary">
                                            {country.currencyCode}
                                          </Typography>
                                        </Stack>
                                      )}
                                      
                                      {country.createdOn && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                          <CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
                                          <Typography variant="caption" color="text.secondary">
                                            {format(new Date(country.createdOn), "MMM dd, yyyy")}
                                          </Typography>
                                        </Stack>
                                      )}
                                    </Stack>
                                    
                                    {/* Quality Progress */}
                                    <Box sx={{ mt: 1 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={qualityScore}
                                        sx={{
                                          height: 4,
                                          borderRadius: 2,
                                          backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                          '& .MuiLinearProgress-bar': {
                                            borderRadius: 2,
                                            backgroundColor: qualityInfo.color,
                                          },
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                }
                              />
                              
                              <ListItemSecondaryAction>
                                <Stack direction="row" spacing={0.5}>
                                  <Tooltip title="Bookmark" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => toggleBookmark(country.id)}
                                      sx={{
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.warning.main, 0.2),
                                          borderColor: theme.palette.warning.main,
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      {isBookmarked ? 
                                        <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} /> : 
                                        <BookmarkBorder sx={{ fontSize: 16 }} />
                                      }
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Tooltip title={t("actions.view") || "View"} arrow>
                                    <IconButton
                                      size="small"
                                      color="info"
                                      onClick={() => onView(country)}
                                      sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.info.main, 0.2),
                                          borderColor: theme.palette.info.main,
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <Visibility sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Tooltip title={t("actions.edit") || "Edit"} arrow>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => onEdit(country)}
                                      sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                                          borderColor: theme.palette.primary.main,
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <Edit sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>
                                    <Tooltip title={t("actions.delete") || "Delete"} arrow>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(country)}
                                        sx={{
                                          bgcolor: alpha(theme.palette.error.main, 0.1),
                                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.error.main, 0.2),
                                            borderColor: theme.palette.error.main,
                                            transform: 'scale(1.1)'
                                          }
                                        }}
                                      >
                                        <Delete sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </AuthorizeView>
                                </Stack>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </Fade>
                        );
                      })}
                    </List>
                  </Box>
                </Collapse>
              </Paper>
            </Fade>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default EnhancedCardView;