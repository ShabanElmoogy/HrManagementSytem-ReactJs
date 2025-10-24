import { MultiViewHeader } from "@/shared/components";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import type { GridApiCommon } from "@mui/x-data-grid";
import type { AddressType } from "../types/AddressType";
import AddressTypesDataGrid from "./gridView/addressTypesDataGrid";
import AddressTypesCardView from "./addressTypesCardView";
import AddressTypesChartView from "./addressTypesChartView";

interface AddressTypesMultiViewProps {
  items: AddressType[];
  loading: boolean;
  isFetching?: boolean;
  apiRef?: React.RefObject<GridApiCommon>;
  onEdit: (item: AddressType) => void;
  onDelete: (item: AddressType) => void;
  onView: (item: AddressType) => void;
  onAdd: () => void;
  onRefresh?: () => void;
  t: (key: string, options?: any) => string;
  lastAddedId?: string | number | null;
  lastEditedId?: string | number | null;
  lastDeletedIndex?: number | null;
}

const AddressTypesMultiView = ({
  items,
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
}: AddressTypesMultiViewProps) => {
  const [currentViewType, setCurrentViewType] = useState<
    "grid" | "cards" | "chart"
  >("grid");
  const [searchTerm] = useState("");

  const displayItems = items;
  const displayLoading = loading;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleExport = () => {
    console.log("Export address types data");
  };

  const handleViewTypeChange = useCallback(
    (newViewType: "grid" | "cards" | "chart") => {
      setCurrentViewType(newViewType);
    },
    []
  );

  const renderView = () => {
    switch (currentViewType) {
      case "grid":
        return (
          <AddressTypesDataGrid
            items={displayItems}
            loading={displayLoading}
            apiRef={apiRef}
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
      case "cards":
        return (
          <AddressTypesCardView
            items={displayItems}
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
          <AddressTypesChartView
            items={displayItems}
            loading={displayLoading}
            onAdd={onAdd}
            t={t}
          />
        );
      default:
        return (
          <AddressTypesDataGrid
            items={displayItems}
            loading={displayLoading}
            apiRef={apiRef}
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
      <MultiViewHeader
        title={t("addressTypes.viewTitle") || "Address Types Management"}
        storageKey="addressTypes-view-layout"
        defaultView="grid"
        availableViews={["grid", "cards", "chart"]}
        viewLabels={{
          grid: t("addressTypes.views.grid") || "Grid",
          cards: t("addressTypes.views.card") || "Cards",
          chart: t("addressTypes.views.chart") || "Chart",
        }}
        onAdd={onAdd}
        dataCount={displayItems?.length || 0}
        totalLabel={
          searchTerm
            ? t("addressTypes.filtered") || "Filtered"
            : t("addressTypes.total") || "Total"
        }
        onRefresh={handleRefresh}
        onExport={handleExport}
        onViewTypeChange={handleViewTypeChange}
        t={t}
        showActions={{ add: true, refresh: true, export: false, filter: false }}
        onFilter={undefined}
      />

      <Box
        sx={{ flex: 1, minHeight: 0, overflow: "auto", position: "relative" }}
      >
        {renderView()}
      </Box>
    </Box>
  );
};

export default AddressTypesMultiView;
