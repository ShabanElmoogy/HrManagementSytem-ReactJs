/* eslint-disable react/prop-types */
// Components/FilesDataGrid.jsx
import { useMemo, useCallback } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Tooltip, Chip } from "@mui/material";
import { Delete, Download, Visibility } from "@mui/icons-material";
import MyDataGrid from "../../../Shared/MyDataGrid";
import dayjs from "dayjs";
import { dateFormat } from "../../../Const/Strings";

const FilesDataGrid = ({
  files,
  loading,
  apiRef,
  onDownload,
  onView,
  onDelete,
  onAdd,
  t,
}) => {
  const showViewButton = [
    "mp4",
    "webm",
    "pdf",
    "mp3",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
  ];

  // Helper function to check if file can be viewed
  const canViewFile = useCallback(
    (file) => {
      const extension = file.fileExtension;
      if (!extension) return false;

      const cleanExtension = extension.startsWith(".")
        ? extension.substring(1).toLowerCase()
        : extension.toLowerCase();

      return showViewButton.includes(cleanExtension);
    },
    [showViewButton]
  );

  // Memoized action buttons
  const getActions = useCallback(
    (params) => {
      const actions = [
        <Tooltip title={t("download")} key={`download-${params.row.id}`} arrow>
          <GridActionsCellItem
            icon={<Download sx={{ fontSize: 25 }} />}
            label={t("download")}
            color="primary"
            onClick={() => onDownload(params.row)}
          />
        </Tooltip>,
      ];

      // Add view button for supported file types
      if (canViewFile(params.row)) {
        actions.push(
          <Tooltip title={t("view")} key={`view-${params.row.id}`} arrow>
            <GridActionsCellItem
              icon={<Visibility sx={{ fontSize: 25 }} />}
              label={t("view")}
              color="info"
              onClick={() => onView(params.row)}
            />
          </Tooltip>
        );
      }

      actions.push(
        <Tooltip title={t("delete")} key={`delete-${params.row.id}`} arrow>
          <GridActionsCellItem
            icon={<Delete sx={{ fontSize: 25 }} />}
            label={t("delete")}
            color="error"
            onClick={() => onDelete(params.row)}
          />
        </Tooltip>
      );

      return actions;
    },
    [t, onDownload, onView, onDelete, canViewFile]
  );

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("id"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fileName",
        headerName: t("fileName"),
        flex: 2,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fileExtension",
        headerName: t("extension"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "contentType",
        headerName: t("contentType"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "isDeleted",
        headerName: t("status"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value ? t("deleted") : t("active")}
            color={params.value ? "error" : "success"}
          />
        ),
      },
      {
        field: "createdOn",
        headerName: t("createdOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (params) =>
          params ? dayjs(params.value).format(dateFormat) : "",
      },
      {
        field: "updatedOn",
        headerName: t("updatedOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (params) =>
          params ? dayjs(params.value).format(dateFormat) : "",
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("actions"),
        flex: 1.2,
        align: "center",
        headerAlign: "center",
        getActions,
      },
    ],
    [t, getActions]
  );

  return (
    <MyDataGrid
      rows={files}
      columns={columns}
      loading={loading}
      apiRef={apiRef}
      filterMode="client"
      sortModel={[{ field: "createdOn", sort: "asc" }]}
      addNewRow={onAdd}
      pagination
      pageSizeOptions={[5, 10, 25]}
    />
  );
};

export default FilesDataGrid;
