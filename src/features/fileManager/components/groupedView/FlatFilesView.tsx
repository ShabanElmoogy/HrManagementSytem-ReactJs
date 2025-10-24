import React, { useMemo, useState } from "react";
import { Box, Grid, TextField, MenuItem } from "@mui/material";
import FileTile from "./FileTile";
import { FileItem } from "./FileTypeClassifier";
import { formatDistanceToNow } from "date-fns";

export interface FlatFilesViewProps {
  files: FileItem[];
  onOpenFile?: (file: FileItem) => void;
}

type SortKey = "name" | "size" | "updated";

const FlatFilesView: React.FC<FlatFilesViewProps> = ({ files, onOpenFile }) => {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? files.filter((f) => (f.name || "").toLowerCase().includes(q)) : files;
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case "size":
          return (a.size || 0) - (b.size || 0);
        case "updated":
          return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });
  }, [files, query, sortKey]);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField size="small" label="Search" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ width: 300 }} />
        <TextField size="small" label="Sort by" select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} sx={{ width: 180 }}>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="size">Size</MenuItem>
          <MenuItem value="updated">Last Updated</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={1.5}>
        {filtered.map((f) => (
          <Grid key={f.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <FileTile
              name={f.name}
              subtitle={[f.size ? `${(f.size / 1024).toFixed(1)} KB` : undefined, f.updatedAt ? `Updated ${formatDistanceToNow(new Date(f.updatedAt))} ago` : undefined].filter(Boolean).join(" • ")}
              onOpen={() => onOpenFile?.(f)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlatFilesView;
