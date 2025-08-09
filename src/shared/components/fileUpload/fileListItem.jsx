/* eslint-disable react/prop-types */
// components/FileUpload/FileListItem.jsx
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import FileStatusIcon from "./FileStatusIcon";
import { formatFileSize } from "../../Utilites/Functions/FormatFileSize";

const FileListItem = ({ fileItem, index, isUploading, onRemove }) => {
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
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onRemove(index)}
          disabled={isUploading && fileItem.status === "uploading"}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default FileListItem;
