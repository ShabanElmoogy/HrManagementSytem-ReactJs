// FilesGrid.jsx - EXACT copy of applicationsGrid pattern
import { useEffect, useMemo, useCallback } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import useSnackbar from "../../Utilites/CustomHooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import ContentsWrapper from "../../Layouts/ContentsWrapper";
import Header from "../../Shared/Header";
import FilesDataGrid from "./Components/FilesDataGrid";
import FileUpload from "./FileUpload"; // YOUR original component
import FileDeleteDialog from "./Components/FileDeleteDialog";
import useFileGridLogic from "./Hooks/useFileGridLogic";

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
    uploadFile, // Like addApplication
    deleteFile,
    handleDownload,
    handleView,
  } = useFileGridLogic(t, showSnackbar);

  // Memoized values
  const stableFiles = useMemo(() => files, [files]);

  // Form submission handler - EXACT COPY of your handleFormSubmit
  const handleFormSubmit = useCallback(
    async (fileName) => {
      let gridAction = null;
      if (dialogType === "upload") {
        const response = await handleApiCall(
          () => uploadFile(),
          t("fileUploaded")
        );
        gridAction = { type: "add", id: response.id };
      }
      closeDialog();
      if (gridAction) {
        gridActionRef.current = gridAction;
        handleGridNavigation();
      }
    },
    [dialogType, uploadFile, handleApiCall, t, closeDialog, gridActionRef]
  );

  // Delete handler - EXACT copy of your delete pattern
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

  // Grid navigation - EXACT COPY of your navigation pattern
  const handleGridNavigation = useCallback(() => {
    const gridAction = gridActionRef.current;
    if (!gridAction || !apiRef.current || !stableFiles.length) {
      gridActionRef.current = null;
      return;
    }

    const { type, id } = gridAction;
    const pageSize = apiRef.current.state.pagination.paginationModel.pageSize;
    let targetIndex;

    if (type === "add") {
      targetIndex = stableFiles.length - 1;
    } else if (type === "edit") {
      targetIndex = stableFiles.findIndex((row) => row.id === id);
    } else if (type === "delete") {
      const deletedIndex = stableFiles.findIndex((row) => row.id === id);
      targetIndex = Math.max(0, deletedIndex - 1);
    }

    if (targetIndex >= 0 && targetIndex < stableFiles.length) {
      const newPage = Math.floor(targetIndex / pageSize);
      apiRef.current.setPage(newPage);
      apiRef.current.scrollToIndexes({ rowIndex: targetIndex, colIndex: 0 });
      const selectId = type === "delete" ? stableFiles[targetIndex]?.id : id;
      if (selectId) {
        // Clear existing selection first, then select the new row
        apiRef.current.setRowSelectionModel([selectId]);
      }
    }

    gridActionRef.current = null;
  }, [stableFiles, gridActionRef]);

  // Initial fetch - EXACT copy
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
          onDelete={(file) => openDialog("delete", file)}
          onAdd={() => openDialog("upload")}
          t={t}
        />

        {/* Using YOUR original FileUpload - EXACT pattern like ApplicationForm */}
        <Dialog
          open={dialogType === "upload"}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown={loading} // Prevent closing during upload
        >
          <FileUpload
            onSuccess={handleFormSubmit}
            onError={(errors) => console.error("Upload error:", errors)}
            onClose={closeDialog}
            multiple={true}
          />
        </Dialog>

        <FileDeleteDialog
          open={dialogType === "delete"}
          onClose={closeDialog}
          onConfirm={handleDelete}
          t={t}
        />
      </ContentsWrapper>
      {SnackbarComponent}
    </>
  );
};

export default FilesGrid;
