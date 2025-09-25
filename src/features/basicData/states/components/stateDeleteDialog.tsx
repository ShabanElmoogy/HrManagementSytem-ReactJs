import { MyDeleteConfirmation } from "@/shared/components";

interface State {
  id: number;
  nameEn: string;
  nameAr?: string;
}

interface StateDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedState: State | null;
  loading?: boolean;
  t: (key: string) => string;
}

const StateDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedState,
  loading = false,
  t,
}: StateDeleteDialogProps) => {
  // Create the display name for the state being deleted
  const deletedField: string = selectedState
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
      loading={loading}
    />
  );
};

export default StateDeleteDialog;