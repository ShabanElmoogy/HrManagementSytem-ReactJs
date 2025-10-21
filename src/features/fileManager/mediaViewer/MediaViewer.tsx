// cspell:words nodownload
import { Alert, Typography, Fade } from "@mui/material";
import MediaContent from "./components/MediaContent";
import { Container, MediaContainer } from "./components/Containers";
import { BackOverlayButton, ViewerControls, BusyOverlay } from "./components/Overlays";
import useMediaViewer from "./hooks/useMediaViewer";

const MediaViewer = () => {
  const {
    isLoading,
    error,
    mediaUrl,
    isFullscreen,
    mediaType,
    getFileExtension,
    handleBack,
    handleFullscreen,
    handleDownload,
    setError,
  } = useMediaViewer();

  
  const renderMedia = () => (
    <MediaContent
      mediaType={mediaType}
      mediaUrl={mediaUrl}
      isLoading={isLoading}
      getFileExtension={getFileExtension}
      onError={(msg) => setError(msg || null)}
    />
  );

  return (
    <Container>
      <BackOverlayButton onBack={handleBack} />
      <BusyOverlay show={isLoading} />

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
            <ViewerControls
              onDownload={handleDownload}
              onToggleFullscreen={handleFullscreen}
              showFullscreen={mediaType !== "audio"}
              isFullscreen={isFullscreen}
            />
            {renderMedia()}
          </MediaContainer>
        </Fade>
      )}
    </Container>
  );
};

export default MediaViewer;
