/* eslint-disable react/prop-types */
// components/FileUpload/DropZone.jsx
import { Button, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { VisuallyHiddenInput, StyledDropZone } from "./styledComponents";

const DropZone = ({
  dragActive,
  isUploading,
  multiple,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
  onClick,
}) => {
  return (
    <StyledDropZone
      className={dragActive ? "dragover" : ""}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Drag and Drop Files
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        or click to select
      </Typography>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isUploading}
      >
        Select Files
        <VisuallyHiddenInput
          type="file"
          onChange={onFileInput}
          multiple={multiple}
          disabled={isUploading}
        />
      </Button>
    </StyledDropZone>
  );
};

export default DropZone;
