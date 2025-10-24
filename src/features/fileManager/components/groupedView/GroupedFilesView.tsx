import React, { useMemo, useState } from "react";
import { Box, Grid, TextField, MenuItem, Pagination } from "@mui/material";
import {
  Image as ImageIcon,
  Description as DocumentIcon,
  TableChart as SpreadsheetIcon,
  Slideshow as PresentationIcon,
  PictureAsPdf as PdfIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import GroupFolderCard from "./GroupFolderCard";
import FileTile from "./FileTile";
import { FileItem, FileTypeGroup } from "./FileTypeClassifier";
import { groupByType } from "./groupByType";
import { formatDistanceToNow } from "date-fns";

export interface GroupedFilesViewProps {
  files: FileItem[];
  onOpenFile?: (file: FileItem) => void;
  onDeleteFile?: (file: FileItem) => void;
  onOpenGroup?: (group: FileTypeGroup, files: FileItem[]) => void;
  onGroupChange?: (
    group: { name: string; icon: React.ReactNode } | null
  ) => void;
  onBackToGroups?: React.MutableRefObject<(() => void) | null>;
}

type SortKey = "name" | "size" | "updated";

const GroupedFilesView: React.FC<GroupedFilesViewProps> = ({
  files,
  onOpenFile,
  onDeleteFile,
  onOpenGroup,
  onGroupChange,
  onBackToGroups,
}) => {
  const [query, setQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const mappedFiles = useMemo(() => {
    return files.map((file) => ({
      id: file.id.toString(),
      name:
        (file as any).fileName ||
        (file as any).storedFileName ||
        `File ${file.id}`,
      size: undefined as number | undefined, // Not available in current FileItem
      mimeType: (file as any).contentType,
      extension: (file as any).fileExtension?.replace(".", ""),
      updatedAt: (file as any).updatedOn,
    }));
  }, [files]);

  const sorted = useMemo(() => {
    return [...mappedFiles].sort((a, b) => {
      switch (sortKey) {
        case "size":
          return (a.size || 0) - (b.size || 0);
        case "updated":
          return (
            new Date(a.updatedAt || 0).getTime() -
            new Date(b.updatedAt || 0).getTime()
          );
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });
  }, [mappedFiles, sortKey]);

  const groups = useMemo(() => {
    const allGroups = groupByType(sorted);
    if (!query.trim()) return allGroups;

    const q = query.trim().toLowerCase();
    const filteredGroups: Record<string, any[]> = {};

    Object.entries(allGroups).forEach(([groupName, files]) => {
      const filteredFiles = files.filter((f) =>
        (f.name || "").toLowerCase().includes(q)
      );
      if (filteredFiles.length > 0) {
        filteredGroups[groupName] = filteredFiles;
      }
    });

    return filteredGroups;
  }, [sorted, query]);

  const getGroupIcon = (group: string) => {
    switch (group) {
      case "Images":
        return <ImageIcon />;
      case "Documents":
        return <DocumentIcon />;
      case "Spreadsheets":
        return <SpreadsheetIcon />;
      case "Presentations":
        return <PresentationIcon />;
      case "PDFs":
        return <PdfIcon />;
      case "Audio":
        return <AudioIcon />;
      case "Video":
        return <VideoIcon />;
      case "Archives":
        return <ArchiveIcon />;
      case "Code":
        return <CodeIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case "Images":
        return "#4CAF50";
      case "Documents":
        return "#2196F3";
      case "Spreadsheets":
        return "#FF9800";
      case "Presentations":
        return "#E91E63";
      case "PDFs":
        return "#F44336";
      case "Audio":
        return "#9C27B0";
      case "Video":
        return "#FF5722";
      case "Archives":
        return "#795548";
      case "Code":
        return "#607D8B";
      default:
        return "#9E9E9E";
    }
  };

  const handleGroupClick = (group: string, items: FileItem[]) => {
    setSelectedGroup(group);
    onOpenGroup?.(group as FileTypeGroup, items);
    onGroupChange?.({
      name: group,
      icon: getGroupIcon(group),
    });
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setGroupQuery("");
    setPage(1);
    onGroupChange?.(null);
  };

  // Expose handleBackToGroups to parent component
  React.useEffect(() => {
    if (onBackToGroups) {
      onBackToGroups.current = handleBackToGroups;
    }
  }, [onBackToGroups]);

  // If a group is selected, show files in that group
  if (selectedGroup && (groups as any)[selectedGroup]) {
    const allGroupFiles = (groups as any)[selectedGroup];
    const filteredGroupFiles = groupQuery.trim()
      ? allGroupFiles.filter((f: any) =>
          (f.name || "").toLowerCase().includes(groupQuery.trim().toLowerCase())
        )
      : allGroupFiles;

    const totalPages = Math.ceil(filteredGroupFiles.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedFiles = filteredGroupFiles.slice(
      startIndex,
      startIndex + pageSize
    );

    return (
      <Box
        sx={{ p: 2, pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            label="Search in group"
            value={groupQuery}
            onChange={(e) => {
              setGroupQuery(e.target.value);
              setPage(1);
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {paginatedFiles.map((f: any) => (
            <FileTile
              name={f.name}
              subtitle={[
                f.updatedAt
                  ? `Updated ${formatDistanceToNow(new Date(f.updatedAt))} ago`
                  : undefined,
              ]
                .filter(Boolean)
                .join(" • ")}
              onOpen={() => {
                const originalFile = files.find(
                  (file) => file.id.toString() === f.id
                );
                if (originalFile) onOpenFile?.(originalFile as any);
              }}
              onDelete={() => {
                const originalFile = files.find(
                  (file) => file.id.toString() === f.id
                );
                if (originalFile) onDeleteFile?.(originalFile as any);
              }}
              onPreview={() => {
                const originalFile = files.find(
                  (file) => file.id.toString() === f.id
                );
                if (originalFile) {
                  onOpenFile?.(originalFile as any);
                }
                return null;
              }}
            />
          ))}
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    );
  }

  // Show groups overview
  return (
    <Box sx={{ p: 2, pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          label="Search all files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ width: 300 }}
        />
        <TextField
          size="small"
          label="Sort by"
          select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          sx={{ width: 180 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="size">Size</MenuItem>
          <MenuItem value="updated">Last Updated</MenuItem>
        </TextField>
      </Box>

      {/* Folders grid */}
      <Grid container spacing={2}>
        {Object.entries(groups).map(([group, items]) => (
          <Grid key={group} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <GroupFolderCard
              title={`${group}`}
              count={items.length}
              icon={getGroupIcon(group)}
              color={getGroupColor(group)}
              onOpen={() => handleGroupClick(group, items)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GroupedFilesView;
