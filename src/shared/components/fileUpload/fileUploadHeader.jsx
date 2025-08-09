/* eslint-disable react/prop-types */
// components/FileUpload/FileUploadHeader.jsx
import { Typography, Alert } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const FileUploadHeader = ({ globalError }) => {
  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <CloudUploadIcon color="primary" />
        Upload Files
      </Typography>

      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}
    </>
  );
};

export default FileUploadHeader;
