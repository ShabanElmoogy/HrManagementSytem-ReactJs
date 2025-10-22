import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import {
  FileDownload as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface ExcelViewerProps {
  mediaUrl: string;
  onError: (message: string) => void;
}

const ViewerContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  boxShadow: theme.shadows[8],
}));

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  "& .MuiTable-root": {
    minWidth: 650,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  transition: "background-color 0.2s ease",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "0.875rem",
  borderColor: theme.palette.divider,
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
}));

const ExcelViewer: React.FC<ExcelViewerProps> = ({ mediaUrl, onError }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadExcelFile();
  }, [mediaUrl]);

  useEffect(() => {
    filterData();
  }, [sheetData, currentSheetIndex, searchTerm]);

  const loadExcelFile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(mediaUrl);
      const arrayBuffer = await response.arrayBuffer();

      // Dynamically import xlsx library
      const XLSX = await import("xlsx");

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheets = workbook.SheetNames;
      setSheetNames(sheets);

      // Load all sheets
      const allSheets: any[][] = [];
      sheets.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        allSheets.push(data as any[]);
      });

      setSheetData(allSheets);
      setIsLoading(false);
      onError("");
    } catch (error) {
      console.error("Error loading Excel file:", error);
      onError(t("media.failedToLoadExcel") || "Failed to load Excel file");
      setIsLoading(false);
    }
  };

  const filterData = () => {
    if (sheetData.length === 0) return;

    const currentData = sheetData[currentSheetIndex];
    if (!searchTerm.trim()) {
      setFilteredData(currentData);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = currentData.filter((row) =>
      row.some((cell) =>
        String(cell || "").toLowerCase().includes(searchLower)
      )
    );

    setFilteredData(filtered);
  };

  const handlePrevSheet = () => {
    setCurrentSheetIndex((prev) => Math.max(0, prev - 1));
    setSearchTerm("");
  };

  const handleNextSheet = () => {
    setCurrentSheetIndex((prev) =>
      Math.min(sheetNames.length - 1, prev + 1)
    );
    setSearchTerm("");
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = "spreadsheet.xlsx";
    link.click();
  };

  const currentData = sheetData[currentSheetIndex] || [];
  const headers = currentData[0] || [];
  const rows = filteredData.slice(1);

  if (isLoading) {
    return (
      <ViewerContainer
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </ViewerContainer>
    );
  }

  return (
    <ViewerContainer ref={containerRef} sx={{ maxHeight: isFullscreen ? "100vh" : "80vh" }}>
      {/* Toolbar */}
      <ToolbarContainer elevation={0}>
        <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
          {/* Sheet Navigation */}
          <Grid item xs={12} sm="auto">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Previous Sheet">
                <span>
                  <IconButton
                    size="small"
                    onClick={handlePrevSheet}
                    disabled={currentSheetIndex === 0}
                  >
                    <PrevIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <InfoChip
                label={`${sheetNames[currentSheetIndex]} (${currentSheetIndex + 1}/${sheetNames.length})`}
                size="small"
              />

              <Tooltip title="Next Sheet">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleNextSheet}
                    disabled={currentSheetIndex === sheetNames.length - 1}
                  >
                    <NextIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Grid>

          {/* Search */}
          <Grid item xs={12} sm>
            <TextField
              size="small"
              placeholder="Search in sheet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ width: "100%", maxWidth: 300 }}
            />
          </Grid>

          {/* Info */}
          <Grid item xs={12} sm="auto">
            <Typography variant="caption" color="text.secondary">
              {rows.length} rows
            </Typography>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm="auto">
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title={t("media.download")}>
                <IconButton size="small" onClick={handleDownload}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  isFullscreen
                    ? t("media.exitFullscreen")
                    : t("media.fullscreen")
                }
              >
                <IconButton size="small" onClick={handleFullscreen}>
                  {isFullscreen ? (
                    <FullscreenExitIcon fontSize="small" />
                  ) : (
                    <FullscreenIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </ToolbarContainer>

      {/* Table */}
      <StyledTableContainer>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              {headers.map((header, index) => (
                <StyledTableCell key={index} align="left">
                  {header || `Column ${index + 1}`}
                </StyledTableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {headers.map((_, colIndex) => (
                    <StyledTableCell key={colIndex} align="left">
                      {row[colIndex] || "-"}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={headers.length} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    {searchTerm ? "No results found" : "No data available"}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </ViewerContainer>
  );
};

export default ExcelViewer;
