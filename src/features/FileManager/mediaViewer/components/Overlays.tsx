import React from "react";
import { Box, Tooltip, IconButton, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FullscreenExit as FullscreenExitIcon,
  Fullscreen as FullscreenIcon,
  FileDownload as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

export const ControlsOverlay = styled(Box)(({ theme }) => ({
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

export const BackButtonOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows[2],
}));

export const LoadingOverlay = styled(Box)({
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

export const BackOverlayButton: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";

  return (
    <BackButtonOverlay>
      <Tooltip title={t("media.backToFiles")}>
        <IconButton onClick={onBack} size="small" color="primary">
          {isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
        </IconButton>
      </Tooltip>
    </BackButtonOverlay>
  );
};

export const ViewerControls: React.FC<{
  onDownload: () => void;
  onToggleFullscreen: () => void;
  showFullscreen: boolean;
  isFullscreen: boolean;
}> = ({ onDownload, onToggleFullscreen, showFullscreen, isFullscreen }) => {
  const { t } = useTranslation();

  return (
    <ControlsOverlay>
      <Tooltip title={t("media.download")}>
        <IconButton onClick={onDownload} size="small">
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      {showFullscreen && (
        <Tooltip
          title={
            isFullscreen ? t("media.exitFullscreen") : t("media.fullscreen")
          }
        >
          <IconButton onClick={onToggleFullscreen} size="small">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      )}
    </ControlsOverlay>
  );
};

export const BusyOverlay: React.FC<{ show: boolean }> = ({ show }) =>
  show ? (
    <LoadingOverlay>
      <CircularProgress size={60} />
    </LoadingOverlay>
  ) : null;
