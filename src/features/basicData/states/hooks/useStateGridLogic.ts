// hooks/useStateGridLogic.ts - TanStack Query Implementation
import { showToast } from "@/shared/components";
import { extractErrorMessage } from "@/shared/utils";
import { useGridApiRef, GridApiCommon } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { State, CreateStateRequest } from "../types/State";
import {
  useStates,
  useCreateState,
  useDeleteState,
  useUpdateState,
} from "./useStateQueries";

type DialogType = "add" | "edit" | "view" | "delete" | null;

interface UseStateGridLogicReturn {
  // State
  dialogType: DialogType;
  selectedState: State | null;
  loading: boolean;
  states: State[];
  apiRef: React.MutableRefObject<GridApiCommon>;
  error: any;
  isFetching: boolean;

  // Dialog methods
  openDialog: (type: DialogType, state?: State | null) => void;
  closeDialog: () => void;

  // Form and action handlers
  handleFormSubmit: (formdata: CreateStateRequest) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleRefresh: () => void;

  // Action methods
  onEdit: (state: State) => void;
  onView: (state: State) => void;
  onDelete: (state: State) => void;
  onAdd: () => void;

  // Mutation states for advanced UI feedback
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Highlighting/Navigation state for card view
  lastAddedId: number | null;
  lastEditedId: number | null;
  lastDeletedIndex: number | null;
}

