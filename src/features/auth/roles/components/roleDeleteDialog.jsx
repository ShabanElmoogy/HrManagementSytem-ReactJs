import { MyDeleteConfirmation } from "@/shared/components";

const RoleDeleteDialog = ({ t, open, onClose, onConfirm, selectedRole }) => {
  // Create the display name for the role being deleted
  const deletedField = selectedRole ? selectedRole.name : "";

  return (
    <MyDeleteConfirmation
      open={open}
      onClose={onClose}
      deletedField={deletedField}
      handleDelete={onConfirm}
    />
  );
};

export default RoleDeleteDialog;
