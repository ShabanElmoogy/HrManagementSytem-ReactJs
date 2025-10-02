// Store/useFileStore.js - EXACT copy of applicationstore pattern
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import apiService from "../../../Services/apiService";

const useFileStore = create(
  devtools(
    persist(
      (set, get) => ({
        files: [],
        error: null,

        fetchFiles: async () => {
          set({ error: null });
          const response = await apiService.get("/v1/api/Files/GetAll");
          const allFiles = response.data || response;
          set({ files: allFiles });
          return allFiles;
        },

        getFileById: async (id) => {
          set({ error: null });
          const file = get().files.find((f) => f.id === id);
          if (file) return file;

          const response = await apiService.get(`/v1/api/Files/GetByID/${id}`);
          const newFile = response.data || response;

          if (newFile && newFile.id) {
            set((state) => ({
              files: [...state.files, newFile],
            }));
          }
          return newFile;
        },

        // EXACT like addApplication - this is called AFTER upload completes
        uploadFile: async () => {
          // Get fresh data from server
          const response = await apiService.get("/v1/api/Files/GetAll");
          const allFiles = response.data || response;

          // Add the newest file to the END of the current array (like addApplication does)
          set((state) => {
            // Find the newest file (highest ID or most recent date)
            const currentIds = state.files.map((f) => f.id);
            const newFiles = allFiles.filter((f) => !currentIds.includes(f.id));
            const newestFile = newFiles[0]; // Get the first new file

            if (newestFile) {
              return {
                files: [...state.files, newestFile], // Add to end like addApplication
              };
            }
            return { files: allFiles }; // Fallback to full list
          });

          // Return the newest file
          const currentFiles = get().files;
          const newestFile = currentFiles[currentFiles.length - 1]; // Last item in array
          return newestFile;
        },

        deleteFile: async (storedFileName) => {
          set({ error: null });
          await apiService.delete(`/v1/api/Files/Delete/${storedFileName}`);

          set((state) => ({
            files: state.files.filter(
              (f) => f.storedFileName !== storedFileName
            ),
          }));
        },

        resetFileData: () =>
          set({
            files: [],
            error: null,
          }),
      }),
      {
        name: "file-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useFileStore;
