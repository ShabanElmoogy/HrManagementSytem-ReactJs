// States Page - Main component
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import StateForm from "./components/stateForm";
import StateDeleteDialog from "./components/stateDeleteDialog";
import StatesDashboardHeader from "./components/statesDashboardHeader";
import useStateGridLogic from "./hooks/useStateGridLogic";

const StatesPage = () => {
  const { t } = useTranslation();
  
  const {
    // State
    dialogType,
    selectedState,
    loading,
    states,
    
    // Dialog methods
    closeDialog,
    
    // Form and action handlers
    handleFormSubmit,
    handleDelete,
    handleRefresh,
    
    // Action methods
    onEdit,
    onView,
    onDelete,
    onAdd,
    
    // Mutation states
    isCreating,
    isUpdating,
    isDeleting,
  } = useStateGridLogic();

  return (
    <Box sx={{ p: 3 }}>
      {/* Dashboard Header with Statistics */}
      <StatesDashboardHeader
        states={states}
        loading={loading}
        t={t}
      />

      {/* TODO: Add DataGrid component here */}
      <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <p>States DataGrid will be implemented here</p>
        <p>Total States: {states.length}</p>
        <button onClick={onAdd}>Add State</button>
        <button onClick={handleRefresh}>Refresh</button>
      </Box>

      {/* State Form Dialog */}
      <StateForm
        open={dialogType === "add" || dialogType === "edit" || dialogType === "view"}
        dialogType={dialogType as "add" | "edit" | "view"}
        selectedState={selectedState}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        loading={isCreating || isUpdating}
        t={t}
      />

      {/* Delete Confirmation Dialog */}
      <StateDeleteDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        onConfirm={handleDelete}
        selectedState={selectedState}
        loading={isDeleting}
        t={t}
      />
    </Box>
  );
};

export default StatesPage;