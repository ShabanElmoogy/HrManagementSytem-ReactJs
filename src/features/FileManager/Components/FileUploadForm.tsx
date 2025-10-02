/* eslint-disable react/prop-types */
// Components/FileUploadForm.tsx
import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import MyForm from "@/shared/components/common/form/myForm";

interface FileUploadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  t: (key: string) => string;
}

const FileUploadForm = ({
  open,
  onClose,
  onSubmit,
  loading,
  t,
}: FileUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { files: null },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({ files: null });
    }
  }, [open, reset]);

  // Focus file input when dialog opens
  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => fileInputRef.current?.focus(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleFormSubmit = (formData: { files: FileList | null }) => {
    const files = formData.files;
    if (!files || files.length === 0) {
      return;
    }

    // Create FormData properly
    const uploadData = new FormData();
    Array.from(files).forEach((file) => {
      uploadData.append("files", file);
    });

    onSubmit(uploadData);
  };

  return (
    <MyForm
      open={open}
      onClose={onClose}
      title={t("uploadFiles")}
      submitButtonText={t("upload")}
      onSubmit={handleSubmit(handleFormSubmit)}
      isSubmitting={loading}
    >
      <TextField
        {...register("files", {
          required: t("pleaseSelectFiles"),
        })}
        inputRef={fileInputRef}
        margin="normal"
        label={t("selectFiles")}
        type="file"
        fullWidth
        disabled={loading}
        error={!!errors.files}
        helperText={errors.files?.message as string}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          multiple: true,
          accept: "*/*",
        }}
      />
    </MyForm>
  );
};

export default FileUploadForm;