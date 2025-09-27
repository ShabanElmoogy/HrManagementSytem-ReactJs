/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { format } from "date-fns";

import { CardView } from "@/shared/components/cardView";
import UnifiedCardViewHeader from "@/shared/components/common/cardView/cardHeader/UnifiedCardViewHeader";
import UnifiedCardViewPagination from "@/shared/components/common/cardView/UnifiedCardViewPagination";
import { BadgePercentage, CreatedDateRow, HighlightBadge } from "@/shared/components/common/cardView/cardBody/UnifiedCardParts";
import { AppChip } from "@/shared/components";
import { useAddressTypeSearch } from "../hooks/useAddressTypeQueries";
import type { AddressType } from "../types/AddressType";
import { useTheme } from "@mui/material/styles";

// Local lightweight loading/empty states using shared components
import UnifiedLoadingState from "@/shared/components/common/cardView/UnifiedLoadingState";
import { EmptyState as ReusableEmptyState, NoResultsState as ReusableNoResultsState } from "@/shared/components/common/feedback";
import { useTranslation } from "react-i18next";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { CardActionsRow } from "@/shared/components/common/cardView/cardBody/UnifiedCardParts";
import { appPermissions } from "@/constants";

export interface AddressTypesCardViewProps {
  items: AddressType[];
  loading: boolean;
  onEdit: (item: AddressType) => void;
  onDelete: (item: AddressType) => void;
  onView: (item: AddressType) => void;
  onAdd: () => void;
  t: (key: string) => string;
  lastAddedId?: string | number | null;
  lastEditedId?: string | number | null;
  lastDeletedIndex?: number | null;
}

// Quality score is minimal for AddressType. Names present => quality up.
const getQualityScore = (item: AddressType) => {
  let score = 50;
  if (item.nameEn) score += 25;
  if (item.nameAr) score += 25;
  return Math.min(score, 100);
};

const AddressTypeCard: React.FC<{
  item: AddressType;
  index: number;
  isHovered: boolean;
  isHighlighted: boolean;
  highlightLabel?: string | null;
  onEdit: (item: AddressType) => void;
  onDelete: (item: AddressType) => void;
  onView: (item: AddressType) => void;
  onHover: (id: string | number | null) => void;
  t: (key: string) => string;
}> = ({ item, index, isHovered, isHighlighted, highlightLabel, onEdit, onDelete, onView, onHover, t }) => {
  const theme = useTheme();
  const qualityScore = getQualityScore(item);

  return (
    <CardView
      index={index}
      highlighted={isHighlighted}
      isHovered={isHovered}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      height={320}
      topRightBadge={<BadgePercentage value={qualityScore} highlighted={isHighlighted} color={theme.palette.primary.main} />}
      leftBadge={isHighlighted && highlightLabel ? <HighlightBadge label={highlightLabel} /> : undefined}
      title={item.nameEn || "N/A"}
      subtitle={item.nameAr || undefined}
      chips={
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          <AppChip label={`ID: ${item.id}`} colorKey="secondary" variant="outlined" monospace sx={{ fontSize: "0.7rem" }} />
        </Box>
      }
      content={
        <>
          <CreatedDateRow
            date={item.createdOn ? new Date(item.createdOn as any) : null}
            formatter={(d) => format(d, "MMM dd, yyyy")}
          />
        </>
      }
      footer={
        <CardActionsRow
          actions={[
            {
              key: "view",
              title: t("actions.view") || "View",
              color: "info",
              icon: <Visibility sx={{ fontSize: 16 }} />,
              onClick: () => onView(item),
            },
            {
              key: "edit",
              title: t("actions.edit") || "Edit",
              color: "primary",
              icon: <Edit sx={{ fontSize: 16 }} />,
              onClick: () => onEdit(item),
            },
            {
              key: "delete",
              title: t("actions.delete") || "Delete",
              color: "error",
              icon: <Delete sx={{ fontSize: 16 }} />,
              onClick: () => onDelete(item),
              requiredPermissions: [appPermissions.DeleteAddressTypes],
            },
          ]}
        />
      }
    />
  );
};

