// hooks/useStateGridLogic.js
import { useNotifications } from "@/shared/hooks";
import useApiHandler from "@/shared/hooks/useApiHandler"; // Import the new hook
import { useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useStateStore from "../store/useStateStore";

const useStateGridLogic = () => {
  // Hooks
  const { t } = useTranslation();
  const { showError, showSuccess, SnackbarComponent } = useNotifications();
  const { loading, handleApiCall } = useApiHandler({
    showSuccess,
    showError
  }); // Pass notification functions to the API handler

  // State management
  const [dialogType, setDialogType] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  // Store access
  const {
    fetchStates,
    states,
    addState,
    updateState,
    deleteState,
  } = useStateStore();

  // Refs for grid navigation
  const gridActionRef = useRef(null);
  const apiRef = useGridApiRef();

  // Memoized states
  const stableStates = useMemo(() => states, [states]);

  // Fetch states
  const getAllStates = useCallback(async () => {
    if (loading || fetchTriggered) return;
    setFetchTriggered(true);
    await handleApiCall(async () => {
      const response = await fetchStates();
      const filterData = response.filter((s) => !s.isDeleted);
      useStateStore.setState({ states: filterData });
      return filterData;
    }, t("states.fetched"));
  }, [fetchStates, handleApiCall, loading, fetchTriggered, t]);

  // Dialog management
  const openDialog = useCallback((type, state = null) => {
    setDialogType(type);
    setSelectedState(state);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedState(null);
  }, []);

  // Grid navigation
  const handleGridNavigation = useCallback(() => {
    const gridAction = gridActionRef.current;
    if (!gridAction || !apiRef.current || !stableStates.length) {
      gridActionRef.current = null;
      return;
    }

    const { type, id } = gridAction;
    const pageSize = apiRef.current.state.pagination.paginationModel.pageSize;
    let targetIndex;

    if (type === "add") {
      targetIndex = stableStates.length - 1;
    } else if (type === "edit") {
      targetIndex = stableStates.findIndex((row) => row.id === id);
    } else if (type === "delete") {
      const deletedIndex = stableStates.findIndex((row) => row.id === id);
      targetIndex = Math.max(0, deletedIndex - 1);
    }

    if (targetIndex >= 0 && targetIndex < stableStates.length) {
      const newPage = Math.floor(targetIndex / pageSize);
      apiRef.current.setPage(newPage);
      apiRef.current.scrollToIndexes({ rowIndex: targetIndex, colIndex: 0 });
      
      const selectId = type === "delete" ? stableStates[targetIndex]?.id : id;
      if (selectId) {
        // Clear all selections first, then select the target
        apiRef.current.setRowSelectionModel([]);
        setTimeout(() => {
          if (apiRef.current) {
            apiRef.current.setRowSelectionModel([selectId]);
          }
        }, 50);
      }
    }

    gridActionRef.current = null;
  }, [stableStates, gridActionRef, apiRef]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (formdata) => {
      let gridAction = null;
      if (dialogType === "edit" && selectedState?.id) {
        const result = await handleApiCall(
          () => updateState({ ...formdata, id: selectedState.id }),
          t("states.updated")
        );
        gridAction = { type: "edit", id: result?.id || selectedState.id };
      } else if (dialogType === "add") {
        const response = await handleApiCall(
          () => addState(formdata),
          t("states.created")
        );
        if (response?.id) {
          gridAction = { type: "add", id: response.id };
        }
      }
      closeDialog();
      if (gridAction) {
        gridActionRef.current = gridAction;
        handleGridNavigation();
      }
    },
    [
      dialogType,
      selectedState,
      updateState,
      addState,
      handleApiCall,
      t,
      closeDialog,
      gridActionRef,
      handleGridNavigation,
    ]
  );

  // Delete handler
  const handleDelete = useCallback(async () => {
    if (!selectedState?.id) return;

    const deletedId = selectedState.id;
    await handleApiCall(() => deleteState(deletedId), t("states.deleted"));
    closeDialog();

    gridActionRef.current = { type: "delete", id: deletedId };
    handleGridNavigation();
  }, [
    selectedState,
    deleteState,
    handleApiCall,
    t,
    closeDialog,
    gridActionRef,
    handleGridNavigation,
  ]);

  // Initial fetch
  useEffect(() => {
    getAllStates();
  }, [getAllStates]);

  return {
    // State
    dialogType,
    selectedState,
    loading,
    states: stableStates,
    apiRef,

    // Methods
    openDialog,
    closeDialog,
    handleFormSubmit,
    handleDelete,
    onEdit: (state) => openDialog("edit", state),
    onView: (state) => openDialog("view", state),
    onDelete: (state) => openDialog("delete", state),
    onAdd: () => openDialog("add"),

    // Components
    SnackbarComponent,
  };
};

export default useStateGridLogic;