import { MyForm, MyTextField } from "@/shared/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { getAddressTypeValidationSchema } from "../utils/validation";
import {
  CreateAddressTypeRequest,
  AddressTypeFormProps,
} from "../types/AddressType";
import { Casino } from "@mui/icons-material";
import { addressTypes } from "../utils/fakeData";

const AddressTypeForm = ({
  open,
  dialogType,
  selectedItem,
  onClose,
  onSubmit,
  loading,
  t,
}: AddressTypeFormProps) => {
  const nameArRef = useRef<HTMLInputElement>(null);
  const nameEnRef = useRef<HTMLInputElement>(null);

  const isViewMode: boolean = dialogType === "view";
  const isEditMode: boolean = dialogType === "edit";
  const isAddMode: boolean = dialogType === "add";

  const schema = getAddressTypeValidationSchema(t);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateAddressTypeRequest>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { nameAr: "", nameEn: "" },
  });

  useEffect(() => {
    if (open && (isAddMode || selectedItem)) {
      reset({
        nameAr: isEditMode || isViewMode ? selectedItem?.nameAr || "" : "",
        nameEn: isEditMode || isViewMode ? selectedItem?.nameEn || "" : "",
      });
    }
  }, [
    open,
    dialogType,
    selectedItem,
    reset,
    isEditMode,
    isViewMode,
    isAddMode,
  ]);

  const usedIndexes = useRef(new Set<number>());

  const generateMockData = (): void => {
    if (usedIndexes.current.size === addressTypes.length) {
      usedIndexes.current.clear(); // Reset if all data has been used
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * addressTypes.length);
    } while (usedIndexes.current.has(index));
    usedIndexes.current.add(index);

    const addressType = addressTypes[index];

    const mockData = {
      nameEn: addressType.nameEn,
      nameAr: addressType.nameAr,
    };

    reset({
      nameEn: mockData.nameEn,
      nameAr: mockData.nameAr,
    });
  };

  const getOverlayActionType = (): string => {
    if (isAddMode) return "create";
    if (isEditMode) return "update";
    return "save";
  };

  const getOverlayMessage = (): string => {
    if (isAddMode)
      return t("addressTypes.creating") || "Creating address type...";
    if (isEditMode)
      return t("addressTypes.updating") || "Updating address type...";
    return t("addressTypes.saving") || "Saving address type...";
  };

  const getErrorMessages = (): Record<string, string> => {
    const errorMessages: Record<string, string> = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key as keyof CreateAddressTypeRequest]?.message) {
        errorMessages[key] = errors[key as keyof CreateAddressTypeRequest]
          ?.message as string;
      }
    });
    return errorMessages;
  };

  const handleErrorFound = (
    fieldName: string,
    fieldElement: HTMLElement
  ): void => {
    console.log(`Validation error in field: ${fieldName}`, fieldElement);
  };

  return (
    <MyForm
      maxHeight="58vh"
      open={open}
      onClose={onClose}
      title={
        isViewMode
          ? t("addressTypes.view")
          : isEditMode
          ? t("addressTypes.edit")
          : t("addressTypes.add")
      }
      subtitle={
        isViewMode
          ? t("addressTypes.viewSubtitle") || "View address type details"
          : isEditMode
          ? t("addressTypes.editSubtitle") || "Modify address type information"
          : t("addressTypes.addSubtitle") ||
            "Add a new address type to the system"
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
      recordId={selectedItem?.id}
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
          value={selectedItem?.id || ""}
          sx={{ display: "none" }}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <MyTextField
          fieldName="nameAr"
          labelKey={t("general.nameAr")}
          inputRef={nameArRef}
          loading={loading}
          errors={errors}
          control={control}
          placeholder={t("addressTypes.nameArPlaceholder")}
          showCounter={!isViewMode}
          readOnly={isViewMode}
          data-field-name="nameAr"
        />
      </Box>

      <MyTextField
        fieldName="nameEn"
        labelKey={t("general.nameEn")}
        inputRef={nameEnRef}
        loading={loading}
        errors={errors}
        control={control}
        placeholder={t("addressTypes.nameEnPlaceholder")}
        showCounter={!isViewMode}
        readOnly={isViewMode}
        data-field-name="nameEn"
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
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("addressTypes.generateMockData") || "🎲 Generate Mock Data"}
          </Button>
        </Box>
      )}
    </MyForm>
  );
};

export default AddressTypeForm;
