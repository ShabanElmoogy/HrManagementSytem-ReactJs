// CountriesPageWithViews.js - Enhanced version with view layout state saving
import { MyContentsWrapper } from "@/layouts/components";
import { MyHeaderMultiViews } from "@/shared/components";
import { MyGenericListView, MySmallListView } from "@/shared/components/common/listView";
import { useViewLayout } from "@/shared/hooks";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useTheme } from "@mui/material";
import CountriesDashboardHeader from "./components/countriesDashboardHeader";
import CountriesDataGrid from "./components/countriesDataGrid";
import CountryDeleteDialog from "./components/countryDeleteDialog";
import CountryForm from "./components/countryForm";
import useCountryGridLogic from "./hooks/useCountryGridLogic";

const CountriesPageWithViews = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  // View layout state management with localStorage persistence
  const [viewLayout, handleViewLayoutChange] = useViewLayout(
    "countries-view-layout", // Storage key for this specific page
    "grid", // Default layout
    ["grid", "list", "smallList"] // Valid layouts
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
            getItemDescription={(country) => country.description || "No description"}
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

export default CountriesPageWithViews;