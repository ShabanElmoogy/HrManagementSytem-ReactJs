// @ts-nocheck
/* eslint-disable react/prop-types */
// components/CountriesMultiView.jsx
import { useState, useCallback } from "react";
import { Box } from "@mui/material";
import { MultiViewHeader } from "@/shared/components";
import CountriesDataGrid from "./countriesDataGrid";
import CountriesCardView from "./countriesCardView";
import CountriesChartView from "./countriesChartView";

const CountriesMultiView = ({
  countries,
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

  const handleExport = () => {
    // Add export logic here
    console.log("Export countries data");
  };

  const handleViewTypeChange = useCallback((newViewType) => {
    setCurrentViewType(newViewType);
  }, []);

  const renderView = () => {
    const commonProps = {
      countries,
      loading,
      onEdit,
      onDelete,
      onView,
      onAdd,
      t,
    };

    switch (currentViewType) {
      case "grid":
        return <CountriesDataGrid {...commonProps} apiRef={apiRef} />;
      case "cards":
        return <CountriesCardView {...commonProps} />;
      case "chart":
        return <CountriesChartView {...commonProps} />;
      default:
        return <CountriesDataGrid {...commonProps} apiRef={apiRef} />;
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
        title={t("countries.viewTitle") || "Countries Management"}
        storageKey="countries-view-layout"
        defaultView="grid"
        availableViews={["grid", "cards", "chart"]}
        viewLabels={{
          grid: t("countries.views.grid") || "Grid",
          cards: t("countries.views.cards") || "Cards",
          chart: t("countries.views.chart") || "Chart",
        }}
        onAdd={onAdd}
        dataCount={countries?.length || 0}
        totalLabel={t("countries.total") || "Total"}
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

export default CountriesMultiView;
