// FileUpload.tsx - TypeScript implementation with validation
import { useState } from "react";
import { CardContent } from "@mui/material";
import { apiService } from "@/shared/services";
import { StyledCard } from "@/shared/components/fileUpload/styledComponents";
import FileUploadHeader from "@/shared/components/fileUpload/fileUploadHeader";
import DropZone from "@/shared/components/fileUpload/dropZone";
import FileList from "@/shared/components/fileUpload/fileList";
import FileUploadActions from "@/shared/components/fileUpload/fileUploadActions";
import { useSnackbar } from "@/shared/hooks";
import HandleApiError from "@/shared/services/apiError";

/**
 * File upload configuration
 */
const FILE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // Audio
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    // Archives
    "application/zip",
    "application/x-rar-compressed",
    // Text
    "text/plain",
    "text/csv",
  ],
} as const;

interface FileUploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface FileUploadProps {
  onSuccess?: (fileName: string) => void;
  onClose?: () => void;
  multiple?: boolean;
}

/**
 * FileUpload Component
 * 
 * Handles file upload with drag-and-drop support, validation, and progress tracking
 */
const FileUpload = ({ onSuccess, onClose, multiple = true }: FileUploadProps) => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  /**
   * Validate file size
   */
  const validateFileSize = (file: File): boolean => {
    if (file.size > FILE_CONFIG.MAX_FILE_SIZE) {
      const sizeMB = (FILE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      showSnackbar(
        "error",
        [`File "${file.name}" exceeds maximum size of ${sizeMB}MB`],
        "Validation Error"
      );
      return false;
    }
    return true;
  };

  /**
   * Validate file type
   */
  const validateFileType = (file: File): boolean => {
    if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
      showSnackbar(
        "error",
        [`File type "${file.type}" is not allowed for "${file.name}"`],
        "Validation Error"
      );
      return false;
    }
    return true;
  };

  /**
   * Validate all files
   */
  const validateFiles = (fileList: File[]): File[] => {
    return fileList.filter((file) => {
      return validateFileSize(file) && validateFileType(file);
    });
  };

  /**
   * Handle drag events
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  /**
   * Process and validate files
   */
  const handleFiles = (fileList: FileList) => {
    const fileArray = Array.from(fileList);
    
    // Validate files
    const validFiles = validateFiles(fileArray);
    
    if (validFiles.length === 0) {
      return;
    }

    const newFiles: FileUploadItem[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }));

    if (!multiple && newFiles.length > 1) {
      setGlobalError("Only one file allowed");
      showSnackbar("error", ["Only one file can be uploaded at a time"], "Error");
      return;
    }

    setFiles((prevFiles) =>
      multiple ? [...prevFiles, ...newFiles] : newFiles
    );
    setGlobalError(null);
  };

  /**
   * Handle file input change
   */
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  /**
   * Remove file from list
   */
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /**
   * Upload files to server
   */
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setGlobalError(null);

    const uploadUrl = `api/v1/Files/UploadMany`;

    // Update all files to uploading status
    setFiles((prevFiles) =>
      prevFiles.map((f) => ({ ...f, status: "uploading", progress: 0 }))
    );

    try {
      const formData = new FormData();

      // Append all files to FormData
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
        "Success"
      );

      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error: any) {
      // Update all files to error status
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({ ...f, status: "error", error: errorMessage }))
      );

      HandleApiError(error, (updatedState: any) => {
        showSnackbar("error", updatedState.messages, error?.title || "Error");
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
          accept={FILE_CONFIG.ALLOWED_TYPES.join(",")}
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
