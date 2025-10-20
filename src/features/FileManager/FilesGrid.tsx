import ContentsWrapper from "@/layouts/components/myContentsWrapper";
import Header from "@/shared/components/common/header/myHeader";
import { useSnackbar } from "@/shared/hooks";
import { Dialog } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import FileDeleteDialog  from "./components/dialog/FileDeleteDialog";
import FilesDataGrid from "./components/FilesDataGrid";
import FileUpload from "./components/fileUpload/FileUpload";
import useFileGridLogic from "./hooks/useFileGridLogic";
const FilesGrid = () => {

  const { SnackbarComponent } = useSnackbar();
  const { t } = useTranslation();

  // Custom logic hooks
  const {
    dialogType,
    selectedFile,
    loading,
    files,
    apiRef,
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
        <Header title={t("files.title")} subTitle={t("files.subTitle")} />

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
