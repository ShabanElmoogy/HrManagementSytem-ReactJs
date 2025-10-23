import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Grid,
  Toolbar,
} from "@mui/material";
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FileDownload as DownloadIcon,
  RotateRight as RotateRightIcon,
  Refresh as ResetIcon,
  Flip as FlipHIcon,
  SwapVert as FlipVIcon,
  ArrowBack,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSidebar } from "@/layouts/components/sidebar/sidebarContext";

interface ImageViewerProps {
  mediaUrl: string;
  onError: (message: string) => void;
  onBack?: () => void;
}



const ImageViewer: React.FC<ImageViewerProps> = ({ mediaUrl, onError, onBack }) => {
  const { t } = useTranslation();
  const { open: sidebarOpen } = useSidebar();
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0, size: 0 });
  const [showControls, setShowControls] = useState(true);
  const [showZoomInfo, setShowZoomInfo] = useState(false);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const zoomInfoTimeoutRef = useRef<NodeJS.Timeout>();

  const MIN_ZOOM = 50;
  const MAX_ZOOM = 300;
  const ZOOM_STEP = 10;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: 0,
      });
      onError("");
    };
    img.onerror = () => {
      onError(t("media.failedToLoadImage"));
    };
    img.src = mediaUrl;
  }, [mediaUrl, onError, t]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    showZoomInfoBriefly();
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    showZoomInfoBriefly();
  };

  const showZoomInfoBriefly = () => {
    setShowZoomInfo(true);
    if (zoomInfoTimeoutRef.current) {
      clearTimeout(zoomInfoTimeoutRef.current);
    }
    zoomInfoTimeoutRef.current = setTimeout(() => {
      setShowZoomInfo(false);
    }, 1500);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  const handleFlipH = () => {
    setFlipH(prev => !prev);
  };

  const handleFlipV = () => {
    setFlipV(prev => !prev);
  };

  const handleFitToScreen = () => {
    setZoom(100);
    setRotation(0);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  const handleToggleInfo = () => {
    setShowImageInfo(prev => !prev);
  };

  const adjustBrightness = (delta: number) => {
    setBrightness(prev => Math.max(50, Math.min(150, prev + delta)));
  };

  const adjustContrast = (delta: number) => {
    setContrast(prev => Math.max(50, Math.min(150, prev + delta)));
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
    link.download = "image.jpg";
    link.click();
  };

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 100) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (!isDragging || !containerRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    containerRef.current.scrollLeft -= deltaX;
    containerRef.current.scrollTop -= deltaY;

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      handleZoomOut();
    } else {
      handleZoomIn();
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Paper
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
        <Grid container sx={{ width: "100%", alignItems: "center" }}>
          <Grid size={{ xs: 4 }} sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip title="Back">
              <IconButton size="small" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 0.5, 
              bgcolor: "action.hover", 
              borderRadius: 2, 
              px: 1, 
              py: 0.5 
            }}>
              <Tooltip title="Zoom Out">
                <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              
              <Typography variant="body2" sx={{ minWidth: 50, textAlign: "center", fontWeight: 600 }}>
                {zoom}%
              </Typography>
              
              <Tooltip title="Zoom In">
                <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Tooltip title="Rotate 90°">
              <IconButton size="small" onClick={handleRotate} sx={{ bgcolor: "action.hover" }}>
                <RotateRightIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset All">
              <IconButton size="small" onClick={handleReset} sx={{ bgcolor: "action.hover" }}>
                <ResetIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Tooltip title="Flip Horizontal">
                <IconButton 
                  size="small" 
                  onClick={handleFlipH} 
                  sx={{ 
                    bgcolor: flipH ? "primary.main" : "action.hover",
                    color: flipH ? "primary.contrastText" : "inherit",
                    "&:hover": { bgcolor: flipH ? "primary.dark" : "action.selected" }
                  }}
                >
                  <FlipHIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Flip Vertical">
                <IconButton 
                  size="small" 
                  onClick={handleFlipV} 
                  sx={{ 
                    bgcolor: flipV ? "primary.main" : "action.hover",
                    color: flipV ? "primary.contrastText" : "inherit",
                    "&:hover": { bgcolor: flipV ? "primary.dark" : "action.selected" }
                  }}
                >
                  <FlipVIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Tooltip title="Brightness -">
                <IconButton 
                  size="small" 
                  onClick={() => adjustBrightness(-10)}
                  sx={{ bgcolor: "action.hover", minWidth: 32 }}
                >
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>B-</Typography>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Brightness +">
                <IconButton 
                  size="small" 
                  onClick={() => adjustBrightness(10)}
                  sx={{ bgcolor: "action.hover", minWidth: 32 }}
                >
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>B+</Typography>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Contrast -">
                <IconButton 
                  size="small" 
                  onClick={() => adjustContrast(-10)}
                  sx={{ bgcolor: "action.hover", minWidth: 32 }}
                >
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>C-</Typography>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Contrast +">
                <IconButton 
                  size="small" 
                  onClick={() => adjustContrast(10)}
                  sx={{ bgcolor: "action.hover", minWidth: 32 }}
                >
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>C+</Typography>
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Tooltip title="Download">
                <IconButton size="small" onClick={handleDownload} sx={{ bgcolor: "action.hover" }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton size="small" onClick={handleFullscreen} sx={{ bgcolor: "action.hover" }}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>

      {/* Image Content */}
      <Box
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          position: "relative",
          cursor: zoom > 100 ? "grab" : "default",
          "&:active": {
            cursor: zoom > 100 ? "grabbing" : "default",
          },
        }}
      >
        <img
          ref={imageRef}
          src={mediaUrl}
          alt="Viewer"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            userSelect: "none",
            transform: `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            transition: "transform 0.3s ease",
          }}
          onError={() => onError(t("media.failedToLoadImage"))}
        />
      </Box>
    </Paper>
  );
};

export default ImageViewer;
