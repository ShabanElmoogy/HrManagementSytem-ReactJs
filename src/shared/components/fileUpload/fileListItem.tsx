import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FileStatusIcon from "./fileStatusIcon";
import { formatFileSize } from "@/shared/utils/formatFileSize";

interface FileItem {
  file: File;
  status: string;
  progress?: number;
  error?: string;
}

interface FileListItemProps {
  fileItem: FileItem;
  index: number;
  isUploading: boolean;
  onRemove: (index: number) => void;
}

const FileListItem = ({ fileItem, index, isUploading, onRemove }: FileListItemProps) => {
  const { t } = useTranslation();

  return (
    <ListItem
      sx={{
        bgcolor: "background.paper",
        mb: 1,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      <ListItemIcon>
        <FileStatusIcon status={fileItem.status} />
      </ListItemIcon>
      <ListItemText
        primary={fileItem.file.name}
        secondary={
          <Box>
            <Typography variant="caption" display="block">
              {formatFileSize(fileItem.file.size)}
            </Typography>
            {fileItem.status === "uploading" && (
              <LinearProgress
                variant="determinate"
                value={fileItem.progress}
                sx={{ mt: 1 }}
              />
            )}
            {fileItem.error && (
              <Typography variant="caption" color="error">
                {fileItem.error}
              </Typography>
            )}
          </Box>
        }
      />
        <Tooltip title={t("files.removeFiles")}>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onRemove(index)}
            disabled={isUploading && fileItem.status === "uploading"}
          >
            <DeleteIcon sx={{ color: (theme) => theme.palette.error.main }} />
          </IconButton>
        </Tooltip>
    </ListItem>
  );
};

export default FileListItem;