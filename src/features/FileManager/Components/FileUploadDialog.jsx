/* eslint-disable react/prop-types */
// components/FileUploadDialog.jsx
import { Dialog } from "@mui/material";
import FileUpload from "../FileUpload";

const FileUploadDialog = ({ open, onClose, onSuccess, onError, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <FileUpload
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
        loading={loading}
      />
    </Dialog>
  );
};

export default FileUploadDialog;
