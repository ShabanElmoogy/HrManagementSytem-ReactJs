import { MyDeleteConfirmation } from "@/shared/components";

const CountryDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  selectedCountry,
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
    />
  );
};

export default CountryDeleteDialog;
