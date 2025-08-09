/* eslint-disable react/prop-types */
// components/StatesMultiView.jsx
import {
  ViewModule,
  TableChart,
  Map,
  BarChart,
  Add,
  Refresh,
  FileDownload,
  FilterList,
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
import StatesDataGrid from "./statesDataGrid";
import StatesCardView from "./statesCardView";
import StatesMapView from "./statesMapView";
import StatesChartView from "./statesChartView";

const StatesMultiView = ({
  states,
  loading,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const theme = useTheme();
  
  // Use the useViewLayout hook for localStorage persistence
  const [viewType, handleViewChange] = useViewLayout(
    "states-view-layout", // localStorage key
    "grid", // default view
    ["grid", "cards", "map", "chart"] // valid view types
  );

  const viewOptions = [
    {
      value: "grid",
      label: t("states.views.grid") || "Grid",
      icon: <TableChart />,
    },
    {
      value: "cards",
      label: t("states.views.cards") || "Cards",
      icon: <ViewModule />,
    },
    {
      value: "map",
      label: t("states.views.map") || "Map",
      icon: <Map />,
    },
    {
      value: "chart",
      label: t("states.views.chart") || "Chart",
      icon: <BarChart />,
    },
  ];

  const handleRefresh = () => {
    // Add refresh logic here
    window.location.reload();
  };

  const handleExport = () => {
    // Add export logic here
    console.log("Export states data");
  };

  const handleFilter = () => {
    // Add filter logic here
    console.log("Open filter dialog");
  };

  const renderView = () => {
    const commonProps = {
      states,
      loading,
      onEdit,
      onDelete,
      onView,
      onAdd,
      t,
    };

    switch (viewType) {
      case "grid":
        return <StatesDataGrid {...commonProps} apiRef={apiRef} />;
      case "cards":
        return <StatesCardView {...commonProps} />;
      case "map":
        return <StatesMapView {...commonProps} />;
      case "chart":
        return <StatesChartView {...commonProps} />;
      default:
        return <StatesDataGrid {...commonProps} apiRef={apiRef} />;
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Fixed Header - Sticky on mobile */}
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
                {t("states.viewTitle") || "States Management"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`${states?.length || 0} ${t("states.total") || "Total"}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={viewOptions.find(opt => opt.value === viewType)?.label || viewType}
                  size="small"
                  color="secondary"
                  sx={{ 
                    backgroundColor: theme.palette.secondary.main + "20",
                    color: theme.palette.secondary.main,
                  }}
                />
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
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAdd}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {t("actions.add") || "Add"}
              </Button>
              
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

              <Tooltip title={t("actions.export") || "Export"} arrow>
                <IconButton
                  size="small"
                  onClick={handleExport}
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <FileDownload />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("actions.filter") || "Filter"} arrow>
                <IconButton
                  size="small"
                  onClick={handleFilter}
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* View Toggle */}
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewChange}
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
                  <Box sx={{ ml: 1, display: "block" }}>
                    {option.label}
                  </Box>
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
              {t("states.viewTitle") || "States Management"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`${states?.length || 0} ${t("states.total") || "Total"}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={viewOptions.find(opt => opt.value === viewType)?.label || viewType}
                size="small"
                color="secondary"
                sx={{ 
                  backgroundColor: theme.palette.secondary.main + "20",
                  color: theme.palette.secondary.main,
                }}
              />
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAdd}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                Add
              </Button>
              
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

              <Tooltip title={t("actions.export") || "Export"} arrow>
                <IconButton
                  size="small"
                  onClick={handleExport}
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    width: 32,
                    height: 32,
                  }}
                >
                  <FileDownload fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("actions.filter") || "Filter"} arrow>
                <IconButton
                  size="small"
                  onClick={handleFilter}
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    width: 32,
                    height: 32,
                  }}
                >
                  <FilterList fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* View Toggle - Always Visible */}
            <Box sx={{ flexShrink: 0 }}>
              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={handleViewChange}
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

      {/* Scrollable View Content */}
      <Box 
        sx={{ 
          flex: 1,
          minHeight: 0, // Important for flex child to allow shrinking
          overflow: "auto", // Allow content to scroll independently
          position: "relative",
        }}
      >
        {renderView()}
      </Box>
    </Box>
  );
};

export default StatesMultiView;