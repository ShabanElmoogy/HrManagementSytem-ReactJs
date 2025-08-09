// hooks/useCountryGridLogic.js
import { useNotifications } from "@/shared/hooks";
import useApiHandler from "@/shared/hooks/useApiHandler";
import { useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useCountryStore from "../store/useCountryStore";

const useCountryGridLogic = () => {
  // Hooks
  const { t } = useTranslation();
  const { showError, showSuccess, SnackbarComponent } = useNotifications();
  const { loading, handleApiCall } = useApiHandler({
    showSuccess,
    showError
  });

  // State management
  const [dialogType, setDialogType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  // Navigation state variables (like company code)
  const [newRowAdded, setNewRowAdded] = useState(false);
  const [lastAddedRowId, setLastAddedRowId] = useState(null);

  const [rowEdited, setRowEdited] = useState(false);
  const [lastEditedRowId, setLastEditedRowId] = useState(null);

  const [rowDeleted, setRowDeleted] = useState(false);
  const [lastDeletedRowIndex, setLastDeletedRowIndex] = useState(null);

  // Store access
  const {
    fetchCountries,
    countries,
    addCountry,
    updateCountry,
    deleteCountry,
  } = useCountryStore();

  const apiRef = useGridApiRef();

  // Memoized countries
  const stableCountries = useMemo(() => countries, [countries]);

  // Fetch countries
  const getAllCountries = useCallback(async () => {
    if (loading || fetchTriggered) return;
    setFetchTriggered(true);
    await handleApiCall(async () => {
      const response = await fetchCountries();
      const filterData = response.filter((c) => !c.isDeleted);
      useCountryStore.setState({ countries: filterData });
      return filterData;
    }, t("countries.fetched"));
  }, [fetchCountries, handleApiCall, loading, fetchTriggered, t]);

  // Dialog management
  const openDialog = useCallback((type, country = null) => {
    setDialogType(type);
    setSelectedCountry(country);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedCountry(null);
  }, []);

  // Scroll to the last added row (like company code)
  useEffect(() => {
    if (newRowAdded && countries.length > 0 && apiRef.current) {
      const lastRowIndex = countries.length - 1;
      const pageSize = apiRef.current.state.pagination.paginationModel.pageSize;
      const newPage = Math.floor(lastRowIndex / pageSize);

      apiRef.current.setPage(newPage);
      apiRef.current.setRowSelectionModel([lastAddedRowId]);

      setTimeout(() => {
        apiRef.current.scrollToIndexes({
          rowIndex: lastRowIndex,
          columnIndex: 0,
          behavior: "smooth",
        });
      }, 300);

      setNewRowAdded(false);
    }
  }, [newRowAdded, countries, apiRef, lastAddedRowId]);

  // Scroll to the last edited row (like company code)
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
  }, [rowEdited, countries, apiRef, lastEditedRowId]);

  // Scroll to the previous row after deletion (like company code)
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
  }, [rowDeleted, countries, apiRef, lastDeletedRowIndex]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (formdata) => {
      try {
        if (dialogType === "edit" && selectedCountry?.id) {
          const result = await handleApiCall(
            () => updateCountry({ ...formdata, id: selectedCountry.id }),
            t("countries.updated")
          );
          setRowEdited(true);
          setLastEditedRowId(result.id);
        } else if (dialogType === "add") {
          const response = await handleApiCall(
            () => addCountry(formdata),
            t("countries.created")
          );
          setNewRowAdded(true);
          setLastAddedRowId(response.id);
        }
        closeDialog();
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [
      dialogType,
      selectedCountry,
      updateCountry,
      addCountry,
      handleApiCall,
      t,
      closeDialog,
    ]
  );

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (!selectedCountry?.id) return;

    try {
      const deletedId = selectedCountry.id;
      const currentIndex = countries.findIndex((country) => country.id === deletedId);

      await handleApiCall(
        () => deleteCountry(deletedId),
        t("countries.deleted")
      );

      let newSelectedCountry = null;
      if (countries.length > 0) {
        newSelectedCountry =
          currentIndex > 0
            ? countries[Math.min(currentIndex - 1, countries.length - 1)]
            : countries[0];
      }

      setSelectedCountry(newSelectedCountry);
      setLastDeletedRowIndex(currentIndex);
      setRowDeleted(true);

      closeDialog();
    } catch (error) {
      console.error("Delete error:", error);
    }
  }, [
    selectedCountry,
    countries,
    deleteCountry,
    handleApiCall,
    t,
    closeDialog,
  ]);

  // Initial fetch
  useEffect(() => {
    getAllCountries();
  }, [getAllCountries]);

  // Action handlers
  const handleEdit = useCallback((country) => {
    openDialog("edit", country);
  }, [openDialog]);

  const handleView = useCallback((country) => {
    openDialog("view", country);
  }, [openDialog]);

  const handleDeleteDialog = useCallback((country) => {
    openDialog("delete", country);
  }, [openDialog]);

  const handleAdd = useCallback(() => {
    openDialog("add");
  }, [openDialog]);

  return {
    // State
    dialogType,
    selectedCountry,
    loading,
    countries: stableCountries,
    apiRef,

    // Dialog methods
    openDialog,
    closeDialog,

    // Form and action handlers
    handleFormSubmit,
    handleDelete,

    // Action methods
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDeleteDialog,
    onAdd: handleAdd,

    // Components
    SnackbarComponent,
  };
};

export default useCountryGridLogic;