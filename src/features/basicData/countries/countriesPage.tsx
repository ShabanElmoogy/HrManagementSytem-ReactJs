// CountriesPage.js - TanStack Query Implementation
import { useTranslation } from "react-i18next";
import { Alert, Box, Button } from "@mui/material";
import CountriesMultiView from "./components/countriesMultiView";
import CountryDeleteDialog from "./components/countryDeleteDialog";
import CountryForm from "./components/countryForm";
import useCountryGridLogic from "./hooks/useCountryGridLogic";

const CountriesPage = () => {
  const { t } = useTranslation();

  // All logic is now in the TanStack Query hook
  const {
    dialogType,
    selectedCountry,
    loading,
    countries,
    apiRef,
    error,
    isFetching,
    onEdit,
    onView,
    onDelete,
    onAdd,
    closeDialog,
    handleFormSubmit,
    handleDelete,
    handleRefresh,
    isCreating,
    isUpdating,
    isDeleting,
    lastAddedId,
    lastEditedId,
    lastDeletedIndex,
  } = useCountryGridLogic();

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              {t("common.retry") || "Retry"}
            </Button>
          }
        >
          {error.message || t("countries.errorMessage") || "Failed to load countries"}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <CountriesMultiView
        countries={countries}
        loading={loading}
        isFetching={isFetching}
        apiRef={apiRef}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onRefresh={handleRefresh}
        t={t}
        lastAddedId={lastAddedId}
        lastEditedId={lastEditedId}
        lastDeletedIndex={lastDeletedIndex}
      />

      <CountryForm
        open={["edit", "add", "view"].includes(dialogType)}
        dialogType={dialogType as "add" | "edit" | "view"}
        selectedCountry={selectedCountry}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        loading={isCreating || isUpdating}
        t={t}
      />

      <CountryDeleteDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        onConfirm={handleDelete}
        selectedCountry={selectedCountry}
        loading={isDeleting}
        t={t}
      />
    </>
  );
};

export default CountriesPage;
