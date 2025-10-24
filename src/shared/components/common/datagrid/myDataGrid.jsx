/* eslint-disable react/prop-types */
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import { arSD } from "@mui/x-data-grid/locales";
import React from "react";
import { useTranslation } from "react-i18next";
import { MyCustomToolbar } from "./myCustomToolbar";

// Custom Footer Component with centered navigation and record info
const CustomFooterWithNavigation = ({
  apiRef,
  rows = [],
  onNavigationUpdate, // New prop to expose navigation update function
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isRTL = theme.direction === "rtl";

  // Get the current ordered row IDs (sorted order if grid sorting is active)
  const getOrderedIds = React.useCallback(() => {
    const api = apiRef?.current;
    if (api && typeof api.getSortedRowIds === "function") {
      return api.getSortedRowIds();
    }
    return rows.map((r) => r.id);
  }, [apiRef, rows]);

  // Separate state for navigation counter - NEVER auto-updated
  const [navigationCounter, setNavigationCounter] = React.useState(1);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  // Function to sync navigation with current selection
  const syncNavigationWithSelection = React.useCallback(() => {
    const orderedIds = getOrderedIds();
    if (!apiRef?.current || orderedIds.length === 0) {
      setNavigationCounter(orderedIds.length > 0 ? 1 : 0);
      return;
    }

    const selection = apiRef.current.getSelectedRows();
    if (selection && selection.size > 0) {
      const selectedId = Array.from(selection.keys())[0];
      const rowIndex = orderedIds.findIndex((id) => id === selectedId);
      if (rowIndex !== -1) {
        setNavigationCounter(rowIndex + 1);
        return;
      }
    }
    // No selection or not found, set to first record
    setNavigationCounter(1);
  }, [apiRef, getOrderedIds]);

  // Expose the sync function to parent component
  React.useEffect(() => {
    if (onNavigationUpdate) {
      onNavigationUpdate(syncNavigationWithSelection);
    }
  }, [onNavigationUpdate, syncNavigationWithSelection]);

  // Initialize counter when data loads or order changes
  React.useEffect(() => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length > 0) {
      syncNavigationWithSelection();
    } else {
      setNavigationCounter(0);
    }
  }, [getOrderedIds, syncNavigationWithSelection]);

  // Listen to pagination and sort changes
  React.useEffect(() => {
    if (!apiRef?.current) return;

    const handlePaginationChange = () => {
      const model = apiRef.current.state.pagination.paginationModel;
      setPaginationModel(model);
    };

    const unsubscribeSelection = apiRef.current.subscribeEvent(
      "rowSelectionChange",
      () => {
        // Do nothing - we control the counter manually
      }
    );

    const unsubscribePagination = apiRef.current.subscribeEvent(
      "paginationModelChange",
      handlePaginationChange
    );

    const unsubscribeSort = apiRef.current.subscribeEvent(
      "sortModelChange",
      () => {
        // When sorting changes, sync the counter with the current selection and new order
        syncNavigationWithSelection();
      }
    );

    return () => {
      unsubscribeSelection();
      unsubscribePagination();
      unsubscribeSort();
    };
  }, [apiRef, syncNavigationWithSelection]);

  // Manual navigation - DIRECT counter control
  const handleGoToFirstRecord = () => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length === 0) return;

    setNavigationCounter(1); // Force counter to 1

    if (apiRef?.current) {
      const targetRowId = orderedIds[0];
      apiRef.current.setPage(0);

      setTimeout(() => {
        apiRef.current.setRowSelectionModel([targetRowId]);
        apiRef.current.scrollToIndexes({ rowIndex: 0 });
      }, 100);
    }
  };

  const handleGoToPreviousRecord = () => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length === 0 || navigationCounter <= 1) return;

    const newCounter = navigationCounter - 1;
    setNavigationCounter(newCounter); // Force counter update

    if (apiRef?.current) {
      const targetIndex = newCounter - 1; // 0-based
      const targetRowId = orderedIds[targetIndex];
      const pageSize = paginationModel.pageSize || 5;
      const targetPage = Math.floor(targetIndex / pageSize);

      if (targetPage !== paginationModel.page) {
        apiRef.current.setPage(targetPage);
        setTimeout(() => {
          apiRef.current.setRowSelectionModel([targetRowId]);
          const rowIndexOnPage = targetIndex % pageSize;
          apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
        }, 100);
      } else {
        apiRef.current.setRowSelectionModel([targetRowId]);
        const rowIndexOnPage = targetIndex % pageSize;
        apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
      }
    }
  };

  const handleGoToNextRecord = () => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length === 0 || navigationCounter >= orderedIds.length) return;

    const newCounter = navigationCounter + 1;
    setNavigationCounter(newCounter); // Force counter update

    if (apiRef?.current) {
      const targetIndex = newCounter - 1; // 0-based
      const targetRowId = orderedIds[targetIndex];
      const pageSize = paginationModel.pageSize || 5;
      const targetPage = Math.floor(targetIndex / pageSize);

      if (targetPage !== paginationModel.page) {
        apiRef.current.setPage(targetPage);
        setTimeout(() => {
          apiRef.current.setRowSelectionModel([targetRowId]);
          const rowIndexOnPage = targetIndex % pageSize;
          apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
        }, 100);
      } else {
        apiRef.current.setRowSelectionModel([targetRowId]);
        const rowIndexOnPage = targetIndex % pageSize;
        apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
      }
    }
  };

  const handleGoToLastRecord = () => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length === 0) return;

    setNavigationCounter(orderedIds.length); // Force counter to last

    if (apiRef?.current) {
      const targetIndex = orderedIds.length - 1;
      const targetRowId = orderedIds[targetIndex];
      const pageSize = paginationModel.pageSize || 5;
      const lastPage = Math.max(0, Math.ceil(orderedIds.length / pageSize) - 1);

      apiRef.current.setPage(lastPage);
      setTimeout(() => {
        apiRef.current.setRowSelectionModel([targetRowId]);
        const rowIndexOnPage = targetIndex % pageSize;
        apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
      }, 100);
    }
  };

  const orderedCount = getOrderedIds().length;
  const totalPages = Math.ceil(orderedCount / paginationModel.pageSize);
  const currentPage = paginationModel.page + 1;

  // Icon components based on direction
  const FirstIcon = isRTL ? LastPageIcon : FirstPageIcon;
  const LastIcon = isRTL ? FirstPageIcon : LastPageIcon;
  const PreviousIcon = isRTL ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRTL ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <GridFooterContainer
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        minHeight: 52,
        paddingLeft: 2,
        paddingRight: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: "0 0 150px" }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
          flex: "1",
        }}
      >
        <Tooltip title={t("pagination.goToFirstRecord") || "First Record"}>
          <span>
            <IconButton
              onClick={handleGoToFirstRecord}
              disabled={orderedCount === 0 || navigationCounter <= 1}
              size="small"
              sx={{
                padding: "6px",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <FirstIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip
          title={t("pagination.goToPreviousRecord") || "Previous Record"}
        >
          <span>
            <IconButton
              onClick={handleGoToPreviousRecord}
              disabled={orderedCount === 0 || navigationCounter <= 1}
              size="small"
              sx={{
                padding: "6px",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <PreviousIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: "120px",
            justifyContent: "center",
            backgroundColor: theme.palette.action.hover,
            borderRadius: 1,
            px: 2,
            py: 0.5,
            mx: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: "0.875rem",
              direction: "ltr", // Keep numbers in LTR even in RTL mode
            }}
          >
            {orderedCount > 0
              ? `${navigationCounter} / ${orderedCount}`
              : "0 / 0"}
          </Typography>
        </Box>

        <Tooltip title={t("pagination.goToNextRecord") || "Next Record"}>
          <span>
            <IconButton
              onClick={handleGoToNextRecord}
              disabled={orderedCount === 0 || navigationCounter >= orderedCount}
              size="small"
              sx={{
                padding: "6px",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <NextIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={t("pagination.goToLastRecord") || "Last Record"}>
          <span>
            <IconButton
              onClick={handleGoToLastRecord}
              disabled={orderedCount === 0 || navigationCounter >= orderedCount}
              size="small"
              sx={{
                padding: "6px",
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <LastIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: "0 0 300px",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            minWidth: "80px",
            direction: "ltr", // Keep page numbers in LTR
          }}
        >
          {t("pagination.page") || "Page"} {currentPage}{" "}
          {t("pagination.of") || "of"} {totalPages}
        </Typography>

        <Box
          sx={{
            minWidth: "180px",
            "& .MuiTablePagination-root": {
              borderTop: "none",
              overflow: "visible",
            },
            "& .MuiTablePagination-toolbar": {
              minHeight: "52px",
              paddingLeft: 0,
              paddingRight: 0,
              overflow: "visible",
            },
            "& .MuiTablePagination-displayedRows": {
              display: "none",
            },
            "& .MuiTablePagination-actions": {
              display: "none",
            },
            "& .MuiTablePagination-select": {
              minWidth: "60px",
            },
            "& .MuiSelect-select": {
              paddingRight: "32px !important",
            },
            "& .MuiInputBase-root": {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              "&:hover": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        >
          <GridPagination />
        </Box>
      </Box>
    </GridFooterContainer>
  );
};

const dataGridStyles = {
  "& .highlighted-row": {
    backgroundColor: "#ffe0b2 !important",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 52,
    borderTop: "1px solid",
    borderColor: "divider",
    padding: 0,
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    my: "auto",
  },
  "&.no-navigation .MuiDataGrid-footerContainer": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: (theme) => theme.palette.primary.light + "30",
    "&:hover": {
      backgroundColor: (theme) => theme.palette.primary.light + "40",
    },
  },
};

const MyDataGrid = ({
  rows = [],
  columns = [],
  loading = false,
  apiRef = null,
  sortModel = [{ field: "id", sort: "asc" }],
  filterMode = "client",
  addNewRow = () => {},
  rowId = (row) => row.id,
  showAddButton = true,
  fileName,
  reportPdfHeader,
  t = (key) => key,
  showNavigationButtons = true,
  onNavigationUpdate = null,
  excludeColumnsFromExport = [],
  viewMode = "list",
  onViewModeChange = () => {}, // Make optional with a default empty function
  lastAddedId = null,
  lastEditedId = null,
  lastDeletedIndex = null,
  ...otherProps
}) => {
  const theme = useTheme();

  // Store the navigation update function
  const navigationUpdateRef = React.useRef(null);

  // Effect to handle last added/edited/deleted row selection and scroll
  React.useEffect(() => {
    if (!apiRef?.current || rows.length === 0) return;

    const selectAndScroll = (id) => {
      const orderedIds = apiRef.current.getSortedRowIds();
      const rowIndex = orderedIds.findIndex((rowId) => rowId === id);

      if (rowIndex !== -1) {
        const pageSize = apiRef.current.state.pagination.paginationModel.pageSize;
        const targetPage = Math.floor(rowIndex / pageSize);
        const rowIndexOnPage = rowIndex % pageSize;

        // Set page first, then select and scroll after a short delay
        apiRef.current.setPage(targetPage);
        setTimeout(() => {
          apiRef.current.setRowSelectionModel([id]);
          apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });

          // Trigger navigation update to sync counter
          if (navigationUpdateRef.current) {
            navigationUpdateRef.current();
          }
        }, 200); // Increased inner delay to allow page change to render
      }
    };

    // Use a timeout to ensure the grid has rendered the new rows
    // before attempting to select and scroll.
    const timer = setTimeout(() => {
      if (lastAddedId && rows.some(row => row.id === lastAddedId)) {
        selectAndScroll(lastAddedId);
      } else if (lastEditedId && rows.some(row => row.id === lastEditedId)) {
        selectAndScroll(lastEditedId);
      } else if (lastDeletedIndex !== null) {
        // For deleted, try to select the row at the same index if it exists
        // Or the last row if the deleted was the last one
        const orderedIds = apiRef.current.getSortedRowIds();
        const targetIndex = Math.min(lastDeletedIndex, orderedIds.length - 1);
        if (targetIndex >= 0) {
          selectAndScroll(orderedIds[targetIndex]);
        }
      }
    }, 300); // Increased delay to allow page change and row rendering

    return () => clearTimeout(timer);
  }, [apiRef, rows, lastAddedId, lastEditedId, lastDeletedIndex]);

  const getLocaleText = () => {
    if (theme.direction !== "rtl") return {};
    return {
      ...arSD.components.MuiDataGrid.defaultProps.localeText,
      toolbarFilters: "تصفية البيانات",
      filterOperatorDoesNotContain: "لا يحتوى",
      filterOperatorDoesNotEqual: "لا يساوى",
    };
  };

  // Expose navigation update function to parent
  React.useEffect(() => {
    if (onNavigationUpdate && navigationUpdateRef.current) {
      onNavigationUpdate(navigationUpdateRef.current);
    }
  }, [onNavigationUpdate]);

  return (
    <Box sx={{ minWidth: "1200px" }}>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        loading={loading}
        apiRef={apiRef}
        filterMode={filterMode}
        getRowId={rowId}
        localeText={getLocaleText()}
        initialState={{
          sorting: {
            sortModel: sortModel,
          },
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        sx={{
          ...dataGridStyles,
          ...(showNavigationButtons
            ? {}
            : { "&": { "&.no-navigation": true } }),
        }}
        slots={{
          toolbar: () => (
            <MyCustomToolbar
              showAddButton={showAddButton}
              addNewRow={addNewRow}
              fileName={fileName}
              reportPdfHeader={reportPdfHeader}
              excludeColumnsFromExport={excludeColumnsFromExport}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          ),
          ...(showNavigationButtons && {
            footer: () => (
              <CustomFooterWithNavigation
                apiRef={apiRef}
                rows={rows}
                t={t}
                onNavigationUpdate={(updateFn) => {
                  navigationUpdateRef.current = updateFn;
                }}
              />
            ),
          }),
        }}
        {...otherProps}
      />
    </Box>
  );
};

export default MyDataGrid;
