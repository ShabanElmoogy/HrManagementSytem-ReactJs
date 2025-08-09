/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
  Chip,
  Stack,
  Avatar,
  Badge,
  Collapse,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Button,
  Fade,
  Zoom
} from "@mui/material";
import {
  LocationOn,
  Flag,
  ExpandMore,
  Visibility,
  Edit,
  Delete,
  Bookmark,
  BookmarkBorder,
  Star,
  TrendingUp,
  TrendingDown,
  Public,
  Analytics,
  Speed,
  DataUsage,
  Timeline,
  Place,
  Language
} from "@mui/icons-material";
import { useState } from "react";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";
import { appPermissions } from "@/constants";

const EnhancedCardView = ({
  processedData,
  expandedCountries,
  toggleCountryExpansion,
  bookmarkedStates,
  toggleBookmark,
  animationEnabled,
  onView,
  onEdit,
  onDelete,
  t
}) => {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Grid container spacing={3}>
      {Object.entries(processedData.countries).map(([countryName, countryData], countryIndex) => {
        const isExpanded = expandedCountries[countryName] ?? true;
        const hasBookmarkedStates = countryData.states.some(state => bookmarkedStates.has(state.id));
        const qualityLevel = countryData.qualityScore >= 90 ? 'excellent' : 
                           countryData.qualityScore >= 75 ? 'good' : 
                           countryData.qualityScore >= 60 ? 'average' : 'poor';
        const isGrowthPositive = parseFloat(countryData.growthRate) >= 0;
        const isHovered = hoveredCard === countryName;
        
        return (
          <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={countryName}>
            <Paper
              elevation={isHovered ? 12 : 6}
              onMouseEnter={() => setHoveredCard(countryName)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                height: 680, // Increased height for enhanced content
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 50%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `2px solid ${alpha(theme.palette.primary.main, isHovered ? 0.3 : 0.1)}`,
                borderRadius: 4,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.3s ease'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)`,
                  pointerEvents: 'none',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                },
                transform: animationEnabled && isHovered ? 'translateY(-8px) scale(1.03)' : 
                          isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? 
                  `0 20px 60px ${alpha(theme.palette.primary.main, 0.25)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}` :
                  `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
              }}
            >
              {/* Enhanced Quality Badge */}
              <Zoom in={true} style={{ transitionDelay: `${countryIndex * 100}ms` }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 3,
                  }}
                >
                  <Chip
                    icon={<Star sx={{ fontSize: 14 }} />}
                    label={qualityLevel.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: qualityLevel === 'excellent' ? theme.palette.success.main :
                              qualityLevel === 'good' ? theme.palette.info.main :
                              qualityLevel === 'average' ? theme.palette.warning.main : theme.palette.error.main,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </Zoom>

              {/* Bookmark Indicator */}
              {hasBookmarkedStates && (
                <Fade in={true} style={{ transitionDelay: `${countryIndex * 150}ms` }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 3,
                    }}
                  >
                    <Chip
                      icon={<Bookmark sx={{ fontSize: 14 }} />}
                      label={`${countryData.states.filter(s => bookmarkedStates.has(s.id)).length} Saved`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                </Fade>
              )}

              {/* Enhanced Country Header */}
              <Box
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  transition: 'all 0.3s ease-in-out',
                  minHeight: 200, // Fixed header height
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
                onClick={() => toggleCountryExpansion(countryName)}
              >
                {/* Country Info Row */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Badge
                    badgeContent={countryData.totalStates}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                        minWidth: 24,
                        height: 24
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 56,
                        height: 56,
                        boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      }}
                    >
                      <Flag sx={{ fontSize: 28 }} />
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
                        whiteSpace: 'nowrap',
                        mb: 0.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      {countryName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Geographic Region • {countryData.regions.size || 1} regions
                    </Typography>
                  </Box>

                  <IconButton
                    sx={{ 
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        transform: isExpanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
                      }
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </Stack>

                {/* Enhanced Statistics Chips */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                  <Chip 
                    icon={<LocationOn sx={{ fontSize: 14 }} />}
                    label={`${countryData.totalStates} states`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      fontWeight: 'bold',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  <Chip 
                    icon={<DataUsage sx={{ fontSize: 14 }} />}
                    label={`${countryData.qualityScore}% quality`} 
                    size="small" 
                    color={countryData.qualityScore >= 85 ? "success" : "warning"} 
                    variant="outlined"
                    sx={{ 
                      fontWeight: 'bold',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                  <Chip 
                    icon={isGrowthPositive ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                    label={`${countryData.growthRate}% growth`} 
                    size="small" 
                    color={isGrowthPositive ? "success" : "error"} 
                    variant="outlined"
                    sx={{ 
                      fontWeight: 'bold',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                </Stack>

                {/* Enhanced Quality Progress Section */}
                <Box sx={{ mt: 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Data Quality Score
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">
                        {countryData.qualityScore}%
                      </Typography>
                      <Chip
                        label={qualityLevel}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.6rem',
                          bgcolor: alpha(
                            qualityLevel === 'excellent' ? theme.palette.success.main :
                            qualityLevel === 'good' ? theme.palette.info.main :
                            qualityLevel === 'average' ? theme.palette.warning.main : theme.palette.error.main,
                            0.2
                          ),
                          color: qualityLevel === 'excellent' ? theme.palette.success.main :
                                qualityLevel === 'good' ? theme.palette.info.main :
                                qualityLevel === 'average' ? theme.palette.warning.main : theme.palette.error.main
                        }}
                      />
                    </Stack>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={countryData.qualityScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, 
                          ${qualityLevel === 'excellent' ? theme.palette.success.main :
                            qualityLevel === 'good' ? theme.palette.info.main :
                            qualityLevel === 'average' ? theme.palette.warning.main : theme.palette.error.main} 0%, 
                          ${theme.palette.primary.main} 100%)`,
                        transition: 'all 0.3s ease'
                      },
                    }}
                  />
                  
                  {/* Mini Statistics */}
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Avg Pop: {(countryData.avgPopulation / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Area: {(countryData.totalArea / 1000).toFixed(0)}k km²
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dev Score: {countryData.developmentScore}%
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              {/* Enhanced States List */}
              <Collapse in={isExpanded} timeout={500} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box 
                  sx={{ 
                    p: 2,
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: alpha(theme.palette.grey[300], 0.2),
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.4),
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.6),
                      },
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    {countryData.states.map((state, index) => (
                      <Fade in={isExpanded} style={{ transitionDelay: `${index * 50}ms` }} key={state.id}>
                        <Card
                          sx={{
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                            overflow: 'hidden',
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              background: `linear-gradient(to bottom, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            },
                            '&:hover': {
                              transform: animationEnabled ? "translateX(8px) scale(1.02)" : "translateX(4px)",
                              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                              borderColor: alpha(theme.palette.primary.main, 0.4),
                              '&::before': {
                                opacity: 1
                              }
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              {/* Enhanced State Info */}
                              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                  <Avatar
                                    sx={{
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: theme.palette.primary.main,
                                      width: 24,
                                      height: 24
                                    }}
                                  >
                                    <LocationOn sx={{ fontSize: 14 }} />
                                  </Avatar>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    color="text.primary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1
                                    }}
                                  >
                                    {state.nameEn || "N/A"}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(state.id);
                                    }}
                                    sx={{ 
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        transform: 'scale(1.2)'
                                      }
                                    }}
                                  >
                                    {bookmarkedStates.has(state.id) ? 
                                      <Bookmark sx={{ fontSize: 16, color: theme.palette.warning.main }} /> : 
                                      <BookmarkBorder sx={{ fontSize: 16 }} />
                                    }
                                  </IconButton>
                                </Stack>
                                
                                {state.nameAr && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ 
                                      direction: "rtl", 
                                      mb: 1.5,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      fontStyle: 'italic'
                                    }}
                                  >
                                    {state.nameAr}
                                  </Typography>
                                )}
                                
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                                  {state.code && (
                                    <Chip
                                      label={state.code}
                                      size="small"
                                      sx={{
                                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                        color: theme.palette.primary.main,
                                        fontFamily: "monospace",
                                        fontWeight: "bold",
                                        fontSize: '0.75rem',
                                        height: 22,
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.primary.main, 0.25),
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
                                      fontSize: '0.65rem', 
                                      height: 22,
                                      '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  />
                                  {bookmarkedStates.has(state.id) && (
                                    <Chip
                                      icon={<Star sx={{ fontSize: 12 }} />}
                                      label="Saved"
                                      size="small"
                                      color="warning"
                                      sx={{ 
                                        fontSize: '0.65rem', 
                                        height: 22,
                                        fontWeight: 'bold'
                                      }}
                                    />
                                  )}
                                </Stack>

                                {/* Enhanced State Statistics */}
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    <Public sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                    Pop: {(Math.random() * 5 + 0.5).toFixed(1)}M
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    <Place sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                    Area: {(Math.random() * 50 + 10).toFixed(0)}k km²
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    <Analytics sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                    Quality: {Math.floor(Math.random() * 20) + 80}%
                                  </Typography>
                                </Stack>
                              </Box>

                              {/* Enhanced Action Buttons */}
                              <Stack direction="column" spacing={0.5} sx={{ flexShrink: 0 }}>
                                <Tooltip title={t("actions.view") || "View Details"} arrow placement="left">
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onView(state);
                                    }}
                                    sx={{
                                      bgcolor: alpha(theme.palette.info.main, 0.1),
                                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.info.main, 0.2),
                                        transform: 'scale(1.15) rotate(5deg)',
                                        borderColor: theme.palette.info.main
                                      }
                                    }}
                                  >
                                    <Visibility sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                
                                <Tooltip title={t("actions.edit") || "Edit State"} arrow placement="left">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(state);
                                    }}
                                    sx={{
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        transform: 'scale(1.15) rotate(-5deg)',
                                        borderColor: theme.palette.primary.main
                                      }
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                
                                <AuthorizeView requiredPermissions={[appPermissions.DeleteStates]}>
                                  <Tooltip title={t("actions.delete") || "Delete State"} arrow placement="left">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(state);
                                      }}
                                      sx={{
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.error.main, 0.2),
                                          transform: 'scale(1.15) rotate(5deg)',
                                          borderColor: theme.palette.error.main
                                        }
                                      }}
                                    >
                                      <Delete sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                </AuthorizeView>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Fade>
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default EnhancedCardView;