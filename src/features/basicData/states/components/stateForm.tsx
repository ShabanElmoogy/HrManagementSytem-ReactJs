// components/StateForm.tsx
import { MyForm, MyTextField, MySelectField } from "@/shared/components";
import { faker } from '@faker-js/faker';
import { yupResolver } from "@hookform/resolvers/yup";
import { Casino } from "@mui/icons-material";
import { Box, TextField, Button } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getStateValidationSchema } from "../utils/validation";
import { useCountries } from "../../countries/hooks/useCountryQueries";
import { states } from "../utils/fakeData";

interface State {
  id: number;
  nameAr?: string;
  nameEn?: string;
  code?: string;
  countryId?: number;
}

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
    formState: { errors },
  } = useForm<StateFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      code: "",
      countryId: 0,
    },
  });

  // Reset form when dialog opens or selected state changes
  useEffect(() => {
    if (open && (dialogType === "add" || selectedState)) {
      reset({
        nameAr: isEditMode || isViewMode ? selectedState?.nameAr || "" : "",
        nameEn: isEditMode || isViewMode ? selectedState?.nameEn || "" : "",
        code: isEditMode || isViewMode ? selectedState?.code || "" : "",
        countryId: isEditMode || isViewMode ? selectedState?.countryId || 0 : 0,
      });
    }
  }, [open, dialogType, selectedState, reset, isEditMode, isViewMode]);

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

  // Prepare country options for dropdown
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: `${country.nameEn} (${country.nameAr})`,
  }));

  // Generate mock data using Faker.js and existing fakeData
  const usedIndexes = new Set<number>();

  const generateMockData = (): void => {
    if (usedIndexes.size === states.length) {
      console.warn("⚠️ كل الولايات استخدمت بالفعل!");
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
    };

    setValue("nameEn", mockData.nameEn);
    setValue("nameAr", mockData.nameAr);
    setValue("code", mockData.code);

    console.log("✅ Generated mock state data:", mockData);
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
      <MySelectField
        fieldName="countryId"
        labelKey={t("general.country")}
        loading={loading}
        errors={errors}
        control={control}
        options={countryOptions}
        placeholder={t("states.selectCountry")}
        readOnly={isViewMode}
        data-field-name="countryId"
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
            {t("states.generateMockData") || "🎲 Generate Mock Data with Faker.js"}
          </Button>
        </Box>
      )}
    </MyForm>
  );
};

export default StateForm;