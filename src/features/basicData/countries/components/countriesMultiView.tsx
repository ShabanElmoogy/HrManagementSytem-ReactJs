import { MultiViewHeader } from "@/shared/components";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import type { GridApiCommon } from "@mui/x-data-grid";
import type { Country } from "../types/Country";
import CountriesCardView from "./countriesCardView";
import CountriesChartView from "./countriesChartView";
import CountriesDataGrid from "./gridView/countriesDataGrid";
import CountryReport from "../reports/CountryReport";
import ImportCountries from "./importData/ImportCountries";

interface CountriesMultiViewProps {
  countries: Country[];
  loading: boolean;
  isFetching?: boolean;
  apiRef?: React.RefObject<GridApiCommon>;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
  onView: (country: Country) => void;
  onAdd: () => void;
  onRefresh?: () => void;
  t: (key: string, options?: any) => string;
  lastAddedId?: string | number | null;
  lastEditedId?: string | number | null;
  lastDeletedIndex?: number | null;
}

const CountriesMultiView = ({
  countries,
  loading,
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
}: CountriesMultiViewProps) => {
  // Initialize with default, will be updated by MultiViewHeader
  const [currentViewType, setCurrentViewType] = useState<"grid" | "cards" | "chart" | "report" | "import">("grid");
  const [searchTerm] = useState("");

  // Use original countries and loading states (search is handled within specific views when applicable)
  const displayCountries = countries;
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
    console.log("Export countries data");
  };

  const handleViewTypeChange = useCallback((newViewType: "grid" | "cards" | "chart" | "report" | "import") => {
    setCurrentViewType(newViewType);
  }, []);

  const renderView = () => {
    switch (currentViewType) {
      case "grid":
        return (
          <CountriesDataGrid
            countries={displayCountries}
            loading={displayLoading}
            apiRef={apiRef}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onAdd={onAdd}
            t={t}
          />
        );
      case "cards":
        return (
          <CountriesCardView
            countries={displayCountries}
            loading={displayLoading}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onAdd={onAdd}
            t={t}
            lastAddedId={lastAddedId}
            lastEditedId={lastEditedId}
            lastDeletedIndex={lastDeletedIndex}
          />
        );
      case "chart":
        return (
          <CountriesChartView
            countries={displayCountries}
            loading={displayLoading}
            onAdd={onAdd}
            t={t}
          />
        );
      case "report":
        return <CountryReport />;
      case "import":
        return <ImportCountries />;
      default:
        return (
          <CountriesDataGrid
            countries={displayCountries}
            loading={displayLoading}
            apiRef={apiRef}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onAdd={onAdd}
            t={t}
          />
        );
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
      {/* <MultiViewHeader
        title={t("countries.viewTitle") || "Countries Management"}
        titleIcon={null}
        onBack={() => {}}
        storageKey="countries-view-layout"
        defaultView="grid"
        availableViews={["grid", "cards", "chart", "report", "import"]}
        viewLabels={{
          grid: t("countries.views.grid") || "Grid",
          cards: t("countries.views.cards") || "Cards",
          chart: t("countries.views.chart") || "Chart",
          report: t("countries.views.report") || "Report",
          import: t("countries.views.import") || "Import",
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
        }} onFilter={undefined}/> */}

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
