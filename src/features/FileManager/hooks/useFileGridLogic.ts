// hooks/useFileGridLogic.ts - TanStack Query Implementation
import { showToast } from "@/shared/components";
import { extractErrorMessage } from "@/shared/utils";
import { useGridApiRef, GridApiCommon } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FileItem } from "../types/File";
import {
  useFiles,
  useDeleteFile,
  useUploadFiles,
} from "./useFileQueries";

type DialogType = "upload" | "delete" | null;

interface UseFileGridLogicReturn {
  // State
  dialogType: DialogType;
  selectedFile: FileItem | null;
  loading: boolean;
  files: FileItem[];
  apiRef: React.MutableRefObject<GridApiCommon>;
  error: any;
  isFetching: boolean;

  // Dialog methods
  openDialog: (type: DialogType, file?: FileItem | null) => void;
  closeDialog: () => void;

  // Form and action handlers
  handleDelete: () => Promise<void>;
  handleRefresh: () => void;

  // Action methods
  onDelete: (file: FileItem) => void;
  onUpload: () => void;
  handleDownload: (file: FileItem) => Promise<void>;
  handleView: (file: FileItem) => void;

  // Mutation states for advanced UI feedback
  isUploading: boolean;
  isDeleting: boolean;

  // Highlighting/Navigation state for card view
  lastDeletedIndex: number | null;
}

const useFileGridLogic = (): UseFileGridLogicReturn => {
  // Hooks
  const { t } = useTranslation();
  const navigate = useNavigate();

  // TanStack Query hooks
  const {
    data: files = [],
    isLoading: loading,
    error,
    refetch,
    isFetching,
  } = useFiles();

  // Handle query error separately using useEffect
  useEffect(() => {
    if (error) {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        errorMessage || t("files.fetchError") || "Failed to fetch files"
      );
    }
  }, [error, t]);

  const deleteFileMutation = useDeleteFile({
    onSuccess: () => {
      showToast.success(
        t("files.deleted") || "File deleted successfully!"
      );

      console.log("🔴 File deleted");
      setRowDeleted(true);
      setDialogType(null);
      setSelectedFile(null);

      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastDeletedIndex");
        setLastDeletedRowIndex(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t("files.deleteError") || errorMessage || "Failed to delete file"
      );
    },
  });

  const uploadFilesMutation = useUploadFiles({
    onSuccess: (result) => {
      if (result.success) {
        showToast.success(
          t("files.uploaded") || "Files uploaded successfully!"
        );
        setDialogType(null);
      } else {
        showToast.error(result.message || "Upload failed");
      }
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t("files.uploadError") || errorMessage || "Failed to upload files"
      );
    },
  });

  // State management
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Navigation state variables
  const [rowDeleted, setRowDeleted] = useState<boolean>(false);
  const [lastDeletedRowIndex, setLastDeletedRowIndex] = useState<number | null>(null);

  const apiRef = useGridApiRef<GridApiCommon>();

  // Memoized files
  const stableFiles = useMemo((): FileItem[] => files, [files]);

  // Check for any loading state from mutations
  const isAnyLoading: boolean =
    loading ||
    uploadFilesMutation.isPending ||
    deleteFileMutation.isPending;

  // Dialog management
  const openDialog = useCallback((type: DialogType, file: FileItem | null = null) => {
    setDialogType(type);
    setSelectedFile(file);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedFile(null);
  }, []);

  // Scroll to the previous row after deletion
  useEffect(() => {
    if (rowDeleted && files.length > 0 && apiRef.current) {
      let prevRowIndex = lastDeletedRowIndex - 1;
      if (prevRowIndex < 0) {
        prevRowIndex = 0;
      }

      if (prevRowIndex >= 0 && prevRowIndex < files.length) {
        const prevRowId = files[prevRowIndex].id;
        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;
        const newPage = Math.floor(prevRowIndex / pageSize);

        apiRef.current.setPage(newPage);
        apiRef.current.scrollToIndexes({ rowIndex: prevRowIndex, colIndex: 0 });
        apiRef.current.setRowSelectionModel([prevRowId]);
      }
      setRowDeleted(false);
    }
  }, [rowDeleted, files.length, lastDeletedRowIndex]);

  // Delete handler
  const handleDelete = useCallback(async (): Promise<void> => {
    if (!selectedFile?.storedFileName) return;

    try {
      const currentIndex: number = files.findIndex(
        (file) => file.id === selectedFile.id
      );

      await deleteFileMutation.mutateAsync(selectedFile.storedFileName);

      // Update selected file for navigation
      let newSelectedFile: FileItem | null = null;
      if (files.length > 1) {
        // Will be length - 1 after deletion
        newSelectedFile =
          currentIndex > 0
            ? files[Math.min(currentIndex - 1, files.length - 2)]
            : files[1]; // Take the second item since first will be deleted
      }

      setSelectedFile(newSelectedFile);
      setLastDeletedRowIndex(currentIndex);
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in the mutation's onError callback
    }
  }, [selectedFile, files, deleteFileMutation]);

  // Action handlers
  const handleDeleteDialog = useCallback(
    (file: FileItem) => {
      openDialog("delete", file);
    },
    [openDialog]
  );

  const handleUpload = useCallback(() => {
    openDialog("upload");
  }, [openDialog]);

  // Download file handler
  const handleDownload = useCallback(
    async (file: FileItem) => {
      // Download logic not implemented in FileService. Implement as needed.
      showToast.info(t("files.downloadNotImplemented") || "Download not implemented");
    },
    [t]
  );

  // View file handler - navigates to media viewer
  const handleView = useCallback(
    (file: FileItem) => {
      try {
        const url = `/extras-show-media/${file.id}/${file.fileExtension}/${file.storedFileName}/${file.fileName}`;
        navigate(url);
      } catch (error) {
        console.error("Failed to open viewer:", error);
        showToast.error(t("files.failedToOpenViewer") || "Failed to open viewer");
      }
    },
    [navigate, t]
  );

  // Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // State
    dialogType,
    selectedFile,
    loading: isAnyLoading,
    files: stableFiles,
    apiRef,
    error,
    isFetching,

    // Dialog methods
    openDialog,
    closeDialog,

    // Form and action handlers
    handleDelete,
    handleRefresh,

    // Action methods
    onDelete: handleDeleteDialog,
    onUpload: handleUpload,
    handleDownload,
    handleView,

    // Mutation states for advanced UI feedback
    isUploading: uploadFilesMutation.isPending,
    isDeleting: deleteFileMutation.isPending,

    // Highlighting/Navigation state for card view
    lastDeletedIndex: lastDeletedRowIndex,
  };
};

export default useFileGridLogic;
