import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  Paper,
  Tooltip,
  TextField,
  Divider,
  Grid,
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  Download,
  Fullscreen,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage,
  FitScreen,
  ArrowBack,
  Print,
  Save,
} from "@mui/icons-material";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSidebar } from "@/layouts/components/sidebar/sidebarContext";

// ✅ إعداد الـ worker بشكل صحيح لمشاريع React
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  mediaUrl: string;
  onError: (msg: string) => void;
  onBack?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ mediaUrl, onError, onBack }) => {
  const { open: sidebarOpen } = useSidebar();
  const [scale, setScale] = useState(1.25);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageInput, setPageInput] = useState("1");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput("1");
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    onError("Failed to load PDF");
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleFitToWidth = () => setScale(1.0);

  const handlePrevPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    setPageInput(newPage.toString());
  };

  const handleNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages);
    setPageNumber(newPage);
    setPageInput(newPage.toString());
  };

  const handleFirstPage = () => {
    setPageNumber(1);
    setPageInput("1");
  };

  const handleLastPage = () => {
    setPageNumber(numPages);
    setPageInput(numPages.toString());
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const page = parseInt(pageInput);
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);
      } else {
        setPageInput(pageNumber.toString());
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = "document.pdf";
    link.click();
  };

  const handleFullscreen = () => {
    const element = document.getElementById("pdf-viewer");
    if (element?.requestFullscreen) element.requestFullscreen();
  };

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <Paper
      id="pdf-viewer"
      elevation={3}
      sx={{
        width: sidebarOpen ? "calc(100vw - 265px)" : "calc(100vw - 90px)",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* ✅ Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: "background.paper",
          borderBottom: "3px solid",
          borderColor: "divider",
          minHeight: 48,
          px: 2,
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Grid size={{ xs: 4 }}>
            <Tooltip title="Back">
              <IconButton size="small" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid
            size={{ xs: 4 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="First Page">
              <span>
                <IconButton
                  size="small"
                  onClick={handleFirstPage}
                  disabled={pageNumber <= 1}
                >
                  <FirstPage />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Previous Page">
              <span>
                <IconButton
                  size="small"
                  onClick={handlePrevPage}
                  disabled={pageNumber <= 1}
                >
                  <NavigateBefore />
                </IconButton>
              </span>
            </Tooltip>

            <TextField
              size="small"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputSubmit}
              sx={{ width: 60, mx: 1 }}
              inputProps={{ style: { textAlign: "center" } }}
            />

            <Typography variant="body2">/ {numPages || "—"}</Typography>

            <Tooltip title="Next Page">
              <span>
                <IconButton
                  size="small"
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                >
                  <NavigateNext />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Last Page">
              <span>
                <IconButton
                  size="small"
                  onClick={handleLastPage}
                  disabled={pageNumber >= numPages}
                >
                  <LastPage />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>

          <Grid
            size={{ xs: 4 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.5,
              px: 1,
            }}
          >
            <Typography variant="body2">
              Zoom: {Math.round(scale * 100)}%
            </Typography>

            <Tooltip title="Zoom Out">
              <span>
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Fit to Width">
              <IconButton size="small" onClick={handleFitToWidth}>
                <FitScreen />
              </IconButton>
            </Tooltip>

            <Tooltip title="Zoom In">
              <span>
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                >
                  <ZoomIn />
                </IconButton>
              </span>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Print">
              <IconButton size="small" onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>

            <Tooltip title="Save">
              <IconButton size="small" onClick={handleSave}>
                <Save />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download PDF">
              <IconButton size="small" onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="Fullscreen">
              <IconButton size="small" onClick={handleFullscreen}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>

      {/* ✅ PDF Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: "background.default",
          p: 4,
        }}
      >
        <Document
          file={mediaUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<Typography>Loading PDF...</Typography>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={<Typography>Loading page...</Typography>}
          />
        </Document>
      </Box>
    </Paper>
  );
};

export default PdfViewer;
