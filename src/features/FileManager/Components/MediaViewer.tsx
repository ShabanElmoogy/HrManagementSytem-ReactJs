// cspell:words nodownload
import { useState, useEffect, useRef } from "react";
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

// Types
type MediaType = "iframe" | "image" | "video" | "audio" | "unsupported";


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

const allowedIframeExtensions = ["pdf"] as const;
const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
] as const;
const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"] as const;
const audioExtensions = ["mp3", "wav", "ogg", "m4a"] as const;

const MediaViewer = () => {
  const { id, fileExtension, storedFileName, fileName } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Track object URL cleanup to avoid leaks
  const cleanupRef = useRef<null | (() => void)>(null);

  const getFileExtension = (): string => {
    return fileExtension?.substring(1).toLowerCase() || "";
  };

  const getMediaType = (): MediaType => {
    const ext = getFileExtension();

    if (allowedIframeExtensions.includes(ext as typeof allowedIframeExtensions[number])) {
      return "iframe";
    }
    if (imageExtensions.includes(ext as typeof imageExtensions[number])) {
      return "image";
    }
    if (videoExtensions.includes(ext as typeof videoExtensions[number])) {
      return "video";
    }
    if (audioExtensions.includes(ext as typeof audioExtensions[number])) {
      return "audio";
    }

    return "unsupported";
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

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

        // Debounce rapid navigation
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 300);
        });

        if (!isMounted) return;

        // Use blob URL to support secured endpoints and avoid CORS/auth issues
  
        const streamEndpoint = `api/v1/Files/Stream`;
        const res = await fileService.downloadStream(streamEndpoint, id);

        if (!isMounted) return;

        if (res.success) {
          // cleanup previous blob url if exists
          if (cleanupRef.current) {
            cleanupRef.current();
          }
          cleanupRef.current = res.data.cleanup;
          setMediaUrl(res.data.url);
        } else {
          setError("Failed to load media stream");
        }
      } catch (err: unknown) {
        console.error("Error loading media:", err);
        const message = err instanceof Error ? err.message : "Error loading media";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [id, fileExtension]);

  const handleBack = () => {
    navigate(-1);
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
    try {
      const response = await fileService.downloadFile(
        `api/v1/Files/Download`,
        storedFileName,
        fileName || storedFileName
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
              setError(null);
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
            key={`${mediaUrl}-${Date.now()}`}
            id="media-content"
            src={mediaUrl}
            controls
            {...({ controlsList: "nodownload" } as any)}
            preload="metadata"
            onLoadStart={() => console.log("Video load started")}
            onLoadedMetadata={() => {
              console.log("Video metadata loaded");
              setError(null);
            }}
            onCanPlay={() => console.log("Video can play")}
            onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
              const mediaError = e.currentTarget.error;
              console.error("Video error:", mediaError);
              console.error("Video src:", mediaUrl);
              setTimeout(() => {
                setError(
                  `Failed to load video. Error code: ${mediaError?.code ?? "unknown"}`
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
                {...({ controlsList: "nodownload" } as any)}
                style={{ width: "100%" }}
                onError={() => {
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
            <ControlsOverlay>
              <Tooltip title="Download">
                <IconButton onClick={handleDownload} size="small">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              {getMediaType() !== "audio" && (
                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
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
