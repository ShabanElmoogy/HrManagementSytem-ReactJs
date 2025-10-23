import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileDownload as DownloadIcon, PictureInPicture as PipIcon, Bookmark as BookmarkIcon, MenuOpen as SidebarIcon } from '@mui/icons-material';

const TopControlsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
  padding: theme.spacing(2),
  transition: 'opacity 0.3s ease',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

interface TopBarProps {
  title: string;
  show: boolean;
  onDownload: () => void;
  onPip: () => void;
  onOpenTimeMarks: () => void;
  sidebarActive: boolean;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, show, onDownload, onPip, onOpenTimeMarks, sidebarActive, onToggleSidebar }) => {
  return (
    <TopControlsOverlay className="controls-overlay" sx={{ opacity: show ? 1 : 0 }}>
      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{title}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Download">
          <IconButton onClick={onDownload} sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Picture in Picture">
          <IconButton onClick={onPip} sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <PipIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Time Marks">
          <IconButton onClick={onOpenTimeMarks} sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <BookmarkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notes & Bookmarks">
          <IconButton onClick={onToggleSidebar} sx={{ color: sidebarActive ? '#1976d2' : '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <SidebarIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </TopControlsOverlay>
  );
};