const AddressTypesCardView: React.FC<AddressTypesCardViewProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
  lastAddedId,
  lastEditedId,
  lastDeletedIndex,
}) => {
  const theme = useTheme();
  const { t: tr } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
  const [highlightedCard, setHighlightedCard] = useState<string | number | null>(null);
  const [highlightLabel, setHighlightLabel] = useState<string | null>(null);

  const normalizedSearch = useMemo(() => searchTerm.trim(), [searchTerm]);
  const searchedItems = useAddressTypeSearch(normalizedSearch, items || []);

  const getResponsiveItemsPerPage = () => 12; // simplified; Unified header/pagination will remain responsive visually
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => getResponsiveItemsPerPage());

  useEffect(() => {
    setPage(0);
  }, [normalizedSearch, filterBy, sortBy]);

  const processedItems = useMemo(() => {
    if (!items) return [];

    let filtered = [...searchedItems];

    if (filterBy !== "all") {
      switch (filterBy) {
        case "recent": {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filtered = filtered.filter((it: any) => it.createdOn && new Date(it.createdOn) > thirtyDaysAgo);
          break;
        }
        default:
          break;
      }
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = (a.nameEn || "").localeCompare(b.nameEn || "");
          break;
        case "created":
          cmp = new Date(a.createdOn || 0).getTime() - new Date(b.createdOn || 0).getTime();
          break;
        default:
          cmp = 0;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [searchedItems, sortBy, sortOrder, filterBy, items]);

  useEffect(() => {
    if (lastAddedId && processedItems.length > 0) {
      const idx = processedItems.findIndex((c) => c.id === lastAddedId);
      if (idx !== -1) {
        const targetPage = Math.floor(idx / rowsPerPage);
        setPage(targetPage);
        setHighlightedCard(lastAddedId);
        setHighlightLabel("New");
        setTimeout(() => {
          setHighlightedCard(null);
          setHighlightLabel(null);
        }, 5000);
      }
    }
  }, [lastAddedId, processedItems, rowsPerPage]);

  useEffect(() => {
    if (lastEditedId && processedItems.length > 0) {
      const idx = processedItems.findIndex((c) => c.id === lastEditedId);
      if (idx !== -1) {
        const targetPage = Math.floor(idx / rowsPerPage);
        setPage(targetPage);
        setHighlightedCard(lastEditedId);
        setHighlightLabel("Edited");
        setTimeout(() => {
          setHighlightedCard(null);
          setHighlightLabel(null);
        }, 5000);
      }
    }
  }, [lastEditedId, processedItems, rowsPerPage]);

  useEffect(() => {
    if (lastDeletedIndex !== null && lastDeletedIndex !== undefined && processedItems.length > 0) {
      const targetIndex = Math.max(0, Math.min((lastDeletedIndex as number) - 1, processedItems.length - 1));
      const targetPage = Math.floor(targetIndex / rowsPerPage);
      setPage(targetPage);
      if (processedItems[targetIndex]) {
        setHighlightedCard(processedItems[targetIndex].id);
        setHighlightLabel(null);
        setTimeout(() => {
          setHighlightedCard(null);
          setHighlightLabel(null);
        }, 5000);
      }
    }
  }, [lastDeletedIndex, processedItems, rowsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedItems.slice(startIndex, startIndex + rowsPerPage);
  }, [processedItems, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    void event;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const getItemsPerPageOptions = () => [6, 12, 24, 36];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("created");
    setSortOrder("asc");
    setFilterBy("all");
    setPage(0);
  };

  const handleAdd = useCallback(() => { onAdd && onAdd(); }, [onAdd]);

  if (loading) {
    return <UnifiedLoadingState />;
  }

  if (!items || items.length === 0) {
    return (
      <Box>
        <ReusableEmptyState
          icon={Visibility}
          title={tr("addressTypes.noData") || "No address types"}
          subtitle={tr("addressTypes.noDataDescription") || "Start by adding your first address type"}
          actionText={tr("addressTypes.add") || "Add Address Type"}
          onAction={handleAdd}
          iconSize="large"
        />
      </Box>
    );
  }

  return (
    <Box>
      <UnifiedCardViewHeader
        title={tr("addressTypes.mainTitle") || "Address Types Card View"}
        subtitle={`${tr("addressTypes.browseAndManage") || "Browse and manage"} ${processedItems.length} ${tr("addressTypes.browseDescription") || "address types with enhanced search and filtering"}`}
        mainChipLabel={`${processedItems.length} ${tr("addressTypes.addressType") || "Address Type"}`}
        page={page}
        searchTerm={searchTerm}
        searchPlaceholder={tr("addressTypes.searchPlaceHolder") || "Search address types by name..."}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        sortBy={sortBy}
        sortByOptions={[
          { value: "name", label: tr("general.nameEn") },
          { value: "created", label: tr("addressTypes.createdDate") || "Created Date" },
        ]}
        onSortByChange={(v) => setSortBy(v)}
        sortOrder={sortOrder}
        onSortOrderChange={(v) => setSortOrder(v)}
        filterBy={filterBy}
        filterOptions={[
          { value: "all", label: tr("addressTypes.all") || "All" },
          { value: "recent", label: tr("addressTypes.recent30Days") || "Recent (30 days)" },
        ]}
        onFilterByChange={(v) => setFilterBy(v)}
        onReset={handleReset}
      />

      <Grid container spacing={3}>
        {paginatedItems.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
            <AddressTypeCard
              item={item}
              index={index}
              isHovered={hoveredCard === item.id}
              isHighlighted={highlightedCard === item.id}
              highlightLabel={highlightedCard === item.id ? highlightLabel ?? undefined : undefined}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onHover={setHoveredCard}
              t={t}
            />
          </Grid>
        ))}
      </Grid>

      {processedItems.length > 0 && (
        <UnifiedCardViewPagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={processedItems.length}
          itemsPerPageOptions={getItemsPerPageOptions()}
          itemsLabel={tr("addressTypes.addressType") || "Address Type"}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {searchTerm && processedItems.length === 0 && (
        <ReusableNoResultsState
          searchTerm={searchTerm}
          onClearSearch={handleClearSearch}
          onClearFilters={filterBy !== "all" ? () => setFilterBy("all") : undefined}
          onRefresh={() => window.location.reload()}
          sx={{ mt: 3 }}
        />
      )}
    </Box>
  );
};

export default AddressTypesCardView;
export type { AddressType };
