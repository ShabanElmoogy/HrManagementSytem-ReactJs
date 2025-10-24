import React, { useRef } from "react";
import { CircularProgress, Paper } from "@mui/material";
import { useSidebar } from "@/layouts/components/sidebar/sidebarContext";
import ExcelToolbar from "./excel/ExcelToolbar";
import ExcelTable from "./excel/ExcelTable";
import { useExcelFilter } from "./excel/useExcelFilter";
import { useExcelViewer } from "./excel/useExcelViewer";

interface ExcelViewerProps {
  mediaUrl: string;
  onError: (message: string) => void;
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({ mediaUrl, onError }) => {
  const { open: sidebarOpen } = useSidebar();
  const {
    isLoading,
    isFullscreen,
    sheetData,
    sheetNames,
    currentSheetIndex,
    searchTerm,
    setSearchTerm,
    handlePrevSheet,
    handleNextSheet,
    handleSheetSelect,
    handleFullscreen,
    handleDownload,
  } = useExcelViewer(mediaUrl, onError);
  
  const filteredData = useExcelFilter(sheetData, currentSheetIndex, searchTerm);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentData = sheetData[currentSheetIndex] || [];
  const headers = currentData[0] || [];
  const rows = filteredData.slice(1);

  if (isLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          width: sidebarOpen ? "calc(100vw - 280px)" : "calc(100vw - 90px)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          mt: 8,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper
      ref={containerRef}
      elevation={3}
      sx={{
        width: sidebarOpen ? "calc(100vw - 180px)" : "calc(100vw - 90px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        mt: 8,
      }}
    >
      <ExcelToolbar
        sheetNames={sheetNames}
        currentSheetIndex={currentSheetIndex}
        onPrev={handlePrevSheet}
        onNext={handleNextSheet}
        onSheetSelect={handleSheetSelect}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        rowsCount={rows.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => handleFullscreen(containerRef)}
        onDownload={handleDownload}
      />

      <ExcelTable headers={headers} rows={rows} searchTerm={searchTerm} />
    </Paper>
  );
};

export default ExcelViewer;
