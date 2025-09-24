/* eslint-disable react/prop-types */
// components/CountryForm.jsx
import { MyForm, MyTextField } from "@/shared/components";
import { faker } from '@faker-js/faker';
import { yupResolver } from "@hookform/resolvers/yup";
import { Casino } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { countries } from "../utils/fakeData";
import { getCountryValidationSchema } from "../utils/validation";

const CountryForm = ({
  open,
  dialogType, // "add" | "edit" | "view"
  selectedCountry,
  onClose,
  onSubmit,
  loading,
  t,
}) => {
  const nameArRef = useRef(null);
  const nameEnRef = useRef(null);
  const alpha2CodeRef = useRef(null);
  const alpha3CodeRef = useRef(null);

  const isViewMode = dialogType === "view";
  const isEditMode = dialogType === "edit";
  const isAddMode = dialogType === "add";

  const schema = getCountryValidationSchema(t);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      alpha2Code: "",
      alpha3Code: "",
      phoneCode: "",
      currencyCode: "",
    },
  });

  // Reset form when dialog opens or selected country changes
  useEffect(() => {
    if (open && (dialogType === "add" || selectedCountry)) {
      reset({
        nameAr: isEditMode || isViewMode ? selectedCountry?.nameAr || "" : "",
        nameEn: isEditMode || isViewMode ? selectedCountry?.nameEn || "" : "",
        alpha2Code:
          isEditMode || isViewMode ? selectedCountry?.alpha2Code || "" : "",
        alpha3Code:
          isEditMode || isViewMode ? selectedCountry?.alpha3Code || "" : "",
        phoneCode:
          isEditMode || isViewMode ? selectedCountry?.phoneCode || "" : "",
        currencyCode:
          isEditMode || isViewMode ? selectedCountry?.currencyCode || "" : "",
      });
    }
  }, [open, dialogType, selectedCountry, reset, isEditMode, isViewMode]);

  // Get appropriate action type for overlay
  const getOverlayActionType = () => {
    if (isAddMode) return "create";
    if (isEditMode) return "update";
    return "save";
  };

  // Get appropriate overlay message
  const getOverlayMessage = () => {
    if (isAddMode)
      return t("countries.creatingCountry") || "Creating country...";
    if (isEditMode)
      return t("countries.updatingCountry") || "Updating country...";
    return t("countries.savingCountry") || "Saving country...";
  };

  // Convert react-hook-form errors to simple error object for MyForm
  const getErrorMessages = () => {
    const errorMessages = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key]?.message) {
        errorMessages[key] = errors[key].message;
      }
    });
    return errorMessages;
  };

  // Handle error found callback
  const handleErrorFound = (fieldName, fieldElement) => {
    console.log(`Validation error in field: ${fieldName}`, fieldElement);
    // You can add custom logic here, such as:
    // - Analytics tracking
    // - Custom focus behavior
    // - Additional UI feedback
  };

  // Generate mock data using Faker.js
  const usedIndexes = new Set<number>();

  const generateMockData = () => {
    if (usedIndexes.size === countries.length) {
      console.warn("⚠️ كل الدول استخدمت بالفعل!");
      return;
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * countries.length);
    } while (usedIndexes.has(index));
    usedIndexes.add(index);

    const country = countries[index];

    const mockData = {
      nameEn: country.en,
      nameAr: country.ar,
      alpha2Code: faker.location.countryCode("alpha-2"),
      alpha3Code: faker.location.countryCode("alpha-3"),
      phoneCode: faker.string.numeric({ length: { min: 1, max: 4 } }),
      currencyCode: faker.finance.currencyCode(),
    };

    setValue("nameEn", mockData.nameEn);
    setValue("nameAr", mockData.nameAr);
    setValue("alpha2Code", mockData.alpha2Code);
    setValue("alpha3Code", mockData.alpha3Code);
    setValue("phoneCode", mockData.phoneCode);
    setValue("currencyCode", mockData.currencyCode);

    console.log("✅ Generated mock data:", mockData);
  };


  return (
    <MyForm
      open={open}
      onClose={onClose}
      title={
        isViewMode
          ? t("countries.view")
          : isEditMode
            ? t("countries.edit")
            : t("countries.add")
      }
      subtitle={
        isViewMode
          ? t("countries.viewSubtitle") || "View country details"
          : isEditMode
            ? t("countries.editSubtitle") || "Modify country information"
            : t("countries.addSubtitle") || "Add a new country to the system"
      }
      submitButtonText={
        isViewMode
          ? null
          : isEditMode
            ? t("actions.update")
            : t("actions.create")
      }
      onSubmit={isViewMode ? undefined : handleSubmit(onSubmit)}
      isSubmitting={loading}
      hideFooter={isViewMode}
      recordId={selectedCountry?.id}
      focusFieldName="nameAr" // Specify which field to focus
      autoFocusFirst={true} // Will focus first field if nameAr not found
      // Overlay customization
      overlayActionType={getOverlayActionType()}
      overlayMessage={getOverlayMessage()}
      // Error handling props
      errors={getErrorMessages()} // Pass the converted errors
      onErrorFound={handleErrorFound} // Optional callback when error is found
      t={t}
    >
      {(isEditMode || isViewMode) && (
        <TextField
          margin="dense"
          label="Id"
          fullWidth
          disabled
          autoComplete="off"
          value={selectedCountry?.id || ""}
          sx={{ display: "none" }}
        />
      )}

      {/* Required: Arabic Name */}
      <Box sx={{ mt: 2 }}>
        <MyTextField
          fieldName="nameAr"
          labelKey={t("general.nameAr")}
          inputRef={nameArRef}
          loading={loading}
          errors={errors}
          control={control}
          placeholder={t("countries.nameArPlaceholder")}
          showCounter={!isViewMode}
          readOnly={isViewMode}
          data-field-name="nameAr" // Add this for better error field detection
        />
      </Box>

      {/* Required: English Name */}
      <MyTextField
        fieldName="nameEn"
        labelKey={t("general.nameEn")}
        inputRef={nameEnRef}
        loading={loading}
        errors={errors}
        control={control}
        placeholder={t("countries.nameEnPlaceholder")}
        showCounter={!isViewMode}
        readOnly={isViewMode}
        data-field-name="nameEn" // Add this for better error field detection
      />

      {/* Optional: Alpha2 Code */}
      <MyTextField
        fieldName="alpha2Code"
        labelKey={t("countries.alpha2Code")}
        inputRef={alpha2CodeRef}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="EG, US, SA"
        showCounter={!isViewMode}
        maxLength={2}
        readOnly={isViewMode}
        data-field-name="alpha2Code" // Add this for better error field detection
      />

      {/* Optional: Alpha3 Code */}
      <MyTextField
        fieldName="alpha3Code"
        labelKey={t("countries.alpha3Code")}
        inputRef={alpha3CodeRef}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="EGY, USA, SAU"
        showCounter={!isViewMode}
        maxLength={3}
        readOnly={isViewMode}
        data-field-name="alpha3Code" // Add this for better error field detection
      />

      {/* Optional: Phone Code */}
      <MyTextField
        fieldName="phoneCode"
        labelKey={t("countries.phoneCode")}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="20, 1, 966"
        showCounter={!isViewMode}
        maxLength={5}
        readOnly={isViewMode}
        data-field-name="phoneCode" // Add this for better error field detection
      />

      {/* Optional: Currency Code */}
      <MyTextField
        fieldName="currencyCode"
        labelKey={t("countries.currencyCode")}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="EGP, USD, SAR"
        showCounter={!isViewMode}
        maxLength={3}
        readOnly={isViewMode}
        data-field-name="currencyCode" // Add this for better error field detection
      />

      {/* Generate Mock Data Button - Show in add and edit modes for testing */}
      {(isAddMode || isEditMode) && (
        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Casino />}
            onClick={generateMockData}
            disabled={loading}
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-1px)'
              }
            }}
          >
            {t("countries.generateMockData") || "🎲 Generate Mock Data with Faker.js"}
          </Button>
        </Box>
      )}
    </MyForm>
  );
};

export default CountryForm;
