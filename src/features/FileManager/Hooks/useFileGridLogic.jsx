// Hooks/useFileGridLogic.js - EXACT copy of useApplicationGridLogic
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HandleApiError } from "../../../Services/ApiError";
import { fileService } from "../../../services/fileService";
import useFileStore from "../Store/useFileStore";

const useFileGridLogic = (t, showSnackbar) => {
  const navigate = useNavigate();

  // State management - EXACT copy
  const [dialogType, setDialogType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  // Store access - EXACT copy
  const { fetchFiles, files, uploadFile, deleteFile } = useFileStore();

  // Refs for grid navigation - EXACT copy
  const gridActionRef = useRef(null);

  // API call handler - EXACT copy
  const handleApiCall = useCallback(
    async (apiCall, successMessage) => {
      if (loading) return null;
      setLoading(true);
      try {
        const result = await apiCall();
        showSnackbar("success", [successMessage], t("success"));
        return result;
      } catch (error) {
        HandleApiError(error, (updatedState) => {
          showSnackbar("error", updatedState.messages, error.title);
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loading, showSnackbar, t]
  );

  // Fetch files - EXACT copy of getAllapplications
  const getAllFiles = useCallback(async () => {
    if (loading || fetchTriggered) return;
    setFetchTriggered(true);
    await handleApiCall(async () => {
      const response = await fetchFiles();
      const filterData = response.filter((f) => !f.isDeleted);
      useFileStore.setState({ files: filterData });
      return filterData;
    }, t("filesFetched"));
  }, [fetchFiles, handleApiCall, loading, fetchTriggered, t]);

  // Dialog management - EXACT copy
  const openDialog = useCallback((type, file = null) => {
    setDialogType(type);
    setSelectedFile(file);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedFile(null);
  }, []);

  // File operations
  const handleDownload = useCallback(
    async (file) => {
      await handleApiCall(async () => {
        const response = await fileService.downloadFile(
          `v1/api/Files/Download`,
          file.storedFileName,
          file.fileName
        );

        if (!response.success) {
          throw new Error("Download failed");
        }
        return response;
      }, t("fileDownloaded"));
    },
    [handleApiCall, t]
  );

  const handleView = useCallback(
    (file) => {
      try {
        const url = `/extras-show-media/${file.id}/${file.fileExtension}/${file.storedFileName}/${file.fileName}`;
        console.log("url", url);
        navigate(url);
      } catch {
        showSnackbar("error", [t("failedToOpenViewer")], t("error"));
      }
    },
    [navigate, showSnackbar, t]
  );

  return {
    // State - EXACT copy
    dialogType,
    selectedFile,
    loading,
    files,
    gridActionRef,

    // Methods - EXACT copy
    handleApiCall,
    getAllFiles,
    openDialog,
    closeDialog,
    uploadFile,
    deleteFile,
    handleDownload,
    handleView,
  };
};

export default useFileGridLogic;
