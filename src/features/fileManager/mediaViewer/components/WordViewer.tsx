import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Toolbar,
  Paper,
  Tooltip,
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Download,
  Fullscreen,
  ArrowBack,
  Print,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LastPage,
  MoreVert,
} from "@mui/icons-material";
import { useSidebar } from "@/layouts/components/sidebar/sidebarContext";
import { renderAsync } from "docx-preview";

// Add CSS for docx-preview
const docxStyles = `
  .docx {
    background: white;
    padding: 20px;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
    color: #000;
  }
  .docx p {
    margin: 0 0 12px 0;
  }
  .docx table {
    border-collapse: collapse;
    width: 100%;
  }
  .docx td, .docx th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .docx-wrapper section {
    page-break-after: always;
    min-height: 100vh;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    background: white;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = docxStyles;
  document.head.appendChild(styleSheet);
}

interface WordViewerProps {
  mediaUrl: string;
  onError: (msg: string) => void;
  onBack?: () => void;
}

const WordViewer: React.FC<WordViewerProps> = ({ mediaUrl, onError, onBack }) => {
  const { open: sidebarOpen } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = "document.docx";
    link.click();
  };

  const handleFullscreen = () => {
    const element = document.getElementById("word-viewer");
    if (element?.requestFullscreen) element.requestFullscreen();
  };

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const loadDocument = async () => {
      if (!containerRef.current || !mediaUrl) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(mediaUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        await renderAsync(arrayBuffer, containerRef.current, undefined, {
          className: "docx",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: false,
          trimXmlDeclaration: true,
          useBase64URL: false,
          useMathMLPolyfill: false,
          showChanges: false,
          showComments: false,
          showInserted: true,
          showDeleted: false,
        });
        
        // Count pages after rendering - try multiple selectors
        setTimeout(() => {
          const pages = containerRef.current?.querySelectorAll('section') || 
                       containerRef.current?.querySelectorAll('.docx-wrapper section') ||
                       containerRef.current?.querySelectorAll('[data-page]');
          console.log('Found pages:', pages?.length);
          setTotalPages(pages?.length || 1);
        }, 1000);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Word document:", error);
        onError("Failed to load Word document");
        setIsLoading(false);
      }
    };
    
    loadDocument();
  }, [mediaUrl, onError]);

  // Handle page navigation
  useEffect(() => {
    if (!containerRef.current || totalPages <= 1) return;
    
    const pages = containerRef.current.querySelectorAll('.docx-wrapper section');
    pages.forEach((page, index) => {
      const pageElement = page as HTMLElement;
      if (index + 1 === currentPage) {
        pageElement.style.display = 'block';
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        pageElement.style.display = 'none';
      }
    });
  }, [currentPage, totalPages]);

  return (
    <Paper
      id="word-viewer"
      elevation={3}
      sx={{
        width: sidebarOpen ? "calc(100vw - 180px)" : "calc(100vw - 90px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 48,
          mt: 5,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: { xs: 1, sm: 2 }, width: "100%" }}>
          {/* Left Section - Back */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Back">
              <IconButton size="small" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Center Section - Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, flex: 1, justifyContent: "center" }}>
            {!isXs && (totalPages > 1 || !isLoading) && (
              <Typography variant="body2" sx={{ color: 'primary.main', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                Pages: {totalPages}
              </Typography>
            )}
            
            {/* Large screens - show all navigation */}
            {!isMd && (
              <>
                <Tooltip title="First Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage <= 1}
                    >
                      <FirstPage />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Previous Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage <= 1}
                    >
                      <NavigateBefore />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
            
            {/* Medium+ screens - show prev/next */}
            {isMd && !isSm && (
              <Tooltip title="Previous Page">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    <NavigateBefore />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            
            {/* Always show page counter */}
            <Typography variant="body2" sx={{ mx: 1, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
              {currentPage} / {totalPages}
            </Typography>
            
            {/* Medium+ screens - show prev/next */}
            {isMd && !isSm && (
              <Tooltip title="Next Page">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                  >
                    <NavigateNext />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            
            {/* Large screens - show all navigation */}
            {!isMd && (
              <>
                <Tooltip title="Next Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                    >
                      <NavigateNext />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Last Page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage >= totalPages}
                    >
                      <LastPage />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </Box>

          {/* Right Section - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Always show all actions */}
            <Tooltip title="Print">
              <IconButton size="small" onClick={handlePrint} sx={{ bgcolor: "action.hover" }}>
                <Print />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download">
              <IconButton size="small" onClick={handleDownload} sx={{ bgcolor: "action.hover" }}>
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="Fullscreen">
              <IconButton size="small" onClick={handleFullscreen} sx={{ bgcolor: "action.hover" }}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
            

          </Box>
        </Box>
        

      </Toolbar>

      {/* Word Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Typography>Loading Word document...</Typography>
          </Box>
        )}
        <div ref={containerRef} />
      </Box>
    </Paper>
  );
};

export default WordViewer;