import React from "react";
import { Box, Grid, IconButton, Paper, TextField, Tooltip, Typography, Chip, Select, MenuItem, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FileDownload as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Search as SearchIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  ArrowBack as BackIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const ToolbarContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
}));

export interface ExcelToolbarProps {
  sheetNames: string[];
  currentSheetIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSheetSelect: (index: number) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  rowsCount: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onBack?: () => void;
  onPrint?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onInfo?: () => void;
}

const ExcelToolbar: React.FC<ExcelToolbarProps> = ({
  sheetNames,
  currentSheetIndex,
  onPrev,
  onNext,
  onSheetSelect,
  searchTerm,
  onSearch,
  rowsCount,
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onBack,
  onPrint,
  onRefresh,
  onExport,
  onInfo,
}) => {
  const { t } = useTranslation();
  return (
    <ToolbarContainer elevation={0}>
      <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
        {/* Left Section - Navigation */}
        <Grid size={{ xs: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {onBack && (
              <Tooltip title="Back">
                <IconButton size="small" onClick={onBack}>
                  <BackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Previous Sheet">
              <span>
                <IconButton size="small" onClick={onPrev} disabled={currentSheetIndex === 0}>
                  <PrevIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Next Sheet">
              <span>
                <IconButton
                  size="small"
                  onClick={onNext}
                  disabled={currentSheetIndex === sheetNames.length - 1}
                >
                  <NextIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Grid>

        {/* Center Section - Sheet Select & Search */}
        <Grid size={{ xs: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={currentSheetIndex}
                onChange={(e) => onSheetSelect(Number(e.target.value))}
                displayEmpty
              >
                {sheetNames.map((name, index) => (
                  <MenuItem key={index} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Search in sheet..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
              sx={{ width: "100%", maxWidth: 200 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {rowsCount} rows
            </Typography>
          </Box>
        </Grid>

        {/* Right Section - Actions */}
        <Grid size={{ xs: 4 }}>
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={onRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onPrint && (
              <Tooltip title="Print">
                <IconButton size="small" onClick={onPrint}>
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onExport && (
              <Tooltip title="Export">
                <IconButton size="small" onClick={onExport}>
                  <ExportIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Download">
              <IconButton size="small" onClick={onDownload}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {onInfo && (
              <Tooltip title="Info">
                <IconButton size="small" onClick={onInfo}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton size="small" onClick={onToggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </ToolbarContainer>
  );
};

export default ExcelToolbar;
