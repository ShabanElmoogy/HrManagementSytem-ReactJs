// @ts-nocheck
/* eslint-disable react/prop-types */
// components/CountriesMultiView.jsx
import { useState, useCallback } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { MultiViewHeader } from "@/shared/components";
import CountriesDataGrid from "./countriesDataGrid.tsx";
import CountriesCardView from "./countriesCardView";
import CountriesChartView from "./countriesChartView";
import { useCountrySearch } from "../hooks/useCountryQueries";

const CountriesMultiView = ({
  countries,
  loading,
  isFetching,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onRefresh,
  t,
}) => {
  // Initialize with default, will be updated by MultiViewHeader
  const [currentViewType, setCurrentViewType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use search hook with TanStack Query
  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useCountrySearch(searchTerm, {
    enabled: searchTerm.length > 0, // Only search when there's a search term
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Use search results if searching, otherwise use original countries
  const displayCountries = searchTerm ? searchResults : countries;
  const displayLoading = searchTerm ? isSearching : loading;

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
    console.log("Export countries data");
  };

  const handleViewTypeChange = useCallback((newViewType) => {
    setCurrentViewType(newViewType);
  }, []);

  const renderView = () => {
    const commonProps = {
      countries: displayCountries,
      loading: displayLoading,
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
        dataCount={displayCountries?.length || 0}
        totalLabel={searchTerm ? (t("countries.filtered") || "Filtered") : (t("countries.total") || "Total")}
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

      {/* Search Input */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          size="small"
          placeholder={t("countries.search.placeholder") || "Search countries by name, code, or phone..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            }
          }}
        />
        {searchTerm && (
          <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
            {isSearching 
              ? (t("countries.search.searching") || "Searching...") 
              : (t("countries.search.results", { count: displayCountries?.length || 0 }) || 
                 `Found ${displayCountries?.length || 0} countries`)
            }
          </Box>
        )}
      </Box>

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
