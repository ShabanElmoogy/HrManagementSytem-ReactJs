import React, { useMemo, useState } from "react";
import { Box, Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import TableRowsIcon from "@mui/icons-material/TableRows";
import GroupedFilesView from "./GroupedFilesView";
import { FileItem, FileTypeGroup } from "./FileTypeClassifier";

export interface FileManagerViewSwitcherProps {
  files: FileItem[];
  // Render prop to render your existing FilesDataGrid view
  renderDataGrid: () => React.ReactNode;
  onOpenFile?: (file: FileItem) => void;
  onOpenGroup?: (group: FileTypeGroup, files: FileItem[]) => void;
  defaultView?: "grouped" | "datagrid";
  storageKey?: string;
}

const FileManagerViewSwitcher: React.FC<FileManagerViewSwitcherProps> = ({
  files,
  renderDataGrid,
  onOpenFile,
  onOpenGroup,
  defaultView = "datagrid",
  storageKey = "fm-view-mode",
}) => {
  const persisted = useMemo(() => {
    const v = localStorage.getItem(storageKey);
    return v === "grouped" || v === "datagrid" ? v : defaultView;
  }, [defaultView, storageKey]);

  const [mode, setMode] = useState<"grouped" | "datagrid">(persisted as any);

  const handleChange = (_: any, value: "grouped" | "datagrid" | null) => {
    if (!value) return;
    setMode(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Paper sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
        <ToggleButtonGroup size="small" exclusive value={mode} onChange={handleChange}>
          <Tooltip title="Grouped View">
            <ToggleButton value="grouped" aria-label="Grouped view">
              <FolderIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Data Grid View">
            <ToggleButton value="datagrid" aria-label="Data grid view">
              <TableRowsIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Paper>

      {mode === "grouped" ? (
        <GroupedFilesView files={files} onOpenFile={onOpenFile} onOpenGroup={onOpenGroup} />
      ) : (
        <>{renderDataGrid()}</>
      )}
    </Box>
  );
};

export default FileManagerViewSwitcher;
