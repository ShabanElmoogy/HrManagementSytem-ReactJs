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

  // Separate state for navigation counter - NEVER auto-updated
  const [navigationCounter, setNavigationCounter] = React.useState(1);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  // Function to sync navigation with current selection
  const syncNavigationWithSelection = React.useCallback(() => {
    if (!apiRef?.current || rows.length === 0) {
      setNavigationCounter(rows.length > 0 ? 1 : 0);
      return;
    }

    const selection = apiRef.current.getSelectedRows();
    if (selection && selection.size > 0) {
      const selectedId = Array.from(selection.keys())[0];
      const rowIndex = rows.findIndex((row) => row.id === selectedId);
      if (rowIndex !== -1) {
        setNavigationCounter(rowIndex + 1);
      }
    } else {
      // No selection, set to first record
      setNavigationCounter(1);
    }
  }, [apiRef, rows]);

  // Expose the sync function to parent component
  React.useEffect(() => {
    if (onNavigationUpdate) {
      onNavigationUpdate(syncNavigationWithSelection);
    }
  }, [onNavigationUpdate, syncNavigationWithSelection]);

  // Initialize counter when data loads
  React.useEffect(() => {
    if (rows.length > 0) {
      syncNavigationWithSelection();
    } else {
      setNavigationCounter(0);
    }
  }, [rows.length, syncNavigationWithSelection]);

  // Listen ONLY to pagination changes
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

    return () => {
      unsubscribeSelection();
      unsubscribePagination();
    };
  }, [apiRef]);

  // Manual navigation - DIRECT counter control
  const handleGoToFirstRecord = () => {
    if (rows.length === 0) return;

    setNavigationCounter(1); // Force counter to 1

    if (apiRef?.current) {
      const targetRowId = rows[0].id;
      apiRef.current.setPage(0);

      setTimeout(() => {
        apiRef.current.setRowSelectionModel([targetRowId]);
        apiRef.current.scrollToIndexes({ rowIndex: 0 });
      }, 100);
    }
  };

  const handleGoToPreviousRecord = () => {
    if (rows.length === 0 || navigationCounter <= 1) return;

    const newCounter = navigationCounter - 1;
    setNavigationCounter(newCounter); // Force counter update

    if (apiRef?.current) {
      const targetIndex = newCounter - 1; // 0-based
      const targetRowId = rows[targetIndex].id;
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
    if (rows.length === 0 || navigationCounter >= rows.length) return;

    const newCounter = navigationCounter + 1;
    setNavigationCounter(newCounter); // Force counter update

    if (apiRef?.current) {
      const targetIndex = newCounter - 1; // 0-based
      const targetRowId = rows[targetIndex].id;
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
    if (rows.length === 0) return;

    setNavigationCounter(rows.length); // Force counter to last

    if (apiRef?.current) {
      const targetIndex = rows.length - 1;
      const targetRowId = rows[targetIndex].id;
      const pageSize = paginationModel.pageSize || 5;
      const lastPage = Math.max(0, Math.ceil(rows.length / pageSize) - 1);

      apiRef.current.setPage(lastPage);
      setTimeout(() => {
        apiRef.current.setRowSelectionModel([targetRowId]);
        const rowIndexOnPage = targetIndex % pageSize;
        apiRef.current.scrollToIndexes({ rowIndex: rowIndexOnPage });
      }, 100);
    }
  };

  const totalPages = Math.ceil(rows.length / paginationModel.pageSize);
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
              disabled={rows.length === 0 || navigationCounter <= 1}
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
              disabled={rows.length === 0 || navigationCounter <= 1}
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
            {rows.length > 0
              ? `${navigationCounter} / ${rows.length}`
              : "0 / 0"}
          </Typography>
        </Box>

        <Tooltip title={t("pagination.goToNextRecord") || "Next Record"}>
          <span>
            <IconButton
              onClick={handleGoToNextRecord}
              disabled={rows.length === 0 || navigationCounter >= rows.length}
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
              disabled={rows.length === 0 || navigationCounter >= rows.length}
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
  excludeColumnsFromExport=[], // New prop to get navigation update function
  ...otherProps
}) => {
  const theme = useTheme();

  // Store the navigation update function
  const navigationUpdateRef = React.useRef(null);

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
