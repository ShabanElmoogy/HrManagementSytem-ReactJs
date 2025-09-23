import { MyDeleteConfirmation } from "@/shared/components";

const CountryDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedCountry,
  loading = false,
  t,
}) => {
  // Create the display name for the country being deleted
  const deletedField = selectedCountry
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
