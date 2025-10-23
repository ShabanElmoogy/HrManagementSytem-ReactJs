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
import PdfViewer from "./PdfViewer";
import WordViewer from "./WordViewer";
import MediaErrorView from "./MediaErrorView";

const MediaContent: React.FC<MediaContentProps> = ({
  mediaType,
  mediaUrl,
  getFileExtension,
  onError,
  onBack,
  fileName,
  onDownload,
  onRetry,
  error,
}) => {
  const { t } = useTranslation();

  if (mediaType === "unsupported" || error) {
    return (
      <MediaErrorView
        fileName={fileName}
        fileExtension={getFileExtension()}
        onDownload={onDownload}
        onBack={onBack}
        onRetry={onRetry}
        errorMessage={error || t("media.unsupportedFormat")}
      />
    );
  }

  switch (mediaType) {
    case "iframe":
      return <PdfViewer mediaUrl={mediaUrl} onError={onError} onBack={onBack} />;

    case "image":
      return <ImageViewer mediaUrl={mediaUrl} onError={onError} onBack={onBack} />;

    case "video":
      return <VideoPlayer mediaUrl={mediaUrl} onError={onError} />;

    case "audio":
      return <AudioPlayer mediaUrl={mediaUrl} onError={onError} />;

    case "excel":
      return <ExcelViewer mediaUrl={mediaUrl} onError={onError} />;

    case "word":
      return <WordViewer mediaUrl={mediaUrl} onError={onError} onBack={onBack} />;

    default:
      return null;
  }
};

export default MediaContent;