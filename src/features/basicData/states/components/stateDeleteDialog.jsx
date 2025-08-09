import { MyDeleteConfirmation } from "@/shared/components";

const StateDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedState,
  t,
}) => {
  // Create the display name for the state being deleted
  const deletedField = selectedState
    ? `${selectedState.nameEn} (${
        selectedState.nameAr || selectedState.nameEn
      })`
    : "";

  return (
    <MyDeleteConfirmation
      open={open}
      onClose={onClose}
      deletedField={deletedField}
      handleDelete={onConfirm}
    />
  );
};

export default StateDeleteDialog;