/* eslint-disable react/prop-types */
// components/FileUpload/DropZone.jsx
import { useRef } from "react";
import { Button, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { VisuallyHiddenInput, StyledDropZone } from "./styledComponents";

const DropZone = ({
  dragActive,
  isUploading,
  multiple,
  accept,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
  onClick,
}) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    onFileInput?.(e);
    // Allow selecting the same file again by resetting the input value
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClick = () => {
    // Reset value before opening dialog so same-file selection triggers onChange
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  };
  return (
    <StyledDropZone
      className={dragActive ? "dragover" : ""}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick || handleClick}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Drag and Drop Files
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        or click to select
      </Typography>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isUploading}
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
      >
        Select Files
        <VisuallyHiddenInput
          ref={inputRef}
          type="file"
          onChange={handleInputChange}
          multiple={multiple}
          disabled={isUploading}
          accept={accept}
        />
      </Button>
    </StyledDropZone>
  );
};

export default DropZone;
