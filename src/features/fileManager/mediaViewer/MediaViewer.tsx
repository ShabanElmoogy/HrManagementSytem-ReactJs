// cspell:words nodownload
import { Alert, Typography, Fade } from "@mui/material";
import MediaContent from "./components/MediaContent";
import { Container, MediaContainer } from "./components/Containers";
import { BusyOverlay } from "./components/Overlays";
import useMediaViewer from "./hooks/useMediaViewer";

const MediaViewer = () => {
  const {
    isLoading,
    error,
    mediaUrl,
    mediaType,
    getFileExtension,
    handleBack,
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
      onBack={handleBack}
      fileName={`Document.${getFileExtension()}`}
      onDownload={handleDownload}
      onRetry={() => window.location.reload()}
      error={error}
    />
  );

  return (
    <Container>
      <BusyOverlay show={isLoading} />

      {!isLoading && (
        <Fade in={true}>
          <MediaContainer>
            {renderMedia()}
          </MediaContainer>
        </Fade>
      )}
    </Container>
  );
};

export default MediaViewer;
