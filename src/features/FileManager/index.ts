/**
 * FileManager Feature - Public API
 * 
 * This module exports all public components, hooks, types, and utilities
 * for the FileManager feature.
 */

// Main Components
export { default as FilesGrid } from "./FilesGrid";
export { default as FileUpload } from "./components/FileUpload";
export { default as MediaViewer } from "./components/MediaViewer";

// Sub-components
export { default as FilesDataGrid } from "./components/FilesDataGrid";
export { default as FileDeleteDialog } from "./components/FileDeleteDialog";

// Hooks
export { default as useFileGridLogic } from "./hooks/useFileGridLogic";
export { useFiles, useFile, useUploadFiles, useDeleteFile } from "./hooks/useFileQueries";

// Services
export { FileService } from "./services/fileService";
export { default as FileServiceDefault } from "./services/fileService";

// Types
export type { FileItem, UploadResult } from "./types/File";

// Constants
export {
  FILE_UPLOAD_CONFIG,
  MEDIA_VIEWER_CONFIG,
  FILE_API_ENDPOINTS,
  FILE_ERROR_MESSAGES,
  FILE_SUCCESS_MESSAGES,
  FILE_STATUS,
  DIALOG_TYPES,
  GRID_ACTION_TYPES,
  QUERY_CONFIG,
} from "./utils/constants";
