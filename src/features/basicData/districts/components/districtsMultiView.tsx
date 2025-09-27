import { MultiViewHeader } from "@/shared/components";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import type { GridApiCommon } from "@mui/x-data-grid";
import type { District } from "../types/District";
import DistrictsCardView from "./districtsCardView";
import DistrictsChartView from "./districtsChartView";
import DistrictsDataGrid from "./gridView/districtsDataGrid";

interface DistrictsMultiViewProps {
  districts: District[];
  loading: boolean;
  isFetching?: boolean;
  apiRef?: React.RefObject<GridApiCommon>;
  onEdit: (district: District) => void;
  onDelete: (district: District) => void;
  onView: (district: District) => void;
  onAdd: () => void;
  onRefresh?: () => void;
  t: (key: string, options?: any) => string;
  lastAddedId?: string | number | null;
  lastEditedId?: string | number | null;
  lastDeletedIndex?: number | null;
}

const DistrictsMultiView = ({
  districts,
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
}: DistrictsMultiViewProps) => {
  const [currentViewType, setCurrentViewType] = useState<"grid" | "cards" | "chart">("grid");
  const [searchTerm] = useState("");

  const displayDistricts = districts;
  const displayLoading = loading;

  
  const handleExport = () => {
    console.log("Export districts data");
  };

  const handleViewTypeChange = useCallback((newViewType: "grid" | "cards" | "chart") => {
    setCurrentViewType(newViewType);
  }, []);

  const renderView = () => {
    switch (currentViewType) {
      case "grid":
        return (
          <DistrictsDataGrid
            districts={displayDistricts}
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
          <DistrictsCardView
            districts={displayDistricts}
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
          <DistrictsChartView
            districts={displayDistricts}
            loading={displayLoading}
            onAdd={onAdd}
            t={t}
          />
        );
      default:
        return (
          <DistrictsDataGrid
            districts={displayDistricts}
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", position: "relative" }}>
      <MultiViewHeader
        title={t("districts.viewTitle") || "Districts Management"}
        storageKey="districts-view-layout"
        defaultView="grid"
        availableViews={["grid", "cards", "chart"]}
        viewLabels={{
          grid: t("districts.views.grid") || "Grid",
          cards: t("districts.views.cards") || "Cards",
          chart: t("districts.views.chart") || "Chart",
        }}
        onAdd={onAdd}
        dataCount={displayDistricts?.length || 0}
        totalLabel={searchTerm ? (t("districts.filtered") || "Filtered") : (t("districts.total") || "Total")}
        onRefresh={onRefresh}
        onExport={handleExport}
        onViewTypeChange={handleViewTypeChange}
        t={t}
        showActions={{ add: true, refresh: true, export: false, filter: false }}
        onFilter={undefined}
      />

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", position: "relative" }}>{renderView()}</Box>
    </Box>
  );
};

export default DistrictsMultiView;