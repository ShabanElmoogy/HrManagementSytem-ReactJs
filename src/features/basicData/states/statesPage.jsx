// StatesPage.js
import { MyContentsWrapper } from "@/layouts/components";
import { MyHeader } from "@/shared/components";
import { useTranslation } from "react-i18next";
import StatesDashboardHeader from "./components/statesDashboardHeader";
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
 
        {/* <MyHeader
          title={t("states.title")}
          subTitle={t("states.subTitle")}
        /> */}

        {/* Dashboard Header with Statistics */}
        {/* <StatesDashboardHeader
          states={states}
          loading={loading}
          t={t}
        /> */}

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