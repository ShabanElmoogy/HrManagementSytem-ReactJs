// FilesGrid.tsx - Modern implementation with TypeScript
import { useEffect, useMemo, useCallback } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { useSnackbar } from "@/shared/hooks";
import ContentsWrapper from "@/layouts/components/myContentsWrapper";
import Header from "@/shared/components/common/header/myHeader";
import FilesDataGrid from "./components/FilesDataGrid";
import FileUpload from "./FileUpload";
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
  const apiRef = useGridApiRef();

  // Custom logic hook
  const {
    dialogType,
    selectedFile,
    loading,
    files,
    gridActionRef,
    handleApiCall,
    getAllFiles,
    openDialog,
    closeDialog,
    refreshFiles,
    deleteFile,
    handleDownload,
    handleView,
  } = useFileGridLogic(t, showSnackbar);

  // Memoized values
  const stableFiles = useMemo(() => files, [files]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (fileName: string) => {
      let gridAction = null;
      if (dialogType === "upload") {
        const response = await handleApiCall(
          () => refreshFiles(),
          t("fileUploaded")
        );
        gridAction = { type: "add", id: response?.id };
      }
      closeDialog();
      if (gridAction) {
        gridActionRef.current = gridAction;
        handleGridNavigation();
      }
    },
    [dialogType, refreshFiles, handleApiCall, t, closeDialog, gridActionRef]
  );

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (!selectedFile?.storedFileName) return;

    const deletedId = selectedFile.id;
    await handleApiCall(
      () => deleteFile(selectedFile.storedFileName),
      t("fileDeleted")
    );
    closeDialog();

    gridActionRef.current = { type: "delete", id: deletedId };
    handleGridNavigation();
  }, [selectedFile, deleteFile, handleApiCall, t, closeDialog, gridActionRef]);

  // Grid navigation
  const handleGridNavigation = useCallback(() => {
    const gridAction = gridActionRef.current;
    if (!gridAction || !apiRef.current || !stableFiles.length) {
      gridActionRef.current = null;
      return;
    }

    const { type, id } = gridAction;
    const pageSize = apiRef.current.state.pagination.paginationModel.pageSize;
    let targetIndex: number = -1;

    if (type === "add") {
      targetIndex = stableFiles.length - 1;
    } else if (type === "edit") {
      targetIndex = stableFiles.findIndex((row: FileItem) => row.id === id);
    } else if (type === "delete") {
      const deletedIndex = stableFiles.findIndex((row: FileItem) => row.id === id);
      targetIndex = Math.max(0, deletedIndex - 1);
    }

    if (targetIndex >= 0 && targetIndex < stableFiles.length) {
      const newPage = Math.floor(targetIndex / pageSize);
      apiRef.current.setPage(newPage);
      apiRef.current.scrollToIndexes({ rowIndex: targetIndex, colIndex: 0 });
      const selectId = type === "delete" ? stableFiles[targetIndex]?.id : id;
      if (selectId) {
        apiRef.current.setRowSelectionModel([selectId]);
      }
    }

    gridActionRef.current = null;
  }, [stableFiles, gridActionRef, apiRef]);

  // Initial fetch
  useEffect(() => {
    getAllFiles();
  }, [getAllFiles]);

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
          onDelete={(file: FileItem) => openDialog("delete", file)}
          onAdd={() => openDialog("upload")}
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
