/* eslint-disable react/prop-types */
// components/StateForm.jsx
import { MyForm, MySelectForm, MyTextField } from "@/shared/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { getStateValidationSchema } from "../utils/validation";
import { useCountries } from "../../countries/hooks/useCountryQueries";

const StateForm = ({
  open,
  dialogType, // "add" | "edit" | "view"
  selectedState,
  onClose,
  onSubmit,
  loading,
  t,
}) => {
  const nameArRef = useRef(null);
  const nameEnRef = useRef(null);
  const codeRef = useRef(null);

  const isViewMode = dialogType === "view";
  const isEditMode = dialogType === "edit";
  const isAddMode = dialogType === "add";

  // Get countries for the dropdown using TanStack Query
  const { 
    data: countries = [], 
    isLoading: countriesLoading, 
    error: countriesError 
  } = useCountries({
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const schema = getStateValidationSchema(t);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      code: "",
      countryId: null,
    },
  });

  // Reset form when dialog opens or selected state changes
  useEffect(() => {
    if (open && (dialogType === "add" || selectedState)) {
      reset({
        nameAr: isEditMode || isViewMode ? selectedState?.nameAr || "" : "",
        nameEn: isEditMode || isViewMode ? selectedState?.nameEn || "" : "",
        code: isEditMode || isViewMode ? selectedState?.code || "" : "",
        countryId: isEditMode || isViewMode ? selectedState?.country?.id || selectedState?.countryId || null : null,
      });
    }
  }, [open, dialogType, selectedState, reset, isEditMode, isViewMode]);

  // Get appropriate action type for overlay
  const getOverlayActionType = () => {
    if (isAddMode) return "create";
    if (isEditMode) return "update";
    return "save";
  };

  // Get appropriate overlay message
  const getOverlayMessage = () => {
    if (isAddMode)
      return t("states.creatingState") || "Creating state...";
    if (isEditMode)
      return t("states.updatingState") || "Updating state...";
    return t("states.savingState") || "Saving state...";
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

  return (
    <MyForm
      open={open}
      onClose={onClose}
      title={
        isViewMode
          ? t("states.view")
          : isEditMode
          ? t("states.edit")
          : t("states.add")
      }
      subtitle={
        isViewMode
          ? t("states.viewSubtitle") || "View state details"
          : isEditMode
          ? t("states.editSubtitle") || "Modify state information"
          : t("states.addSubtitle") || "Add a new state to the system"
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
      recordId={selectedState?.id}
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
          value={selectedState?.id || ""}
          sx={{ display: "none" }}
        />
      )}

      {/* Required: Country Selection */}
      <Box sx={{ mt: 2 }}>
        <MySelectForm
          control={control}
          name="countryId"
          label={t("general.country")}
          dataSource={countries.filter(c => !c.isDeleted)}
          valueMember="id"
          displayMember="nameEn"
          placeholder={t("states.selectCountry") || "Select a country"}
          loading={loading || countriesLoading}
          disabled={isViewMode}
          errors={errors}
          showClearButton={!isViewMode}
          helperText={countriesError ? `Error loading countries: ${countriesError.message}` : undefined}
        />
      </Box>

      {/* Required: Arabic Name */}
      <Box sx={{ mt: 2 }}>
        <MyTextField
          fieldName="nameAr"
          labelKey={t("general.nameAr")}
          inputRef={nameArRef}
          loading={loading}
          errors={errors}
          control={control}
          placeholder={t("states.nameArPlaceholder")}
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
        placeholder={t("states.nameEnPlaceholder")}
        showCounter={!isViewMode}
        readOnly={isViewMode}
        data-field-name="nameEn" // Add this for better error field detection
      />

      {/* Required: Code */}
      <MyTextField
        fieldName="code"
        labelKey={t("states.code")}
        inputRef={codeRef}
        loading={loading}
        errors={errors}
        control={control}
        placeholder={t("states.codePlaceholder")}
        showCounter={!isViewMode}
        maxLength={10}
        readOnly={isViewMode}
        data-field-name="code" // Add this for better error field detection
      />
    </MyForm>
  );
};

export default StateForm;