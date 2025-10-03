// Components/FilesDataGrid.tsx - TypeScript implementation
import { useMemo, useCallback } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Delete, Download, Visibility } from "@mui/icons-material";
import MyDataGrid from "@/shared/components/common/datagrid/myDataGrid";
import type { FileItem } from "../types/File";
import type { TFunction } from "i18next";
import { renderDate } from "@/shared/components";

interface FilesDataGridProps {
  files: FileItem[];
  loading: boolean;
  apiRef: any;
  onDownload: (file: FileItem) => void;
  onView: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onAdd: () => void;
  t: TFunction;
}

/**
 * Supported file extensions for preview
 */
const VIEWABLE_EXTENSIONS = [
  "mp4",
  "webm",
  "pdf",
  "mp3",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
] as const;

const FilesDataGrid = ({
  files,
  loading,
  apiRef,
  onDownload,
  onView,
  onDelete,
  onAdd,
  t,
}: FilesDataGridProps) => {
  /**
   * Check if file can be viewed based on extension
   */
  const canViewFile = useCallback((file: FileItem): boolean => {
    const extension = file.fileExtension;
    if (!extension) return false;

    const cleanExtension = extension.startsWith(".")
      ? extension.substring(1).toLowerCase()
      : extension.toLowerCase();

    return VIEWABLE_EXTENSIONS.includes(cleanExtension as any);
  }, []);

  /**
   * Generate action buttons for each row
   */
  const getActions = useCallback(
    (params: any) => {
      const file = params.row as FileItem;
      const actions = [
        <Tooltip title={t("files.download")} key={`download-${file.id}`} arrow>
          <GridActionsCellItem
            icon={<Download sx={{ fontSize: 25 }} />}
            label={t("files.download")}
            color="primary"
            onClick={() => onDownload(file)}
          />
        </Tooltip>,
      ];

      // Add view button for supported file types
      if (canViewFile(file)) {
        actions.push(
          <Tooltip title={t("files.view")} key={`view-${file.id}`} arrow>
            <GridActionsCellItem
              icon={<Visibility sx={{ fontSize: 25 }} />}
              label={t("files.view")}
              color="info"
              onClick={() => onView(file)}
            />
          </Tooltip>
        );
      }

      actions.push(
        <Tooltip title={t("files.delete")} key={`delete-${file.id}`} arrow>
          <GridActionsCellItem
            icon={<Delete sx={{ fontSize: 25 }} />}
            label={t("files.delete")}
            color="error"
            onClick={() => onDelete(file)}
          />
        </Tooltip>
      );

      return actions;
    },
    [t, onDownload, onView, onDelete, canViewFile]
  );

  /**
   * Column definitions
   */
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: t("general.id"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fileName",
        headerName: t("files.fileName"),
        flex: 2,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fileExtension",
        headerName: t("files.extension"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "contentType",
        headerName: t("files.contentType"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdOn",
        headerName: t("general.createdOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDate,
      },
      {
        field: "updatedOn",
        headerName: t("general.updatedOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDate,
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("actions.buttons"),
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
      sortModel={[{ field: "createdOn", sort: "desc" }]}
      addNewRow={onAdd}
      pagination
      pageSizeOptions={[5, 10, 25, 50]}
      fileName="files"
      reportPdfHeader="Files Report"
    />
  );
};

export default FilesDataGrid;
