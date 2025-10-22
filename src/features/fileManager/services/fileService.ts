import { apiService } from "@/shared/services";
import { extractValue, extractValues } from "@/shared/utils/ApiHelper";
import type { FileItem, UploadResult } from "../types/File";

const BASE = "api/v1/Files";

/**
 * File upload configuration
 */
const FILE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES_PER_UPLOAD: 10,
} as const;

/**
 * Files API Service
 *
 * Handles all file-related API operations with validation and error handling
 */
export class FileService {
  /**
    * Fetch all files
    */
  static async getAll(): Promise<FileItem[]> {
    const response = await apiService.get(`${BASE}/GetAll`);
    const files = extractValues<FileItem>(response);
    return files.filter((file) => !file.isDeleted);
  }

  /**
    * Fetch single file by ID
    */
  static async getById(id: number): Promise<FileItem> {
    // Validate ID
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error("Invalid file ID");
    }

    const response = await apiService.get(`${BASE}/GetByID/${id}`);
    return extractValue<FileItem>(response);
  }

  /**
    * Download file by stored filename
    */
  static async downloadFile( storedFileName: string, fileName: string): Promise<{ success: boolean; errorResponse?: any }> {
    try {
      const response = await fetch(`${BASE}/download/${storedFileName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error("Download error:", error);
      return {
        success: false,
        errorResponse: {
          errors: {
            general: [error instanceof Error ? error.message : "Download failed"],
          },
        },
      };
    }
  }

  /**
    * Delete file by stored filename
    */
  static async delete(storedFileName: string): Promise<string> {
    // Validate filename
    if (!storedFileName || typeof storedFileName !== "string") {
      throw new Error("Invalid stored filename");
    }

    await apiService.delete(`${BASE}/Delete/${storedFileName}`);
    return storedFileName;
  }

  /**
    * Upload multiple files with validation
    */
  static async uploadMany(files: File[]): Promise<UploadResult> {
    try {
      // Validate files array
      if (!Array.isArray(files) || files.length === 0) {
        throw new Error("No files provided");
      }

      // Check file count limit
      if (files.length > FILE_CONFIG.MAX_FILES_PER_UPLOAD) {
        throw new Error(
          `Cannot upload more than ${FILE_CONFIG.MAX_FILES_PER_UPLOAD} files at once`
        );
      }

      // Validate file sizes
      const oversizedFiles = files.filter(
        (f) => f.size > FILE_CONFIG.MAX_FILE_SIZE
      );
      
      if (oversizedFiles.length > 0) {
        const sizeMB = (FILE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        const fileNames = oversizedFiles.map((f) => f.name).join(", ");
        throw new Error(
          `Files exceed maximum size of ${sizeMB}MB: ${fileNames}`
        );
      }

      // Create form data
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      // Upload files
      await apiService.post(`${BASE}/UploadMany`, formData, {
        "Content-Type": "multipart/form-data",
      });

      return { success: true, message: "Files uploaded successfully" };
    } catch (error) {
      console.error("Failed to upload files:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }
}

export default FileService;
