// components/MediaViewer.jsx
import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  FullscreenExit as FullscreenExitIcon,
  Fullscreen as FullscreenIcon,
  FileDownload as DownloadIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { fileService } from "@/shared/services/fileService";

const Container = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 120px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  position: "relative",
  padding: theme.spacing(2),
}));

const MediaContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  maxWidth: "100%",
  maxHeight: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& iframe": {
    border: "none",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
  },
  "& img": {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    maxWidth: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
  },
  "& video": {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    maxWidth: "100%",
    maxHeight: "90vh",
  },
  "& audio": {
    width: "100%",
    maxWidth: "600px",
  },
}));

const ControlsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(1),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows[2],
}));

const BackButtonOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows[2],
}));

const LoadingOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 20,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

const MediaViewer = () => {
  const { id, fileExtension, storedFileName, fileName } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allowedIframeExtensions = ["pdf"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"];
  const audioExtensions = ["mp3", "wav", "ogg", "m4a"];

  const getFileExtension = () => {
    // Remove the dot from the extension
    return fileExtension?.substring(1).toLowerCase() || "";
  };

  const getMediaType = () => {
    const ext = getFileExtension();

    if (allowedIframeExtensions.includes(ext)) {
      return "iframe";
    }
    if (imageExtensions.includes(ext)) {
      return "image";
    }
    if (videoExtensions.includes(ext)) {
      return "video";
    }
    if (audioExtensions.includes(ext)) {
      return "audio";
    }

    return "unsupported";
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const loadMedia = async () => {
      try {
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        if (!id || !fileExtension) {
          if (isMounted) {
            setError("Invalid parameters - Missing ID or file extension");
          }
          return;
        }

        // Add delay to prevent rapid navigation issues
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 300);
        });

        if (!isMounted) return;

        const streamUrl = `https://localhost:7037/api/v1/Files/Stream/${id}`;
        console.log("streamUrl", streamUrl);

        if (isMounted) {
          setMediaUrl(streamUrl);
        }
      } catch (err) {
        console.error("Error loading media:", err);
        if (isMounted) {
          setError(err.message || "Error loading media");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMedia();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id, fileExtension]);

  const handleBack = () => {
    // Navigate back to FilesGrid - update this path to match your route
    navigate(-1); // Go back to previous page
  };

  const handleFullscreen = () => {
    const element = document.getElementById("media-content");

    if (!document.fullscreenElement && element) {
      element.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleDownload = async () => {
    if (!storedFileName) return;
    console.log("storedFileName", storedFileName);
    try {
      // Use the fileService to trigger download
      const response = await fileService.downloadFile(
        `api/v1/Files/Download`,
        storedFileName,
        fileName
      );

      if (!response.success) {
        throw new Error("Download failed");
      }
    } catch (err) {
      console.error("Download error:", err);
      setError("Download failed");
    }
  };

  const renderMedia = () => {
    const mediaType = getMediaType();

    if (mediaType === "unsupported") {
      return (
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <ErrorIcon color="error" fontSize="large" />
              <Typography variant="h6" color="error">
                Unsupported File Format
              </Typography>
            </Box>
            <Typography color="text.secondary">
              File extension '{getFileExtension()}' is not supported for preview
            </Typography>
          </CardContent>
        </Card>
      );
    }

    switch (mediaType) {
      case "iframe":
        return (
          <iframe
            id="media-content"
            src={mediaUrl}
            style={{
              width: "100%",
              height: "80vh",
              maxWidth: "1200px",
            }}
            title="Document Viewer"
            onLoad={() => console.log("Iframe loaded")}
            onError={(e) => {
              console.error("Iframe error:", e);
              setError("Failed to load document");
            }}
          />
        );

      case "image":
        return (
          <img
            id="media-content"
            src={mediaUrl}
            alt="Image"
            onLoad={() => {
              console.log("Image loaded successfully");
              setError(null); // Clear any previous errors
            }}
            onError={(e) => {
              console.error("Image error:", e);
              console.error("Image src:", mediaUrl);
              setTimeout(() => {
                setError(
                  "Failed to load image. Please check if the file exists and is accessible."
                );
              }, 100);
            }}
            style={{
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
        );

      case "video":
        return (
          <video
            key={`${mediaUrl}-${Date.now()}`} // Force reload with timestamp
            id="media-content"
            src={mediaUrl}
            controls
            controlsList="nodownload"
            preload="metadata"
            onLoadStart={() => console.log("Video load started")}
            onLoadedMetadata={() => {
              console.log("Video metadata loaded");
              setError(null); // Clear any previous errors
            }}
            onCanPlay={() => console.log("Video can play")}
            onError={(e) => {
              console.error("Video error:", e);
              console.error("Video error details:", e.target.error);
              console.error("Video src:", mediaUrl);
              setTimeout(() => {
                setError(
                  `Failed to load video. Error code: ${
                    e.target.error?.code || "unknown"
                  } - ${
                    e.target.error?.message ||
                    "The file might be corrupted or in an unsupported format."
                  }`
                );
              }, 100);
            }}
            style={{
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
        return (
          <Card sx={{ width: "100%", maxWidth: 600 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Audio Player
              </Typography>
              <audio
                id="media-content"
                src={mediaUrl}
                controls
                controlsList="nodownload"
                style={{ width: "100%" }}
                onError={(e) => {
                  console.error("Audio error:", e);
                  setTimeout(() => {
                    setError("Failed to load audio");
                  }, 100);
                }}
              >
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Back Button - Always visible at top-left */}
      <BackButtonOverlay>
        <Tooltip title="Back to Files">
          <IconButton onClick={handleBack} size="small" color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </BackButtonOverlay>

      {isLoading && (
        <LoadingOverlay>
          <CircularProgress size={60} />
        </LoadingOverlay>
      )}

      {error && !isLoading && (
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Error
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      {!error && !isLoading && mediaUrl && (
        <Fade in={true}>
          <MediaContainer>
            {/* Control Buttons - Right Side */}
            <ControlsOverlay>
              <Tooltip title="Download">
                <IconButton onClick={handleDownload} size="small">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              {getMediaType() !== "audio" && (
                <Tooltip
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  <IconButton onClick={handleFullscreen} size="small">
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </ControlsOverlay>

            {renderMedia()}
          </MediaContainer>
        </Fade>
      )}
    </Container>
  );
};

export default MediaViewer;
