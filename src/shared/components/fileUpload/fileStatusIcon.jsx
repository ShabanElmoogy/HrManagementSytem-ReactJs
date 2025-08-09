// components/FileUpload/FileStatusIcon.jsx
import { CircularProgress } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";

const FileStatusIcon = ({ status }) => {
  switch (status) {
    case "success":
      return <CheckCircleIcon color="success" />;
    case "error":
      return <ErrorIcon color="error" />;
    case "uploading":
      return <CircularProgress size={24} />;
    default:
      return <FileIcon />;
  }
};

export default FileStatusIcon;
