// cspell:words nodownload
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { MediaContentProps } from "../types/mediaViewer.type";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import ImageViewer from "./ImageViewer";
import ExcelViewer from "./ExcelViewer";

const MediaContent: React.FC<MediaContentProps> = ({
  mediaType,
  mediaUrl,
  isLoading,
  getFileExtension,
  onError,
}) => {
  const { t } = useTranslation();

  if (mediaType === "unsupported") {
    return (
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <ErrorIcon color="error" fontSize="large" />
            <Typography variant="h6" color="error">
              {t("media.unsupportedFormat")}
            </Typography>
          </Box>
          <Typography color="text.secondary">
            {t("media.unsupportedExtension", { extension: getFileExtension() })}
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
          style={{ width: "100%", height: "80vh", maxWidth: "1200px" }}
          title={t("media.documentViewer")}
          onLoad={() => console.log("Iframe loaded")}
          onError={(e) => {
            console.error("Iframe error:", e);
            onError(t("media.failedToLoadDocument"));
          }}
        />
      );

    case "image":
      return <ImageViewer mediaUrl={mediaUrl} onError={onError} />;

    case "video":
      return <VideoPlayer mediaUrl={mediaUrl} onError={onError} />;

    case "audio":
      return <AudioPlayer mediaUrl={mediaUrl} onError={onError} />;

    case "excel":
      return <ExcelViewer mediaUrl={mediaUrl} onError={onError} />;

    default:
      return null;
  }
};

export default MediaContent;