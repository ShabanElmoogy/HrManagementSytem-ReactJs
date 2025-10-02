// Hooks/useFileGridLogic.ts - TypeScript implementation with improved error handling
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HandleApiError from "@/shared/services/apiError";
import { useFiles, useDeleteFile, useInvalidateFiles } from "./useFileQueries";
import type { FileItem } from "../types/File";
import type { TFunction } from "i18next";

type DialogType = "upload" | "delete" | null;

interface GridAction {
  type: "add" | "edit" | "delete";
  id: number;
}

export interface UseFileGridLogicReturn {
  dialogType: DialogType;
  selectedFile: FileItem | null;
  loading: boolean;
  files: FileItem[];
  gridActionRef: React.MutableRefObject<GridAction | null>;
  handleApiCall: <T>(apiCall: () => Promise<T>, successMessage: string) => Promise<T | null>;
  getAllFiles: () => Promise<void>;
  openDialog: (type: DialogType, file?: FileItem | null) => void;
  closeDialog: () => void;
  refreshFiles: () => Promise<void>;
  deleteFile: (storedFileName: string) => Promise<void>;
  handleDownload: (file: FileItem) => Promise<void>;
  handleView: (file: FileItem) => void;
}

/**
 * Custom hook for file grid logic
 * Handles all file operations and state management
 */
const useFileGridLogic = (
  t: TFunction,
  showSnackbar: (type: string, messages: string[], title: string) => void
): UseFileGridLogicReturn => {
  const navigate = useNavigate();

  // State management
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  // React Query hooks (inside the hook function per Rules of Hooks)
  const { data: files = [], refetch: refetchFiles } = useFiles();
  const deleteFileMutation = useDeleteFile();
  const invalidateFiles = useInvalidateFiles();

  // Refs for grid navigation
  const gridActionRef = useRef<GridAction | null>(null);

  /**
   * Generic API call handler with error handling
   */
  const handleApiCall = useCallback(
    async <T,>(apiCall: () => Promise<T>, successMessage: string): Promise<T | null> => {
      if (loading) return null;

      setLoading(true);
      try {
        const result = await apiCall();
        showSnackbar("success", [successMessage], t("success"));
        return result;
      } catch (error: any) {
        HandleApiError(error, (updatedState: any) => {
          showSnackbar("error", updatedState.messages, error?.title || t("error"));
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loading, showSnackbar, t]
  );

  /**
   * Fetch all files and filter deleted ones
   */
  const getAllFiles = useCallback(async () => {
    if (loading || fetchTriggered) return;

    setFetchTriggered(true);
    await handleApiCall(async () => {
      await refetchFiles();
      await invalidateFiles();
      return files.filter((f: FileItem) => !f.isDeleted);
    }, t("filesFetched"));
  }, [handleApiCall, loading, fetchTriggered, t, refetchFiles, invalidateFiles, files]);

  /**
   * Open dialog with optional file selection
   */
  const openDialog = useCallback((type: DialogType, file: FileItem | null = null) => {
    setDialogType(type);
    setSelectedFile(file);
  }, []);

  /**
   * Close dialog and reset selection
   */
  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedFile(null);
  }, []);

  /**
   * Download file handler
   */
  const handleDownload = useCallback(
    async (file: FileItem) => {
      // Download logic not implemented in FileService. Implement as needed.
      showSnackbar("info", [t("downloadNotImplemented")], t("info"));
    },
    [t, showSnackbar]
  );

  /**
   * View file handler - navigates to media viewer
   */
  const handleView = useCallback(
    (file: FileItem) => {
      try {
        const url = `/extras-show-media/${file.id}/${file.fileExtension}/${file.storedFileName}/${file.fileName}`;
        navigate(url);
      } catch (error) {
        console.error("Failed to open viewer:", error);
        showSnackbar("error", [t("failedToOpenViewer")], t("error"));
      }
    },
    [navigate, showSnackbar, t]
  );

  return {
    // State
    dialogType,
    selectedFile,
    loading,
    files,
    gridActionRef,

    // Methods
    handleApiCall,
    getAllFiles,
    openDialog,
    closeDialog,
    refreshFiles: async () => {
      await refetchFiles();
      await invalidateFiles();
    },
    deleteFile: async (storedFileName: string) => {
      await deleteFileMutation.mutateAsync(storedFileName);
      await invalidateFiles();
    },
    handleDownload,
    handleView,
  };
};

export default useFileGridLogic;
