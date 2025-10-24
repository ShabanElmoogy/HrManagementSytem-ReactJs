import { MyForm, MySelectForm, MyTextField } from "@/shared/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Casino } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { useCountries } from "../../countries/hooks/useCountryQueries";
import { State } from "../types/State";
import { states } from "../utils/fakeData";
import { getStateValidationSchema } from "../utils/validation";

interface StateFormData {
  nameAr: string;
  nameEn: string;
  code: string;
  countryId: number;
}

interface StateFormProps {
  open: boolean;
  dialogType: "add" | "edit" | "view";
  selectedState?: State | null;
  onClose: () => void;
  onSubmit: (data: StateFormData) => void;
  loading: boolean;
  t: (key: string) => string;
}

const StateForm = ({
  open,
  dialogType,
  selectedState,
  onClose,
  onSubmit,
  loading,
  t,
}: StateFormProps) => {
  const isViewMode: boolean = dialogType === "view";
  const isEditMode: boolean = dialogType === "edit";
  const isAddMode: boolean = dialogType === "add";

  const schema = getStateValidationSchema(t);

  // Get countries for dropdown
  const { data: countries = [] } = useCountries();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StateFormData, any, StateFormData>({
    resolver: yupResolver<StateFormData, any, StateFormData>(schema) as unknown as Resolver<StateFormData, any, StateFormData>,
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      code: "",
      countryId: 0,
    },
  });

  // Watch the countryId value
  const watchedCountryId = watch("countryId");

  // Reset form when dialog opens or selected state changes
  useEffect(() => {
    if (open) {
      if (dialogType === "add") {
        // Reset to empty form for add mode
        reset({
          nameAr: "",
          nameEn: "",
          code: "",
          countryId: 0,
        });
      } else if ((isEditMode || isViewMode) && selectedState) {
        // Extract countryId from either direct property or nested country object
        const countryId = selectedState.countryId || selectedState.country?.id || 0;

        // Reset form with selected state data
        reset({
          nameAr: selectedState.nameAr || "",
          nameEn: selectedState.nameEn || "",
          code: selectedState.code || "",
          countryId: Number(countryId),
        });
      }
    }
  }, [open, dialogType, selectedState, reset, isEditMode, isViewMode, countries.length]);

  // Get appropriate action type for overlay
  const getOverlayActionType = (): string => {
    if (isAddMode) return "create";
    if (isEditMode) return "update";
    return "save";
  };

  // Get appropriate overlay message
  const getOverlayMessage = (): string => {
    if (isAddMode)
      return t("states.creatingState") || "Creating state...";
    if (isEditMode)
      return t("states.updatingState") || "Updating state...";
    return t("states.savingState") || "Saving state...";
  };

  // Convert react-hook-form errors to simple error object for MyForm
  const getErrorMessages = (): Record<string, string> => {
    const errorMessages: Record<string, string> = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key as keyof StateFormData]?.message) {
        errorMessages[key] = errors[key as keyof StateFormData]?.message as string;
      }
    });
    return errorMessages;
  };

  // Handle error found callback
  const handleErrorFound = (fieldName: string, fieldElement: HTMLElement): void => {
    console.log(`Validation error in field: ${fieldName}`, fieldElement);
  };

  // Prepare countries data for MySelectForm
  const countriesData = countries.map((country) => ({
    id: Number(country.id), // Ensure ID is a number to match countryId type
    nameEn: country.nameEn,
    nameAr: country.nameAr,
    displayName: `${country.nameEn} (${country.nameAr})`,
  }));

  // Additional effect to handle late-loading countries data
  useEffect(() => {
    if (open && (isEditMode || isViewMode) && selectedState && countries.length > 0) {
      const countryId = selectedState.countryId || selectedState.country?.id;
      if (countryId && watchedCountryId !== Number(countryId)) {
        setValue("countryId", Number(countryId));
      }
    }
  }, [open, isEditMode, isViewMode, selectedState, countries.length, watchedCountryId, setValue]);

  // Force update when countries load and we have a selected state
  useEffect(() => {
    if (open && (isEditMode || isViewMode) && selectedState && countries.length > 0) {
      // Small delay to ensure the form is ready
      const timer = setTimeout(() => {
        const countryId = selectedState.countryId || selectedState.country?.id;
        if (countryId && watchedCountryId !== Number(countryId)) {
          setValue("countryId", Number(countryId), { shouldValidate: true });
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Return undefined for the else case
    return undefined;
  }, [open, isEditMode, isViewMode, selectedState, countries.length, watchedCountryId, setValue]);

  // Generate mock data using Faker.js and existing fakeData
  const usedIndexes = new Set<number>();

  const generateMockData = (): void => {
    if (usedIndexes.size === states.length) {
      return;
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * states.length);
    } while (usedIndexes.has(index));
    usedIndexes.add(index);

    const state = states[index];

    const mockData = {
      nameEn: state.en,
      nameAr: state.ar,
      code: state.code,
      countryId: 0, // Default or placeholder
    };

    // If countriesData is available, pick a random countryId
    if (countriesData.length > 0) {
      const randomCountryIndex = Math.floor(Math.random() * countriesData.length);
      mockData.countryId = countriesData[randomCountryIndex].id;
    }

    setValue("nameEn", mockData.nameEn);
    setValue("nameAr", mockData.nameAr);
    setValue("code", mockData.code);
    setValue("countryId", mockData.countryId);
  };

  const onSubmitHandler: SubmitHandler<StateFormData> = (data) => onSubmit(data);

  return (
    <MyForm
      maxHeight="80vh"
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
      onSubmit={isViewMode ? undefined : handleSubmit(onSubmitHandler)}
      isSubmitting={loading}
      hideFooter={isViewMode}
      recordId={selectedState?.id}
      focusFieldName="nameAr"
      autoFocusFirst={true}
      // Overlay customization
      overlayActionType={getOverlayActionType()}
      overlayMessage={getOverlayMessage()}
      // Error handling props
      errors={getErrorMessages()}
      onErrorFound={handleErrorFound}
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

      {/* Required: Arabic Name */}
      <Box sx={{ mt: 2 }}>
        <MyTextField
          fieldName="nameAr"
          labelKey={t("general.nameAr")}
          loading={loading}
          errors={errors}
          control={control}
          placeholder={t("states.nameArPlaceholder")}
          showCounter={!isViewMode}
          readOnly={isViewMode}
          data-field-name="nameAr"
        />
      </Box>

      {/* Required: English Name */}
      <MyTextField
        fieldName="nameEn"
        labelKey={t("general.nameEn")}
        loading={loading}
        errors={errors}
        control={control}
        placeholder={t("states.nameEnPlaceholder")}
        showCounter={!isViewMode}
        readOnly={isViewMode}
        data-field-name="nameEn"
      />

      {/* Required: Code */}
      <MyTextField
        fieldName="code"
        labelKey={t("states.code")}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="CA, NY, TX"
        showCounter={!isViewMode}
        maxLength={10}
        readOnly={isViewMode}
        data-field-name="code"
      />

      {/* Required: Country */}
      <MySelectForm
        name="countryId"
        label={t("general.country")}
        control={control}
        dataSource={countriesData}
        valueMember="id"
        displayMember="displayName"
        loading={loading}
        errors={errors}
        placeholder={t("states.selectCountry")}
        isViewMode={isViewMode}
        disabled={loading}
        showClearButton={!isViewMode}
        actualFieldName="countryId"
        colorMember={undefined}
        loadingText={undefined}
        noOptionsText={undefined} />

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
            {t("states.generateMockData") || "🎲 Generate Mock Data with Faker.js"}
          </Button>
        </Box>
      )}
    </MyForm>
  );
};

export default StateForm;
