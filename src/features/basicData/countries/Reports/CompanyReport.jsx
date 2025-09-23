import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

const CompanyReport = () => {
  const [reportRequest, setReportRequest] = useState({
    nameAr: "",
    nameEn: "",
  });
  const [reportApiBaseUrl] = useState(localStorage.getItem("reportApiUrl") || "https://localhost:44341/");
  const [reportUrl, setReportUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();
  const lang = theme.direction === "rtl" ? "ar" : "en";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Constants
  const SIDEBAR_WIDTH = 280;
  const TOP_OFFSET = isMobile ? 60 : 120;
  const MARGIN_BETWEEN = 8;
  const MOBILE_HEADER_HEIGHT = 48;

  // Removed auto-search on form field changes
  // Only generate report URL when explicitly searching

  // Close sidebar automatically on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    handleSearch();
  }, [lang]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const generateReportUrl = (request) => {
    const reportParams = {
      ReportPath: "Reports",
      ReportFileName: "Company",
      ExportFilename: "Company",
      LogoName: "Logo1",
      Lang: lang,
      NameAr: request.nameAr,
      NameEn: request.nameEn,
    };

    const queryString = Object.entries(reportParams)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return `${reportApiBaseUrl}report/generate?${queryString}&rc:Toolbar=true`;
  };

  const handleSearch = () => {
    setLoading(true);
    const url = generateReportUrl(reportRequest);
    setReportUrl(url);

    // Simulating API call delay
    setTimeout(() => {
      setLoading(false);
      // Close sidebar on mobile after search
      if (isMobile) {
        setSidebarOpen(false);
      }
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: `calc(100vh - ${TOP_OFFSET}px)`,
        width: "100%",
        position: "relative",
      }}
    >
      {/* Mobile Header - Always visible */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            height: MOBILE_HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#1976d2",
            color: "white",
            cursor: "pointer",
            zIndex: 11,
          }}
          onClick={toggleSidebar}
        >
          <Box sx={{ flexGrow: 1, pl: 2 }}>Search Options</Box>
          <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
            {sidebarOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>
      )}

      {/* Sidebar - Full width on mobile, fixed width on desktop */}
      <Paper
        elevation={3}
        sx={{
          width: isMobile ? "100%" : sidebarOpen ? SIDEBAR_WIDTH : 0,
          // For mobile: Fixed height when open, 0 when closed
          height: isMobile ? (sidebarOpen ? "auto" : "0px") : "100%",
          display: isMobile && !sidebarOpen ? "none" : "flex", // Completely hide when closed on mobile
          transition: isMobile
            ? "height 0.3s ease-in-out"
            : "width 0.3s ease-in-out",
          overflow: "hidden",
          borderRadius: 0,
          position: "relative",
          zIndex: 10,
          flexDirection: "column",
          marginRight: isMobile ? 0 : sidebarOpen ? MARGIN_BETWEEN : 0,
        }}
      >
        {/* Sidebar Content */}
        <Box
          sx={{
            width: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Company Name (Arabic)"
            value={reportRequest.nameAr}
            onChange={(e) =>
              setReportRequest({ ...reportRequest, nameAr: e.target.value })
            }
            fullWidth
            variant="outlined"
            size="small"
          />

          <TextField
            label="Company Name (English)"
            value={reportRequest.nameEn}
            onChange={(e) =>
              setReportRequest({ ...reportRequest, nameEn: e.target.value })
            }
            fullWidth
            variant="outlined"
            size="small"
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<Search />}
            fullWidth
            sx={{ mt: 1 }}
          >
            SEARCH
          </Button>
        </Box>
      </Paper>

      {/* Desktop Toggle Button - outside sidebar, moved to middle of the sidebar */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            left: sidebarOpen ? SIDEBAR_WIDTH : 0,
            top: "50%", // Positioning in the middle of the sidebar
            transform: "translateY(-50%)",
            zIndex: 20,
            transition: "left 0.3s ease-in-out",
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            size="medium"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              boxShadow: 2,
              borderRadius: sidebarOpen ? "0 4px 4px 0" : "4px 0 0 4px",
            }}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      )}

      {/* Content Area with minimal margin on mobile */}
      <Box
        sx={{
          flexGrow: 1,
          height: isMobile
            ? `calc(100% - ${MOBILE_HEADER_HEIGHT}px - ${
                sidebarOpen ? "auto" : "0px"
              })`
            : "100%",
          position: "relative",
          zIndex: 5,
          overflow: "hidden",
          marginTop: isMobile ? MARGIN_BETWEEN : 0,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <iframe
            key={reportUrl}
            src={reportUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            title="Report Viewer"
            allowFullScreen
          />
        )}
      </Box>
    </Box>
  );
};

export default CompanyReport;
