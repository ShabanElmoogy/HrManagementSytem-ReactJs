/* eslint-disable react/prop-types */
import React, { Activity } from "react";
import {
  Add,
  Refresh,
  FileDownload,
  FilterList,
  ViewModule,
  TableChart,
  BarChart,
} from "@mui/icons-material";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import useViewLayout from "@/shared/hooks/useViewLayout";

const MultiViewHeader = ({
  // Required props
  title,
  onAdd,
  storageKey,

  // View configuration
  defaultView = "grid",
  availableViews = ["grid", "cards", "chart","report","import"],
  viewLabels = {},

  // Data props
  dataCount = 0,
  totalLabel = "Total",

  // Action handlers (optional)
  onRefresh,
  onExport,
  onFilter,

  // Translation function
  t = (key) => key,

  // Customization props
  showActions = {
    add: true,
    refresh: true,
    export: false,
    filter: false,
  },

  // Additional chips or content
  additionalChips = [],

  // Custom styling
  sx = {},

  // Callback for view changes (optional)
  onViewTypeChange,

  // View components with Activity support
  viewComponents = {},
  enableActivity = false,
}) => {
  const theme = useTheme();

  const [viewType, handleViewChange] = useViewLayout(
    storageKey,
    defaultView,
    availableViews
  );

  const getViewIcon = (view) => {
    const iconMap = {
      grid: <TableChart />,
      cards: <ViewModule />,
      chart: <BarChart />,
      list: <ViewModule />,
      smallList: <ViewModule />,
    };
    return iconMap[view] || <ViewModule />;
  };

  const getViewLabel = (view) => {
    const defaultLabels = {
      grid: "Grid",
      cards: "Cards",
      chart: "Chart",
      list: "List",
      smallList: "Small List",
    };

    return (
      viewLabels[view] || t(`views.${view}`) || defaultLabels[view] || view
    );
  };

  const viewOptions = availableViews.map((view) => ({
    value: view,
    label: getViewLabel(view),
    icon: getViewIcon(view),
  }));

  const handleViewChangeInternal = (event, newLayout) => {
    handleViewChange(event, newLayout);
    if (onViewTypeChange && newLayout) {
      onViewTypeChange(newLayout);
    }
  };

  React.useEffect(() => {
    if (onViewTypeChange) {
      onViewTypeChange(viewType);
    }
  }, [viewType, onViewTypeChange]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          mb: { xs: 2, md: 3 },
          borderRadius: { xs: 1, md: 2 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          position: { xs: "sticky", md: "static" },
          top: { xs: 0, md: "auto" },
          zIndex: { xs: 100, md: "auto" },
          flexShrink: 0,
          ...sx,
        }}
      >
        {/* Desktop Layout */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: { xs: "none", md: "flex" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Left Section - Title and Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Box>
              <Typography
                variant="h5"
                color="text.primary"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={
                    viewOptions.find((opt) => opt.value === viewType)?.label ||
                    viewType
                  }
                  size="small"
                  color="secondary"
                  sx={{
                    backgroundColor: theme.palette.secondary.main + "20",
                    color: theme.palette.secondary.main,
                  }}
                />
                {additionalChips.map((chip, index) => (
                  <Chip key={index} {...chip} />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right Section - Actions and View Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {/* Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {showActions.add && (
                <Tooltip title={t("actions.add") || "Add"} arrow>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                    size="small"
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                      px: 2,
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      color: theme.palette.primary.contrastText,
                      transition:
                        "transform 0.15s ease, box-shadow 0.15s ease, filter 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 6px 16px ${theme.palette.primary.main}50`,
                        filter: "brightness(1.02)",
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        boxShadow: `0 3px 8px ${theme.palette.primary.main}30`,
                      },
                      "& .MuiButton-startIcon": { mr: 1 },
                    }}
                  >
                    {t("actions.add") || "Add"}
                  </Button>
                </Tooltip>
              )}

              {showActions.refresh && (
                <Tooltip title={t("actions.refresh") || "Refresh"} arrow>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: theme.palette.action.hover,
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* View Toggle */}
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewChangeInternal}
              aria-label="view type"
              size="small"
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                "& .MuiToggleButton-root": {
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px !important",
                  mx: 0.25,
                  px: 1.5,
                  py: 0.75,
                  transition: "all 0.2s ease-in-out",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              {viewOptions.map((option) => (
                <ToggleButton
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                >
                  {option.icon}
                  <Box sx={{ ml: 1, display: "block" }}>{option.label}</Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Mobile Layout */}
        <Box
          sx={{
            p: 2,
            display: { xs: "block", md: "none" },
          }}
        >
          {/* Title and Stats */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "1.1rem",
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={`${dataCount} ${totalLabel}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={
                  viewOptions.find((opt) => opt.value === viewType)?.label ||
                  viewType
                }
                size="small"
                color="secondary"
                sx={{
                  backgroundColor: theme.palette.secondary.main + "20",
                  color: theme.palette.secondary.main,
                }}
              />
              {additionalChips.map((chip, index) => (
                <Chip key={index} {...chip} />
              ))}
            </Box>
          </Box>

          {/* Actions and View Toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              flexWrap: "nowrap",
            }}
          >
            {/* Action Buttons - Compact */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 1,
              }}
            >
              {showActions.add && (
                <Tooltip title={t("actions.add") || "Add"} arrow>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      minWidth: "auto",
                      px: 1.25,
                      boxShadow: `0 3px 10px ${theme.palette.primary.main}30`,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      color: theme.palette.primary.contrastText,
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 5px 14px ${theme.palette.primary.main}45`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        boxShadow: `0 2px 6px ${theme.palette.primary.main}25`,
                      },
                      "& .MuiButton-startIcon": { mr: 0.5 },
                    }}
                  >
                    {t("actions.add") || "Add"}
                  </Button>
                </Tooltip>
              )}

              {showActions.refresh && (
                <Tooltip title={t("actions.refresh") || "Refresh"} arrow>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: theme.palette.action.hover,
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* View Toggle - Always Visible */}
            <Box sx={{ flexShrink: 0 }}>
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewChangeInternal}
                aria-label="view type"
                size="small"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  boxShadow: `0 1px 3px ${theme.palette.divider}`,
                  "& .MuiToggleButton-root": {
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px !important",
                    mx: 0.125,
                    px: 0.5,
                    py: 0.5,
                    minWidth: 32,
                    height: 32,
                    transition: "all 0.2s ease-in-out",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 1px 3px ${theme.palette.primary.main}40`,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                }}
              >
                {viewOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                  >
                    {option.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* React 19 Activity Components for View Management */}
      {enableActivity && viewComponents && (
        <Box>
          {availableViews.map((view) => {
            const ViewComponent = viewComponents[view];
            if (!ViewComponent) return null;

            return (
              <Activity key={view} mode={viewType === view ? "visible" : "hidden"}>
                <ViewComponent />
              </Activity>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default MultiViewHeader;