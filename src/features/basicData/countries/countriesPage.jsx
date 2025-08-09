// CountriesPage.js
import { MyContentsWrapper } from "@/layouts/components";
import { MyHeader } from "@/shared/components";
import { useTranslation } from "react-i18next";
import CountriesDashboardHeader from "./components/countriesDashboardHeader";
import CountriesMultiView from "./components/countriesMultiView";
import CountryDeleteDialog from "./components/countryDeleteDialog";
import CountryForm from "./components/countryForm";
import useCountryGridLogic from "./hooks/useCountryGridLogic";

const CountriesPage = () => {
  const { t } = useTranslation();

  // All logic is now in the hook
  const {
    dialogType,
    selectedCountry,
    loading,
    countries,
    apiRef,
    onEdit,
    onView,
    onDelete,
    onAdd,
    closeDialog,
    handleFormSubmit,
    handleDelete,
    SnackbarComponent,
  } = useCountryGridLogic(t);

  return (
    <>

        {/* <MyHeader
          title={t("countries.title")}
          subTitle={t("countries.subTitle")}
        /> */}

        {/* Dashboard Header with Statistics
        <CountriesDashboardHeader
          countries={countries}
          loading={loading}
          t={t}
        /> */}

        <CountriesMultiView
          countries={countries}
          loading={loading}
          apiRef={apiRef}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          onAdd={onAdd}
          t={t}
        />
  

      <CountryForm
        open={["edit", "add", "view"].includes(dialogType)}
        dialogType={dialogType}
        selectedCountry={selectedCountry}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        loading={loading}
        t={t}
      />

      <CountryDeleteDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        onConfirm={handleDelete}
        selectedCountry={selectedCountry}
        t={t}
      />
      {SnackbarComponent}
    </>
  );
};

export default CountriesPage;
