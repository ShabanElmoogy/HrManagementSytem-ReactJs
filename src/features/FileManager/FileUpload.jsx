/* eslint-disable react/prop-types */
// components/FileUpload/index.jsx
import { useState } from "react";
import { CardContent } from "@mui/material";
import apiService from "../../services/apiService";
import { StyledCard } from "../../Shared/FileUpload/StyledComponents";
import FileUploadHeader from "../../Shared/FileUpload/FileUploadHeader";
import DropZone from "../../Shared/FileUpload/DropZone";
import FileList from "../../Shared/FileUpload/FileList";
import FileUploadActions from "../../Shared/FileUpload/FileUploadActions";
import useSnackbar from "../../Utilites/CustomHooks/useSnackbar";
import { HandleApiError } from "../../Services/ApiError";

const FileUpload = ({ onSuccess, onClose, multiple = true }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }));

    if (!multiple && newFiles.length > 1) {
      setGlobalError("Only one file allowed");
      return;
    }

    setFiles((prevFiles) =>
      multiple ? [...prevFiles, ...newFiles] : newFiles
    );
    setGlobalError(null);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setGlobalError(null);

    const uploadUrl = `v1/api/Files/UploadMany`;

    // Update all files to uploading status
    setFiles((prevFiles) =>
      prevFiles.map((f) => ({ ...f, status: "uploading", progress: 0 }))
    );

    try {
      const formData = new FormData();

      // Append all files to FormData with the same field name "files"
      files.forEach((fileItem) => {
        formData.append("files", fileItem.file);
      });

      await apiService.post(uploadUrl, formData, {
        "Content-Type": "multipart/form-data",
      });

      // Update all files to success status
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({ ...f, status: "success", progress: 100 }))
      );

      // Call onSuccess for each file
      files.forEach((fileItem) => {
        onSuccess?.(fileItem.file.name);
      });

      showSnackbar(
        "success",
        [`${files.length} file(s) uploaded successfully`],
        "success"
      );

      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      // Update all files to error status
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({ ...f, status: "error", error: error.message }))
      );

      HandleApiError(error, (updatedState) => {
        showSnackbar("error", updatedState.messages, error.title);
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <FileUploadHeader globalError={globalError} />

        <DropZone
          dragActive={dragActive}
          isUploading={isUploading}
          multiple={multiple}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
        />

        <FileList
          files={files}
          isUploading={isUploading}
          onRemoveFile={removeFile}
        />
      </CardContent>

      <FileUploadActions
        files={files}
        isUploading={isUploading}
        onUpload={uploadFiles}
        onClose={onClose}
      />
      {SnackbarComponent}
    </StyledCard>
  );
};

export default FileUpload;
