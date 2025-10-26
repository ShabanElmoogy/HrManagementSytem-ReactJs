import React from 'react';
import { Box, Grid, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import BackButton from '@/shared/components/common/BackButton';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  RotateRight as RotateRightIcon,
  Refresh as ResetIcon,
  Flip as FlipHIcon,
  SwapVert as FlipVIcon,
  MoreVert as MoreVertIcon,
  FileDownload as DownloadIcon,
} from '@mui/icons-material';

interface ImageToolbarProps {
  onBack: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
  flipH: boolean;
  flipV: boolean;
  onFlipH: () => void;
  onFlipV: () => void;
  isFullscreen: boolean;
  onFullscreen: () => void;
  onOpenMenu: (e: React.MouseEvent<HTMLElement>) => void;
  onDownload: () => void;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({ onBack, zoom, onZoomIn, onZoomOut, onRotate, onReset, flipH, flipV, onFlipH, onFlipV, isFullscreen, onFullscreen, onOpenMenu, onDownload }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: 48,
        mt: 5,
        px: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container sx={{ width: '100%', alignItems: 'center' }}>
        <Grid size={{ xs: 4 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <BackButton onClick={onBack} />
        </Grid>

        <Grid size={{ xs: 4 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'action.hover', borderRadius: 2, px: 1, py: 0.5 }}>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={onZoomOut} disabled={zoom <= 50}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center', fontWeight: 600 }}>
              {zoom}%
            </Typography>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={onZoomIn} disabled={zoom >= 300}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Rotate 90°">
            <IconButton size="small" onClick={onRotate} sx={{ bgcolor: 'action.hover' }}>
              <RotateRightIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset All">
            <IconButton size="small" onClick={onReset} sx={{ bgcolor: 'action.hover' }}>
              <ResetIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
          {!isMd && (
            <>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Tooltip title="Flip Horizontal">
                  <IconButton size="small" onClick={onFlipH} sx={{ bgcolor: flipH ? 'primary.main' : 'action.hover', color: flipH ? 'primary.contrastText' : 'inherit', '&:hover': { bgcolor: flipH ? 'primary.dark' : 'action.selected' } }}>
                    <FlipHIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Flip Vertical">
                  <IconButton size="small" onClick={onFlipV} sx={{ bgcolor: flipV ? 'primary.main' : 'action.hover', color: flipV ? 'primary.contrastText' : 'inherit', '&:hover': { bgcolor: flipV ? 'primary.dark' : 'action.selected' } }}>
                    <FlipVIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Tooltip title="Download">
                  <IconButton size="small" onClick={onDownload} sx={{ bgcolor: 'action.hover' }}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                {!isXs && (
                  <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                    <IconButton size="small" onClick={onFullscreen} sx={{ bgcolor: 'action.hover' }}>
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </>
          )}

          {(isMd || isSm || isXs) && (
            <Tooltip title="More">
              <IconButton size="small" onClick={onOpenMenu} sx={{ bgcolor: 'action.hover' }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageToolbar;
