import { MyDeleteConfirmation } from "@/shared/components";
import type { District } from "../types/District";

interface DistrictDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDistrict: District | null;
  loading?: boolean;
  t: (key: string) => string;
}

const DistrictDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedDistrict,
  loading = false,
}: DistrictDeleteDialogProps) => {
  const deletedField: string = selectedDistrict
    ? `${selectedDistrict.nameEn} (${selectedDistrict.nameAr || selectedDistrict.nameEn})`
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

export default DistrictDeleteDialog;
