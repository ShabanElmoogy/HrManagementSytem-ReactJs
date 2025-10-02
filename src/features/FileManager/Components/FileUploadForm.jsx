/* eslint-disable react/prop-types */
// Components/FileUploadForm.jsx
import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import MyForm from "../../../Shared/MyForm";

const FileUploadForm = ({
  open,
  onClose,
  onSubmit,
  loading,
  t,
}) => {
  const fileInputRef = useRef(null);

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

  const handleFormSubmit = (formData) => {
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
      loading={loading}
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
        helperText={errors.files?.message}
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