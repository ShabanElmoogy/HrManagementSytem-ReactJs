import { MyDeleteConfirmation } from "@/shared/components";

interface Country {
  id: number;
  nameEn: string;
  nameAr?: string;
}

interface CountryDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCountry: Country | null;
  loading?: boolean;
  t: (key: string) => string;
}

const CountryDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedCountry,
  loading = false,
}: CountryDeleteDialogProps) => {
  // Create the display name for the country being deleted
  const deletedField: string = selectedCountry
    ? `${selectedCountry.nameEn} (${
        selectedCountry.nameAr || selectedCountry.nameEn
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

export default CountryDeleteDialog;
