import { DialogType } from "@/features/basicData/districts/hooks/useDistrictGridLogic";
import { GridApiCommon } from "@mui/x-data-grid";

export interface FileItem {
  id: number;
  fileName: string;
  storedFileName: string;
  fileExtension: string; // e.g. ".pdf"
  contentType?: string;
  isDeleted?: boolean;
  createdOn?: string; // ISO string
  updatedOn?: string; // ISO string
}

export interface UploadResult {
  success: boolean;
  message?: string;
}

export interface UseFileGridLogicReturn {
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

  // Upload success handler
  handleUploadSuccess: (fileName: string) => void;
}
