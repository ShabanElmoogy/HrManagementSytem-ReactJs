import { MyDeleteConfirmation } from "@/shared/components";

const UserDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedUser,
  t,
}) => {
  // Create the display name for the user being deleted
  const deletedField = selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`
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

export default UserDeleteDialog;