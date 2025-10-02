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
