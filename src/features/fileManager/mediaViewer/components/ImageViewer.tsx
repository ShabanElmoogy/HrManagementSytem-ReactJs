import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Grid,
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
  Brightness6 as BrightnessIcon,
  Contrast as ContrastIcon,
  Info as InfoIcon,
  FitScreen as FitScreenIcon,
  CenterFocusStrong as CenterIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface ImageViewerProps {
  mediaUrl: string;
  onError: (message: string) => void;
}

const ImageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  position: "relative",
  backgroundColor: "#f5f5f5",
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  boxShadow: theme.shadows[8],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "400px",
  maxHeight: "80vh",
  "&:hover .controls-overlay": {
    opacity: 1,
  },
}));

const ImageWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  overflow: "auto",
  cursor: "grab",
  "&:active": {
    cursor: "grabbing",
  },
});

const StyledImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  userSelect: "none",
  transition: "transform 0.3s ease",
});

const ControlsOverlay = styled(Paper)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(1.5),
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 10,
}));

const TopControls = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(1.5),
  zIndex: 10,
}));

const InfoBox = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(1.5),
  color: "#fff",
  zIndex: 10,
}));

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const ImageViewer: React.FC<ImageViewerProps> = ({ mediaUrl, onError }) => {
  const { t } = useTranslation();
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
    <ImageContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      sx={{
        maxHeight: isFullscreen ? "100vh" : "80vh",
      }}
    >
      {/* Zoom Info - Show when zooming */}
      {showZoomInfo && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: 2,
            borderRadius: 2,
            zIndex: 15,
            opacity: showZoomInfo ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
            {zoom}%
          </Typography>
        </Box>
      )}

      {/* Image Info Panel */}
      {showImageInfo && (
        <InfoBox elevation={0}>
          <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
            Image Info
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "block" }}>
            Size: {imageInfo.width} × {imageInfo.height}px
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "block" }}>
            Zoom: {zoom}%
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "block" }}>
            Rotation: {rotation}°
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "block" }}>
            Brightness: {brightness}%
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", display: "block" }}>
            Contrast: {contrast}%
          </Typography>
        </InfoBox>
      )}

      {/* Image Wrapper */}
      <ImageWrapper>
        <StyledImage
          ref={imageRef}
          src={mediaUrl}
          alt="Viewer"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          }}
          onError={() => onError(t("media.failedToLoadImage"))}
        />
      </ImageWrapper>

      {/* Top Controls */}
      <TopControls elevation={0}>
        <Tooltip title="Image Info">
          <IconButton
            size="small"
            onClick={handleToggleInfo}
            sx={{
              color: showImageInfo ? "#1976d2" : "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("media.download")}>
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={isFullscreen ? t("media.exitFullscreen") : t("media.fullscreen")}>
          <IconButton
            size="small"
            onClick={handleFullscreen}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            {isFullscreen ? (
              <FullscreenExitIcon fontSize="small" />
            ) : (
              <FullscreenIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </TopControls>

      {/* Bottom Controls */}
      <ControlsOverlay
        elevation={0}
        sx={{
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Zoom Out */}
        <Tooltip title={`${t("media.zoomOut")} (Scroll)`}>
          <IconButton
            size="small"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                transform: "scale(1.15)",
              },
            }}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Zoom Display */}
        <Typography
          variant="caption"
          sx={{
            color: "#fff",
            minWidth: "45px",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {zoom}%
        </Typography>

        {/* Zoom In */}
        <Tooltip title={`${t("media.zoomIn")} (Scroll)`}>
          <IconButton
            size="small"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                transform: "scale(1.15)",
              },
            }}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Box sx={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* Flip Horizontal */}
        <Tooltip title="Flip Horizontal">
          <IconButton
            size="small"
            onClick={handleFlipH}
            sx={{
              color: flipH ? "#1976d2" : "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <FlipHIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Flip Vertical */}
        <Tooltip title="Flip Vertical">
          <IconButton
            size="small"
            onClick={handleFlipV}
            sx={{
              color: flipV ? "#1976d2" : "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <FlipVIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Rotate */}
        <Tooltip title={`Rotate 90°`}>
          <IconButton
            size="small"
            onClick={handleRotate}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <RotateRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Box sx={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* Brightness Down */}
        <Tooltip title="Brightness -">
          <IconButton
            size="small"
            onClick={() => adjustBrightness(-10)}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>B-</Typography>
          </IconButton>
        </Tooltip>

        {/* Brightness Up */}
        <Tooltip title="Brightness +">
          <IconButton
            size="small"
            onClick={() => adjustBrightness(10)}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>B+</Typography>
          </IconButton>
        </Tooltip>

        {/* Contrast Down */}
        <Tooltip title="Contrast -">
          <IconButton
            size="small"
            onClick={() => adjustContrast(-10)}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>C-</Typography>
          </IconButton>
        </Tooltip>

        {/* Contrast Up */}
        <Tooltip title="Contrast +">
          <IconButton
            size="small"
            onClick={() => adjustContrast(10)}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>C+</Typography>
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Box sx={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* Fit to Screen */}
        <Tooltip title="Fit to Screen">
          <IconButton
            size="small"
            onClick={handleFitToScreen}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <FitScreenIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Reset */}
        <Tooltip title="Reset All">
          <IconButton
            size="small"
            onClick={handleReset}
            sx={{
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
              },
            }}
          >
            <ResetIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ControlsOverlay>
    </ImageContainer>
  );
};

export default ImageViewer;
