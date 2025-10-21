// services/fileService.js
import axios from "axios";

class FileService {
  constructor() {
    // Create a separate axios instance without auth interceptors
    this.client = axios.create({
      baseURL: this.getBaseURL(), // Or get from config
    });
  }

  processError(error) {
    if (!error.response) {
      return {
        status: 0,
        title: "Network Error",
        message: "Failed to connect to the server",
        errors: null,
      };
    }

    const { status, data } = error.response;
    return {
      status,
      title: data?.title || "Error",
      errors: data?.errors ? Object.values(data.errors).flat() : null,
      message: data?.title || `Request failed with status ${status}`,
    };
  }

  getBaseURL() {
    const envUrl =
      import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim();
    const lsUrl = localStorage.getItem("baseApiUrl");
    if (lsUrl) {
      return lsUrl;
    } else if (envUrl) {
      return envUrl;
    } else {
      // Fallback for production deployment
      console.warn("No API URL configured. Please set VITE_API_URL environment variable.");
      return window.location.origin;
    }
  }

  // async uploadFile(formData, uploadUrl, onProgress) {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: onProgress,
  //     };

  //     const response = await this.client.post(uploadUrl, formData, config);

  //     return {
  //       success: true,
  //       data: response.data,
  //     };
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     const processedError = this.processError(error);
  //     return {
  //       success: false,
  //       errorResponse: {
  //         errors: processedError.errors || {
  //           general: [processedError.message],
  //         },
  //       },
  //     };
  //   }
  // }

  async downloadFile(downloadUrl, storedFileName, fileName) {
    try {
      const response = await this.client.get(
        `${downloadUrl}/${storedFileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

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
      const processedError = this.processError(error);
      return {
        success: false,
        errorResponse: {
          errors: processedError.errors || {
            general: [processedError.message],
          },
        },
      };
    }
  }

  async downloadStream(downloadUrl, id) {
    try {
      const response = await this.client.get(`${downloadUrl}/${id}`, {
        responseType: "blob",
      });

      const objectUrl = window.URL.createObjectURL(new Blob([response.data]));

      return {
        success: true,
        data: {
          url: objectUrl,
          blob: response.data,
          cleanup: () => window.URL.revokeObjectURL(objectUrl),
        },
      };
    } catch (error) {
      console.error("Stream download error:", error);
      const processedError = this.processError(error);
      return {
        success: false,
        errorResponse: {
          errors: processedError.errors || {
            general: [processedError.message],
          },
        },
      };
    }
  }
}

export const fileService = new FileService();
