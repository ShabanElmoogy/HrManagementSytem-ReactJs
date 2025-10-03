// FilesGrid.tsx - Modern implementation with TypeScript
import { useEffect, useMemo, useCallback } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { useSnackbar } from "@/shared/hooks";
import ContentsWrapper from "@/layouts/components/myContentsWrapper";
import Header from "@/shared/components/common/header/myHeader";
import FilesDataGrid from "./components/FilesDataGrid";
import FileUpload from "./components/FileUpload";
import FileDeleteDialog from "./components/FileDeleteDialog";
import useFileGridLogic from "./hooks/useFileGridLogic";
import type { FileItem } from "./types/File";

/**
 * FilesGrid Component
 * 
 * Main component for managing files with grid display.
 * Supports upload, download, view, and delete operations.
 * 
 * @component
 * @example
 * ```tsx
 * <FilesGrid />
 * ```
 */
const FilesGrid = () => {
  // Hooks
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { t } = useTranslation();

  // Custom logic hook
  const {
    dialogType,
    selectedFile,
    loading,
    files,
    apiRef,
    openDialog,
    closeDialog,
    handleDelete,
    handleRefresh,
    onDelete,
    onUpload,
    handleDownload,
    handleView,
    handleUploadSuccess,
  } = useFileGridLogic();

  // Memoized values
  const stableFiles = useMemo(() => files, [files]);

  // Form submission handler for upload success
  const handleFormSubmit = useCallback(
    async (fileName: string) => {
      // Refetch files after upload
      await handleRefresh();
      // Trigger navigation to uploaded file
      handleUploadSuccess(fileName);
    },
    [handleRefresh, handleUploadSuccess]
  );

  return (
    <>
      <ContentsWrapper>
        <Header title={t("files")} subTitle={t("filesSubTitle")} />

        <FilesDataGrid
          files={stableFiles}
          loading={loading}
          apiRef={apiRef}
          onDownload={handleDownload}
          onView={handleView}
          onDelete={onDelete}
          onAdd={onUpload}
          t={t}
        />

        <Dialog
          open={dialogType === "upload"}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown={loading}
        >
          <FileUpload
            onSuccess={handleFormSubmit}
            onClose={closeDialog}
            multiple={true}
          />
        </Dialog>

        <FileDeleteDialog
          open={dialogType === "delete"}
          onClose={closeDialog}
          onConfirm={handleDelete}
          selectedFile={selectedFile}
          loading={loading}
          t={t}
        />
      </ContentsWrapper>
      {SnackbarComponent}
    </>
  );
};

export default FilesGrid;
