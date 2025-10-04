import React from "react";
import {
  Button,
  Card,
  CardActions,
  Divider,
  Stack,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import UploadExcel from "@/shared/components/fileUpload/uploadExcel";

interface UploadSectionProps {
  selectedFile: File | null;
  loading: boolean;
  loadingText: string;
  uploadProgress: number;
  countriesCount: number;
  onFileSelect: (file: File) => void;
  validateFile: (file: File) => boolean;
  onUpload: () => void;
  onClear: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedFile,
  loading,
  loadingText,
  uploadProgress,
  countriesCount,
  onFileSelect,
  validateFile,
  onUpload,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: { xs: 3, sm: 4 }, overflow: "visible" }}>
      <UploadExcel
        title={t("dragDropText") || "Drag and drop your file here or click to browse"}
        description={t("supportedFormats") || "Supported format: .xlsx"}
        acceptedFileTypes=".xlsx"
        onFileSelect={onFileSelect}
        validateFile={validateFile}
        selectedFile={selectedFile}
        isLoading={loading && loadingText !== ""}
        progress={uploadProgress}
        getFileInfo={() => `${countriesCount} ${(t("countries.title") || "Countries")}`}
      />

      <Divider />

      <CardActions
        sx={{
          p: 2,
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={onUpload}
            disabled={countriesCount === 0 || loading}
            size="large"
          >
            {t("uploadData") || "Upload"}
          </Button>
          {countriesCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onClear}
              disabled={loading}
            >
              {t("clearData") || "Clear"}
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default UploadSection;
