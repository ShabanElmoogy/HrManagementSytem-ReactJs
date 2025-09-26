// @ts-nocheck
/* eslint-disable react/prop-types */
// components/StatesMultiView.tsx
import { MultiViewHeader } from "@/shared/components";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import StatesCardView from "./statesCardView";
import StatesChartView from "./statesChartView";
import StatesDataGrid from "./gridView/statesDataGrid";

const StatesMultiView = ({
  states,
  loading,
  isFetching,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onRefresh,
  t,
  lastAddedId,
  lastEditedId,
  lastDeletedIndex,
}) => {
  // Initialize with default, will be updated by MultiViewHeader
  const [currentViewType, setCurrentViewType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Use search results if searching, otherwise use original states
  const displayStates = states;
  const displayLoading = loading;

  const handleRefresh = () => {
    // Use the refresh function passed from parent (TanStack Query refetch)
    if (onRefresh) {
      onRefresh();
    } else {
      // Fallback to page reload if no refresh function provided
      window.location.reload();
    }
  };

  const handleExport = () => {
    // Add export logic here
    console.log("Export states data");
  };

  const handleViewTypeChange = useCallback((newViewType) => {
    setCurrentViewType(newViewType);
  }, []);

  const renderView = () => {
    const commonProps = {
      states: displayStates,
      loading: displayLoading,
      onEdit,
      onDelete,
      onView,
      onAdd,
      t,
      lastAddedId,
      lastEditedId,
      lastDeletedIndex,
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
        dataCount={displayStates?.length || 0}
        totalLabel={searchTerm ? (t("states.filtered") || "Filtered") : (t("states.total") || "Total")}
        onRefresh={handleRefresh}
        onExport={handleExport}
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