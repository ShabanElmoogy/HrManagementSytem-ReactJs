import ConfirmationDialogue from "@/Shared/ConfirmationDialogue";

const FileDeleteDialog = ({ open, onClose, onConfirm, t }) => {
  return (
    <ConfirmationDialogue
      t={t}
      title={t("deleteFiles")}
      dataName={t("files")}
      deleteDialogOpen={open}
      setDeleteDialogOpen={() => onClose()}
      handleDeleteConfirm={onConfirm}
    />
  );
};

export default FileDeleteDialog;
