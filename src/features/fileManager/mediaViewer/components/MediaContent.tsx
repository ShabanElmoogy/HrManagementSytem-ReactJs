// cspell:words nodownload
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { MediaContentProps } from "../types/mediaViewer.type";

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
      return (
        <img
          id="media-content"
          src={mediaUrl}
          alt={t("media.image")}
          onLoad={() => {
            console.log("Image loaded successfully");
            onError("");
          }}
          onError={(e) => {
            console.error("Image error:", e);
            console.error("Image src:", mediaUrl);
            setTimeout(() => {
              onError(t("media.failedToLoadImage"));
            }, 100);
          }}
          style={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s ease" }}
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
            onError("");
          }}
          onCanPlay={() => console.log("Video can play")}
          onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            const mediaError = e.currentTarget.error;
            console.error("Video error:", mediaError);
            console.error("Video src:", mediaUrl);
            setTimeout(() => {
              onError(t("media.failedToLoadVideo", { code: mediaError?.code ?? "unknown" }));
            }, 100);
          }}
          style={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s ease" }}
        >
          {t("media.videoNotSupported")}
        </video>
      );

    case "audio":
      return (
        <Card sx={{ width: "100%", maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("media.audioPlayer")}
            </Typography>
            <audio
              id="media-content"
              src={mediaUrl}
              controls
              {...({ controlsList: "nodownload" } as any)}
              style={{ width: "100%" }}
              onError={() => {
                setTimeout(() => {
                  onError(t("media.failedToLoadAudio"));
                }, 100);
              }}
            >
              {t("media.audioNotSupported")}
            </audio>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
};

export default MediaContent;