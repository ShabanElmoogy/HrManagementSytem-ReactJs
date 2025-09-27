// components/DistrictForm.tsx
import { MyForm, MyTextField, MySelectForm } from "@/shared/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Casino } from "@mui/icons-material";
import { Box, TextField, Button } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { District } from "../types/District";
import { useStates } from "../../states/hooks/useStateQueries";

interface DistrictFormData {
  nameAr: string;
  nameEn: string;
  code: string;
  stateId: number;
}

interface DistrictFormProps {
  open: boolean;
  dialogType: "add" | "edit" | "view";
  selectedDistrict?: District | null;
  onClose: () => void;
  onSubmit: (data: DistrictFormData) => void;
  loading: boolean;
  t: (key: string) => string;
}

const getDistrictValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    nameAr: yup
      .string()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(100, t("validation.maxLength", { max: 100 }))
      .matches(/^[\u0600-\u06FF\s]+$/, t("validation.arabicLettersOnly")),
    nameEn: yup
      .string()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(100, t("validation.maxLength", { max: 100 }))
      .matches(/^[A-Za-z\s]+$/, t("validation.englishLettersOnly")),
    code: yup
      .string()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(10, t("validation.maxLength", { max: 10 })),
    stateId: yup
      .number()
      .typeError(t("validation.number"))
      .required(t("general.required"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerNumber")),
  });

const DistrictForm = ({
  open,
  dialogType,
  selectedDistrict,
  onClose,
  onSubmit,
  loading,
  t,
}: DistrictFormProps) => {
  const isViewMode: boolean = dialogType === "view";
  const isEditMode: boolean = dialogType === "edit";
  const isAddMode: boolean = dialogType === "add";

  const schema = getDistrictValidationSchema(t);

  // Load states for dropdown
  const { data: states = [] } = useStates();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DistrictFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      code: "",
      stateId: 0,
    },
  });

  const watchedStateId = watch("stateId");

  useEffect(() => {
    if (open) {
      if (dialogType === "add") {
        reset({ nameAr: "", nameEn: "", code: "", stateId: 0 });
      } else if ((isEditMode || isViewMode) && selectedDistrict) {
        const stateId = selectedDistrict.stateId || selectedDistrict.state?.id || 0;
        reset({
          nameAr: selectedDistrict.nameAr || "",
          nameEn: selectedDistrict.nameEn || "",
          code: selectedDistrict.code || "",
          stateId: Number(stateId),
        });
      }
    }
  }, [open, dialogType, selectedDistrict, reset, isEditMode, isViewMode, states.length]);

  const getOverlayActionType = (): string => {
    if (isAddMode) return "create";
    if (isEditMode) return "update";
    return "save";
  };

  const getOverlayMessage = (): string => {
    if (isAddMode) return t("districts.creatingDistrict") || "Creating district...";
    if (isEditMode) return t("districts.updatingDistrict") || "Updating district...";
    return t("districts.savingDistrict") || "Saving district...";
  };

  const getErrorMessages = (): Record<string, string> => {
    const errorMessages: Record<string, string> = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key as keyof DistrictFormData]?.message) {
        errorMessages[key] = errors[key as keyof DistrictFormData]?.message as string;
      }
    });
    return errorMessages;
  };

  const handleErrorFound = (fieldName: string, fieldElement: HTMLElement): void => {
    console.log(`Validation error in field: ${fieldName}`, fieldElement);
  };

  // Prepare states data for MySelectForm
  const statesData = states.map((state) => ({
    id: Number(state.id),
    nameEn: state.nameEn,
    nameAr: state.nameAr,
    displayName: `${state.nameEn} (${state.nameAr})`,
  }));

  // Late-loading handling for states
  useEffect(() => {
    if (open && (isEditMode || isViewMode) && selectedDistrict && states.length > 0) {
      const stateId = selectedDistrict.stateId || selectedDistrict.state?.id;
      if (stateId && watchedStateId !== Number(stateId)) {
        setValue("stateId", Number(stateId));
      }
    }
  }, [open, isEditMode, isViewMode, selectedDistrict, states.length, watchedStateId, setValue]);

  // Mock data for districts: use state code + random number
  const generateMockData = (): void => {
    if (!states || states.length === 0) return;

    const randomIndex = Math.floor(Math.random() * states.length);
    const base = states[randomIndex];

    const mock = {
      nameEn: `${base.nameEn} District`,
      nameAr: `${base.nameAr} حي`,
      code: `${(base.code || base.nameEn.slice(0, 3)).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      stateId: Number(base.id),
    };

    setValue("nameEn", mock.nameEn);
    setValue("nameAr", mock.nameAr);
    setValue("code", mock.code);
    setValue("stateId", mock.stateId);

    console.log("✅ Generated mock district data:", mock);
  };

  return (
    <MyForm
      maxHeight="65vh"
      open={open}
      onClose={onClose}
      title={
        isViewMode ? t("districts.view") : isEditMode ? t("districts.edit") : t("districts.add")
      }
      subtitle={
        isViewMode
          ? t("districts.viewSubtitle") || "View district details"
          : isEditMode
          ? t("districts.editSubtitle") || "Modify district information"
          : t("districts.addSubtitle") || "Add a new district to the system"
      }
      submitButtonText={isViewMode ? null : isEditMode ? t("actions.update") : t("actions.create")}
      onSubmit={isViewMode ? undefined : handleSubmit(onSubmit)}
      isSubmitting={loading}
      hideFooter={isViewMode}
      recordId={selectedDistrict?.id}
      focusFieldName="nameAr"
      autoFocusFirst={true}
      overlayActionType={getOverlayActionType()}
      overlayMessage={getOverlayMessage()}
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
          value={selectedDistrict?.id || ""}
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
          placeholder={t("districts.nameArPlaceholder") || "الاسم بالعربية"}
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
        placeholder={t("districts.nameEnPlaceholder") || "English name"}
        showCounter={!isViewMode}
        readOnly={isViewMode}
        data-field-name="nameEn"
      />

      {/* Required: Code */}
      <MyTextField
        fieldName="code"
        labelKey={t("districts.code") || "Code"}
        loading={loading}
        errors={errors}
        control={control}
        placeholder="DST-001"
        showCounter={!isViewMode}
        maxLength={10}
        readOnly={isViewMode}
        data-field-name="code"
      />

      {/* Required: State */}
      <MySelectForm
        name="stateId"
        label={t("general.state") || "State"}
        control={control}
        dataSource={statesData}
        valueMember="id"
        displayMember="displayName"
        loading={loading}
        errors={errors}
        placeholder={t("districts.selectState") || "Select a state"}
        isViewMode={isViewMode}
        disabled={loading}
        showClearButton={!isViewMode}
        actualFieldName="stateId"
        colorMember={undefined}
        loadingText={undefined}
        noOptionsText={undefined}
      />

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
              '&:hover': { boxShadow: 4, transform: 'translateY(-1px)' }
            }}
          >
            {t("districts.generateMockData") || "🎲 Generate Mock Data"}
          </Button>
        </Box>
      )}
    </MyForm>
  );
};

export default DistrictForm;
