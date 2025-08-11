// @ts-nocheck
/* eslint-disable react/prop-types */
// components/StatesMultiView.jsx
import { useState, useCallback } from "react";
import { Box } from "@mui/material";
import { MultiViewHeader } from "@/shared/components";
import StatesDataGrid from "./statesDataGrid";
import StatesCardView from "./statesCardView";
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
  // Initialize with default, will be updated by MultiViewHeader
  const [currentViewType, setCurrentViewType] = useState("grid");

  const handleRefresh = () => {
    // Add refresh logic here
    window.location.reload();
  };

  const handleViewTypeChange = useCallback((newViewType) => {
    setCurrentViewType(newViewType);
  }, []);

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

    switch (currentViewType) {
      case "grid":
        return <StatesDataGrid {...commonProps} apiRef={apiRef} />;
      case "cards":
        return <StatesCardView {...commonProps} />;
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
      {/* Shared Multi-View Header */}
      <MultiViewHeader
        title={t("states.viewTitle") || "States Management"}
        storageKey="states-view-layout"
        defaultView="grid"
        availableViews={["grid", "cards", "chart"]}
        viewLabels={{
          grid: t("states.views.grid") || "Grid",
          cards: t("states.views.cards") || "Cards",
          chart: t("states.views.chart") || "Chart",
        }}
        onAdd={onAdd}
        dataCount={states?.length || 0}
        totalLabel={t("states.total") || "Total"}
        onRefresh={handleRefresh}
        onViewTypeChange={handleViewTypeChange}
        t={t}
        showActions={{
          add: true,
          refresh: true,
          export: false,
          filter: false,
        }}
      />

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