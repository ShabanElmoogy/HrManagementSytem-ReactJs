// hooks/useCountryGridLogic.js - TanStack Query Implementation
import { showToast } from "@/shared/components";
import { extractErrorMessage } from "@/shared/utils";
import { useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Country, CreateCountryRequest } from "../types/Country";
import {
  useCountries,
  useCreateCountry,
  useDeleteCountry,
  useUpdateCountry,
} from "./useCountryQueries";

const useCountryGridLogic = () => {
  // Hooks
  const { t } = useTranslation();

  // TanStack Query hooks - FIXED: Removed empty filters parameter
  const {
    data: countries = [],
    isLoading: loading,
    error,
    refetch,
    isFetching,
  } = useCountries({
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        errorMessage || t("countries.fetchError") || "Failed to fetch countries"
      );
    },
  });

  const createCountryMutation = useCreateCountry({
    onSuccess: (newCountry: Country) => {
      showToast.success(
        t("countries.created", { name: newCountry.nameEn }) ||
          `Country "${newCountry.nameEn}" created successfully!`
      );

      const newCountryId = newCountry.id;
      console.log("🟢 Country created with ID:", newCountryId);
      setLastAddedRowId(newCountryId);
      setNewRowAdded(true);
      setDialogType(null);
      setSelectedCountry(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastAddedRowId");
        setLastAddedRowId(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t(errorMessage || "countries.createError") || "Failed to create country"
      );
    },
  });

  const updateCountryMutation = useUpdateCountry({
    onSuccess: (updatedCountry: Country) => {
      showToast.success(
        t("countries.updated", { name: updatedCountry.nameEn }) ||
          `Country "${updatedCountry.nameEn}" updated successfully!`
      );

      console.log("🟡 Country updated with ID:", updatedCountry.id);
      setRowEdited(true);
      setLastEditedRowId(updatedCountry.id);
      setDialogType(null);
      setSelectedCountry(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastEditedRowId");
        setLastEditedRowId(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t("countries.updateError") || errorMessage || "Failed to update country"
      );
    },
  });

  const deleteCountryMutation = useDeleteCountry({
    onSuccess: () => {
      showToast.success(
        t("countries.deleted") || "Country deleted successfully!"
      );

      console.log("🔴 Country deleted, lastDeletedRowIndex:", lastDeletedRowIndex);
      setRowDeleted(true);
      setDialogType(null);
      setSelectedCountry(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastDeletedRowIndex");
        setLastDeletedRowIndex(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t(errorMessage || "countries.deleteError") || "Failed to delete country"
      );
    },
  });

  // State management
  const [dialogType, setDialogType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Navigation state variables
  const [newRowAdded, setNewRowAdded] = useState(false);
  const [lastAddedRowId, setLastAddedRowId] = useState(null);

  const [rowEdited, setRowEdited] = useState(false);
  const [lastEditedRowId, setLastEditedRowId] = useState(null);

  const [rowDeleted, setRowDeleted] = useState(false);
  const [lastDeletedRowIndex, setLastDeletedRowIndex] = useState(null);

  const apiRef = useGridApiRef();

  // Memoized countries
  const stableCountries = useMemo(() => countries, [countries]);

  // Check for any loading state from mutations
  const isAnyLoading =
    loading ||
    createCountryMutation.isPending ||
    updateCountryMutation.isPending ||
    deleteCountryMutation.isPending;

  // Dialog management
  const openDialog = useCallback((type: any, country: any = null) => {
    setDialogType(type);
    setSelectedCountry(country);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedCountry(null);
  }, []);

  // Scroll to the last added row
  useEffect(() => {
    if (
      newRowAdded &&
      countries.length > 0 &&
      apiRef.current &&
      lastAddedRowId
    ) {
      // Find the actual index of the newly added row
      const newRowIndex = countries.findIndex(
        (country) => country.id === lastAddedRowId
      );

      if (newRowIndex >= 0) {
        console.log("Found new row at index:", newRowIndex);

        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;
        const newPage = Math.floor(newRowIndex / pageSize);

        // Set the page first
        apiRef.current.setPage(newPage);

        // Select the row
        apiRef.current.setRowSelectionModel([lastAddedRowId]);

        // Scroll to the row with a delay to ensure the page change has completed
        setTimeout(() => {
          apiRef.current.scrollToIndexes({
            rowIndex: newRowIndex,
            colIndex: 0,
          });
        }, 500); // Increased delay to ensure data is loaded

        console.log(
          "Row selection and scroll initiated for ID:",
          lastAddedRowId
        );
      } else {
        console.log("New row not found in countries list yet, will retry...");
        // If the row is not found yet, it might be because the data is still loading
        // The effect will run again when countries data updates
        return;
      }

      setNewRowAdded(false);
    }
  }, [newRowAdded, countries, lastAddedRowId]);

  // Scroll to the last edited row
  useEffect(() => {
    if (rowEdited && countries.length > 0 && apiRef.current) {
      const editedIndex = countries.findIndex(
        (row) => row.id === lastEditedRowId
      );

      if (editedIndex >= 0 && editedIndex < countries.length) {
        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;

        const newPage = Math.floor(editedIndex / pageSize);

        apiRef.current.setPage(newPage);
        apiRef.current.scrollToIndexes({ rowIndex: editedIndex, colIndex: 0 });
        apiRef.current.setRowSelectionModel([lastEditedRowId]);
      }
      setRowEdited(false);
    }
  }, [rowEdited, countries.length, lastEditedRowId]);

  // Scroll to the previous row after deletion
  useEffect(() => {
    if (rowDeleted && countries.length > 0 && apiRef.current) {
      let prevRowIndex = lastDeletedRowIndex - 1;
      if (prevRowIndex < 0) {
        prevRowIndex = 0;
      }

      if (prevRowIndex >= 0 && prevRowIndex < countries.length) {
        const prevRowId = countries[prevRowIndex].id;
        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;
        const newPage = Math.floor(prevRowIndex / pageSize);

        apiRef.current.setPage(newPage);
        apiRef.current.scrollToIndexes({ rowIndex: prevRowIndex, colIndex: 0 });
        apiRef.current.setRowSelectionModel([prevRowId]);
      }
      setRowDeleted(false);
    }
  }, [rowDeleted, countries.length, lastDeletedRowIndex]);

  // Additional effect to handle row selection when data is refetch
  useEffect(() => {
    if (
      !isFetching &&
      !loading &&
      lastAddedRowId &&
      newRowAdded &&
      countries.length > 0 &&
      apiRef.current
    ) {
      // Find the newly added row
      const newRowIndex = countries.findIndex(
        (country) => country.id === lastAddedRowId
      );

      if (newRowIndex >= 0) {
        console.log(
          "Found new row at index:",
          newRowIndex,
          "for ID:",
          lastAddedRowId
        );

        // Use a timeout to ensure the grid has rendered the new data
        setTimeout(() => {
          if (apiRef.current) {
            const pageSize =
              apiRef.current.state.pagination.paginationModel.pageSize;
            const newPage = Math.floor(newRowIndex / pageSize);

            // Set the page and select the row
            apiRef.current.setPage(newPage);
            apiRef.current.setRowSelectionModel([lastAddedRowId]);

            // Scroll to the row
            setTimeout(() => {
              if (apiRef.current) {
                apiRef.current.scrollToIndexes({
                  rowIndex: newRowIndex,
                  colIndex: 0,
                });
              }
            }, 200);

            console.log(
              "Successfully selected and scrolled to new row:",
              lastAddedRowId
            );
          }
        }, 300);

        // Reset the flags
        setNewRowAdded(false);
        setLastAddedRowId(null);
      }
    }
  }, [isFetching, loading, lastAddedRowId, newRowAdded, countries]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (formdata: CreateCountryRequest) => {
      try {
        if (dialogType === "edit" && selectedCountry?.id) {
          await updateCountryMutation.mutateAsync({
            ...formdata,
            id: selectedCountry.id,
          });
        } else if (dialogType === "add") {
          await createCountryMutation.mutateAsync(formdata);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        // Error handling is done in the mutation's onError callback
      }
    },
    [dialogType, selectedCountry, updateCountryMutation, createCountryMutation]
  );

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (!selectedCountry?.id) return;

    try {
      const deletedId = selectedCountry.id;
      const currentIndex = countries.findIndex(
        (country) => country.id === deletedId
      );

      await deleteCountryMutation.mutateAsync(deletedId);

      // Update selected country for navigation
      let newSelectedCountry = null;
      if (countries.length > 1) {
        // Will be length - 1 after deletion
        newSelectedCountry =
          currentIndex > 0
            ? countries[Math.min(currentIndex - 1, countries.length - 2)]
            : countries[1]; // Take the second item since first will be deleted
      }

      setSelectedCountry(newSelectedCountry);
      setLastDeletedRowIndex(currentIndex);
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in the mutation's onError callback
    }
  }, [selectedCountry, countries, deleteCountryMutation]);

  // Action handlers
  const handleEdit = useCallback(
    (country: Country) => {
      openDialog("edit", country);
    },
    [openDialog]
  );

  const handleView = useCallback(
    (country: Country) => {
      openDialog("view", country);
    },
    [openDialog]
  );

  const handleDeleteDialog = useCallback(
    (country: Country) => {
      openDialog("delete", country);
    },
    [openDialog]
  );

  const handleAdd = useCallback(() => {
    openDialog("add");
  }, [openDialog]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // State
    dialogType,
    selectedCountry,
    loading: isAnyLoading,
    countries: stableCountries,
    apiRef,
    error,
    isFetching,

    // Dialog methods
    openDialog,
    closeDialog,

    // Form and action handlers
    handleFormSubmit,
    handleDelete,
    handleRefresh,

    // Action methods
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDeleteDialog,
    onAdd: handleAdd,

    // Mutation states for advanced UI feedback
    isCreating: createCountryMutation.isPending,
    isUpdating: updateCountryMutation.isPending,
    isDeleting: deleteCountryMutation.isPending,

    // Highlighting/Navigation state for card view
    lastAddedId: lastAddedRowId,
    lastEditedId: lastEditedRowId,
    lastDeletedIndex: lastDeletedRowIndex,
  };
};

export default useCountryGridLogic;
