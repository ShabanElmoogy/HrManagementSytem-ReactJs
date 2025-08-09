/* eslint-disable react/prop-types */
// components/FileUpload/FileUploadActions.jsx
import { CardActions, Button } from "@mui/material";
import { Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";

const FileUploadActions = ({ files, isUploading, onUpload, onClose }) => {
  return (
    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onUpload}
        disabled={files.length === 0 || isUploading}
        fullWidth
        sx={{ mr: 1 }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={onClose}
        disabled={isUploading}
        fullWidth
      >
        Close
      </Button>
    </CardActions>
  );
};

export default FileUploadActions;
