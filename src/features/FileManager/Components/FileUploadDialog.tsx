/* eslint-disable react/prop-types */
// components/FileUploadDialog.tsx
import { Dialog } from "@mui/material";
import FileUpload from "../FileUpload";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (fileName: string) => void;
  onError: (errors: any) => void;
  loading?: boolean;
}

const FileUploadDialog = ({ open, onClose, onSuccess, onError, loading }: FileUploadDialogProps) => {
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