const useStateGridLogic = (): UseStateGridLogicReturn => {
  // Hooks
  const { t } = useTranslation();

  // TanStack Query hooks
  const {
    data: states = [],
    isLoading: loading,
    error,
    refetch,
    isFetching,
  } = useStates();

  // Handle query error separately using useEffect
  useEffect(() => {
    if (error) {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        errorMessage || t("states.fetchError") || "Failed to fetch states"
      );
    }
  }, [error, t]);

  const createStateMutation = useCreateState({
    onSuccess: (newState: State) => {
      showToast.success(
        t("states.created", { name: newState.nameEn }) ||
          `State "${newState.nameEn}" created successfully!`
      );

      const newStateId: number = typeof newState.id === 'string' ? parseInt(newState.id, 10) : newState.id;
      console.log("🟢 State created with ID:", newStateId);
      setLastAddedRowId(newStateId);
      setNewRowAdded(true);
      setDialogType(null);
      setSelectedState(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastAddedRowId");
        setLastAddedRowId(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t(errorMessage || "states.createError") || "Failed to create state"
      );
    },
  });

  const updateStateMutation = useUpdateState({
    onSuccess: (updatedState: State) => {
      showToast.success(
        t("states.updated", { name: updatedState.nameEn }) ||
          `State "${updatedState.nameEn}" updated successfully!`
      );

      const updatedStateId: number = typeof updatedState.id === 'string' ? parseInt(updatedState.id, 10) : updatedState.id;
      console.log("🟡 State updated with ID:", updatedStateId);
      setRowEdited(true);
      setLastEditedRowId(updatedStateId);
      setDialogType(null);
      setSelectedState(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastEditedRowId");
        setLastEditedRowId(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t("states.updateError") || errorMessage || "Failed to update state"
      );
    },
  });

  const deleteStateMutation = useDeleteState({
    onSuccess: () => {
      showToast.success(
        t("states.deleted") || "State deleted successfully!"
      );

      console.log("🔴 State deleted, lastDeletedRowIndex:", lastDeletedRowIndex);
      setRowDeleted(true);
      setDialogType(null);
      setSelectedState(null);
      
      // Clear the highlight after 4 seconds
      setTimeout(() => {
        console.log("🔄 Clearing lastDeletedRowIndex");
        setLastDeletedRowIndex(null);
      }, 4000);
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);
      showToast.error(
        t(errorMessage || "states.deleteError") || "Failed to delete state"
      );
    },
  });

  // State management
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  // Navigation state variables
  const [newRowAdded, setNewRowAdded] = useState<boolean>(false);
  const [lastAddedRowId, setLastAddedRowId] = useState<number | null>(null);

  const [rowEdited, setRowEdited] = useState<boolean>(false);
  const [lastEditedRowId, setLastEditedRowId] = useState<number | null>(null);

  const [rowDeleted, setRowDeleted] = useState<boolean>(false);
  const [lastDeletedRowIndex, setLastDeletedRowIndex] = useState<number | null>(null);

  const apiRef = useGridApiRef<GridApiCommon>();

  // Memoized states
  const stableStates = useMemo((): State[] => states, [states]);

  // Check for any loading state from mutations
  const isAnyLoading: boolean =
    loading ||
    createStateMutation.isPending ||
    updateStateMutation.isPending ||
    deleteStateMutation.isPending;

  // Dialog management
  const openDialog = useCallback((type: DialogType, state: State | null = null) => {
    setDialogType(type);
    setSelectedState(state);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedState(null);
  }, []);

  // Scroll to the last added row
  useEffect(() => {
    if (
      newRowAdded &&
      states.length > 0 &&
      apiRef.current &&
      lastAddedRowId
    ) {
      // Find the actual index of the newly added row
      const newRowIndex = states.findIndex(
        (state) => state.id === lastAddedRowId
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
        console.log("New row not found in states list yet, will retry...");
        // If the row is not found yet, it might be because the data is still loading
        // The effect will run again when states data updates
        return;
      }

      setNewRowAdded(false);
    }
  }, [newRowAdded, states, lastAddedRowId]);

  // Scroll to the last edited row
  useEffect(() => {
    if (rowEdited && states.length > 0 && apiRef.current) {
      const editedIndex = states.findIndex(
        (row) => row.id === lastEditedRowId
      );

      if (editedIndex >= 0 && editedIndex < states.length) {
        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;

        const newPage = Math.floor(editedIndex / pageSize);

        apiRef.current.setPage(newPage);
        apiRef.current.scrollToIndexes({ rowIndex: editedIndex, colIndex: 0 });
        apiRef.current.setRowSelectionModel([lastEditedRowId]);
      }
      setRowEdited(false);
    }
  }, [rowEdited, states.length, lastEditedRowId]);

  // Scroll to the previous row after deletion
  useEffect(() => {
    if (rowDeleted && states.length > 0 && apiRef.current) {
      let prevRowIndex = lastDeletedRowIndex - 1;
      if (prevRowIndex < 0) {
        prevRowIndex = 0;
      }

      if (prevRowIndex >= 0 && prevRowIndex < states.length) {
        const prevRowId = states[prevRowIndex].id;
        const pageSize =
          apiRef.current.state.pagination.paginationModel.pageSize;
        const newPage = Math.floor(prevRowIndex / pageSize);

        apiRef.current.setPage(newPage);
        apiRef.current.scrollToIndexes({ rowIndex: prevRowIndex, colIndex: 0 });
        apiRef.current.setRowSelectionModel([prevRowId]);
      }
      setRowDeleted(false);
    }
  }, [rowDeleted, states.length, lastDeletedRowIndex]);

  // Additional effect to handle row selection when data is refetch
  useEffect(() => {
    if (
      !isFetching &&
      !loading &&
      lastAddedRowId &&
      newRowAdded &&
      states.length > 0 &&
      apiRef.current
    ) {
      // Find the newly added row
      const newRowIndex = states.findIndex(
        (state) => state.id === lastAddedRowId
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
  }, [isFetching, loading, lastAddedRowId, newRowAdded, states]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (formdata: CreateStateRequest) => {
      try {
        if (dialogType === "edit" && selectedState?.id) {
          await updateStateMutation.mutateAsync({
            ...formdata,
            id: selectedState.id,
          });
        } else if (dialogType === "add") {
          await createStateMutation.mutateAsync(formdata);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        // Error handling is done in the mutation's onError callback
      }
    },
    [dialogType, selectedState, updateStateMutation, createStateMutation]
  );

  // Delete handler
  const handleDelete = useCallback(async (): Promise<void> => {
    if (!selectedState?.id) return;

    try {
      const deletedId: number = typeof selectedState.id === 'string' ? parseInt(selectedState.id, 10) : selectedState.id;
      const currentIndex: number = states.findIndex(
        (state) => state.id === deletedId
      );

      await deleteStateMutation.mutateAsync(deletedId);

      // Update selected state for navigation
      let newSelectedState: State | null = null;
      if (states.length > 1) {
        // Will be length - 1 after deletion
        newSelectedState =
          currentIndex > 0
            ? states[Math.min(currentIndex - 1, states.length - 2)]
            : states[1]; // Take the second item since first will be deleted
      }

      setSelectedState(newSelectedState);
      setLastDeletedRowIndex(currentIndex);
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in the mutation's onError callback
    }
  }, [selectedState, states, deleteStateMutation]);

  // Action handlers
  const handleEdit = useCallback(
    (state: State) => {
      openDialog("edit", state);
    },
    [openDialog]
  );

  const handleView = useCallback(
    (state: State) => {
      openDialog("view", state);
    },
    [openDialog]
  );

  const handleDeleteDialog = useCallback(
    (state: State) => {
      openDialog("delete", state);
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
    selectedState,
    loading: isAnyLoading,
    states: stableStates,
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
    isCreating: createStateMutation.isPending,
    isUpdating: updateStateMutation.isPending,
    isDeleting: deleteStateMutation.isPending,

    // Highlighting/Navigation state for card view
    lastAddedId: lastAddedRowId,
    lastEditedId: lastEditedRowId,
    lastDeletedIndex: lastDeletedRowIndex,
  };
};

export default useStateGridLogic;