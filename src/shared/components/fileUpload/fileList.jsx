/* eslint-disable react/prop-types */
// components/FileUpload/FileList.jsx
import { Box, Typography, List, Fade } from "@mui/material";
import FileListItem from "./fileListItem";

const FileList = ({ files, isUploading, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <Fade in={true}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selected Files ({files.length})
        </Typography>
        <List>
          {files.map((fileItem, index) => (
            <FileListItem
              key={index}
              fileItem={fileItem}
              index={index}
              isUploading={isUploading}
              onRemove={onRemoveFile}
            />
          ))}
        </List>
      </Box>
    </Fade>
  );
};

export default FileList;
