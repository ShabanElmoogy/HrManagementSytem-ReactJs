// StatesPage.js
import { useTranslation } from "react-i18next";
import StatesMultiView from "./components/statesMultiView";
import StateDeleteDialog from "./components/stateDeleteDialog";
import StateForm from "./components/stateForm";
import useStateGridLogic from "./hooks/useStateGridLogic";

const StatesPage = () => {
  const { t } = useTranslation();

  // All logic is now in the hook
  const {
    dialogType,
    selectedState,
    loading,
    states,
    apiRef,
    onEdit,
    onView,
    onDelete,
    onAdd,
    closeDialog,
    handleFormSubmit,
    handleDelete,
    SnackbarComponent,
  } = useStateGridLogic();

  return (
    <>
      <StatesMultiView
        states={states}
        loading={loading}
        apiRef={apiRef}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        t={t}
      />

      <StateForm
        open={["edit", "add", "view"].includes(dialogType)}
        dialogType={dialogType}
        selectedState={selectedState}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        loading={loading}
        t={t}
      />

      <StateDeleteDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        onConfirm={handleDelete}
        selectedState={selectedState}
        t={t}
      />
      {SnackbarComponent}
    </>
  );
};

export default StatesPage;
