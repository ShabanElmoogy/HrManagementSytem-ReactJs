// CountriesPageAdvanced.js - Advanced example with enhanced view layout features
import { MyContentsWrapper } from "@/layouts/components";
import { MyHeaderMultiViews } from "@/shared/components";
import { MyGenericListView, MySmallListView } from "@/shared/components/common/listView";
import { useViewLayoutEnhanced } from "@/shared/hooks";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useTheme, Box, Chip, Typography } from "@mui/material";
import { GridView, ViewList, ViewHeadline } from "@mui/icons-material";
import CountriesDashboardHeader from "./components/countriesDashboardHeader";
import CountriesDataGrid from "./components/countriesDataGrid";
import CountryDeleteDialog from "./components/countryDeleteDialog";
import CountryForm from "./components/countryForm";
import useCountryGridLogic from "./hooks/useCountryGridLogic";

const CountriesPageAdvanced = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  // Enhanced view layout state management with advanced features
  const {
    viewLayout,
    layoutInfo,
    handleViewLayoutChange,
    setLayout,
    resetLayout,
    clearSavedLayout,
  } = useViewLayoutEnhanced(
    "countries-view-layout-advanced", // Unique storage key
    "grid", // Default layout
    ["grid", "list", "smallList"], // Valid layouts
    {
      // Auto-save with 500ms delay to prevent excessive localStorage writes
      autoSaveDelay: 500,
      
      // Responsive default: use smallList on mobile, list on tablet, grid on desktop
      getResponsiveDefault: () => {
        if (isSm) return "smallList";
        if (isMd) return "list";
        return "grid";
      },
      
      // Callback when layout changes
      onLayoutChange: (newLayout, oldLayout) => {
        console.log(`View layout changed from ${oldLayout} to ${newLayout}`);
      },
      
      // Enable debug logging
      debug: process.env.NODE_ENV === "development",
    }
  );

  // All logic is now in the hook
  const {
    dialogType,
    selectedCountry,
    loading,
    countries,
    apiRef,
    onEdit,
    onView,
    onDelete,
    onAdd,
    closeDialog,
    handleFormSubmit,
    handleDelete,
    SnackbarComponent,
  } = useCountryGridLogic(t);

  // Get layout display info
  const getLayoutInfo = (layout) => {
    const layouts = {
      grid: { icon: <GridView />, label: "Grid View", description: "Card-based grid layout" },
      list: { icon: <ViewList />, label: "List View", description: "Detailed list with descriptions" },
      smallList: { icon: <ViewHeadline />, label: "Compact View", description: "Compact list for mobile" },
    };
    return layouts[layout] || layouts.grid;
  };

  // Render the appropriate view based on selected layout
  const renderView = () => {
    switch (viewLayout) {
      case "list":
        return (
          <MyGenericListView
            items={countries}
            loading={loading}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            getItemTitle={(country) => country.name}
            getItemSubtitle={(country) => `Code: ${country.code}`}
            getItemDescription={(country) => country.description || "No description available"}
            renderItemActions={(country) => [
              {
                label: t("actions.edit"),
                onClick: () => onEdit(country),
                color: "primary",
              },
              {
                label: t("actions.view"),
                onClick: () => onView(country),
                color: "info",
              },
              {
                label: t("actions.delete"),
                onClick: () => onDelete(country),
                color: "error",
              },
            ]}
            emptyMessage={t("countries.noCountriesFound")}
            searchable={true}
            sortable={true}
          />
        );
      
      case "smallList":
        return (
          <MySmallListView
            items={countries}
            loading={loading}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            getItemTitle={(country) => country.name}
            getItemSubtitle={(country) => country.code}
            compact={isSm}
            showActions={!isSm}
          />
        );
      
      case "grid":
      default:
        return (
          <CountriesDataGrid
            countries={countries}
            loading={loading}
            apiRef={apiRef}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onAdd={onAdd}
            t={t}
          />
        );
    }
  };

  return (
    <>
      <MyContentsWrapper>
        {/* Enhanced header with view layout controls */}
        <MyHeaderMultiViews
          title={t("countries.title")}
          subTitle={t("countries.subTitle")}
          viewLayout={viewLayout}
          handleViewLayoutChange={handleViewLayoutChange}
          handleAddNew={onAdd}
          isMd={isMd}
        />

        {/* View Layout Info Panel (Development/Debug) */}
        {process.env.NODE_ENV === "development" && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              View Layout Debug Info
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                icon={getLayoutInfo(viewLayout).icon}
                label={`Current: ${getLayoutInfo(viewLayout).label}`}
                color="primary"
                size="small"
              />
              <Chip
                label={`Storage: ${layoutInfo.storageKey}`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={layoutInfo.isDefault ? "Default" : "Custom"}
                color={layoutInfo.isDefault ? "default" : "secondary"}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {getLayoutInfo(viewLayout).description}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Dashboard Header with Statistics */}
        <CountriesDashboardHeader
          countries={countries}
          loading={loading}
          t={t}
        />

        {/* Render the selected view */}
        {renderView()}
      </MyContentsWrapper>

      <CountryForm
        open={["edit", "add", "view"].includes(dialogType)}
        dialogType={dialogType}
        selectedCountry={selectedCountry}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        loading={loading}
        t={t}
      />

      <CountryDeleteDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        onConfirm={handleDelete}
        selectedCountry={selectedCountry}
        t={t}
      />
      {SnackbarComponent}
    </>
  );
};

export default CountriesPageAdvanced;