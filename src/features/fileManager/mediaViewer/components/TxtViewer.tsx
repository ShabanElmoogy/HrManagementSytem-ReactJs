import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, IconButton, Tooltip, TextField, Toolbar, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Download as DownloadIcon, 
  ContentCopy as CopyIcon, 
  Print as PrintIcon,
  Search as SearchIcon,

  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon,


  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useSidebar } from "@/layouts/components/sidebar/sidebarContext";

interface TxtViewerProps {
  fileUrl: string;
  fileName?: string;
  onBack?: () => void;
  onError?: (message: string) => void;
}

export const TxtViewer: React.FC<TxtViewerProps> = ({ fileUrl, fileName = 'Text File', onBack, onError }) => {
  const { open: sidebarOpen } = useSidebar();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load text file';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileUrl, onError]);

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${fileName}</title></head>
          <body><pre style="font-family: monospace; white-space: pre-wrap;">${content}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSearch = () => setShowSearch(!showSearch);

  const handleFontIncrease = () => setFontSize(prev => Math.min(prev + 2, 24));
  const handleFontDecrease = () => setFontSize(prev => Math.max(prev - 2, 10));

  const handleThemeToggle = () => setDarkMode(!darkMode);
  const handleRefresh = () => window.location.reload();
  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: fileName, url: currentUrl });
      } catch (err) {
        navigator.clipboard.writeText(currentUrl);
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
    }
  };
  const handleInfo = () => setShowInfo(!showInfo);

  return (
    <Paper
      elevation={3}
      sx={{
        width: sidebarOpen ? "calc(100vw - 270px)" : "calc(100vw - 90px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 48,
          mt: 5,
          px: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {onBack && (
            <Tooltip title="Back">
              <IconButton onClick={onBack} size="small">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fileName}
          </Typography>
          {showSearch && (
            <TextField
              size="small"
              placeholder="Search in text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 2, width: 250 }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {/* Large screens - show most buttons */}
          {!isMd && (
            <>
              <Tooltip title="Search">
                <IconButton onClick={handleSearch} size="small" sx={{ bgcolor: showSearch ? "primary.main" : "action.hover", color: showSearch ? "white" : "inherit" }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Font Size -">
                <IconButton onClick={handleFontDecrease} size="small" sx={{ bgcolor: "action.hover" }}>
                  <TextDecreaseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Font Size +">
                <IconButton onClick={handleFontIncrease} size="small" sx={{ bgcolor: "action.hover" }}>
                  <TextIncreaseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={handleThemeToggle} size="small" sx={{ bgcolor: "action.hover" }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} size="small" sx={{ bgcolor: "action.hover" }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton onClick={handleShare} size="small" disabled={loading || !!error} sx={{ bgcolor: "action.hover" }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Info">
                <IconButton onClick={handleInfo} size="small" sx={{ bgcolor: showInfo ? "primary.main" : "action.hover", color: showInfo ? "white" : "inherit" }}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {/* Medium screens - show search and font controls */}
          {isMd && !isSm && (
            <>
              <Tooltip title="Search">
                <IconButton onClick={handleSearch} size="small" sx={{ bgcolor: showSearch ? "primary.main" : "action.hover", color: showSearch ? "white" : "inherit" }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Font Size -">
                <IconButton onClick={handleFontDecrease} size="small" sx={{ bgcolor: "action.hover" }}>
                  <TextDecreaseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Font Size +">
                <IconButton onClick={handleFontIncrease} size="small" sx={{ bgcolor: "action.hover" }}>
                  <TextIncreaseIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {/* Small screens - show only search */}
          {isSm && !isXs && (
            <Tooltip title="Search">
              <IconButton onClick={handleSearch} size="small" sx={{ bgcolor: showSearch ? "primary.main" : "action.hover", color: showSearch ? "white" : "inherit" }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Always show essential buttons */}
          <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton onClick={handleCopy} size="small" disabled={loading || !!error} sx={{ bgcolor: "action.hover" }}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          
          {!isXs && (
            <>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} size="small" disabled={loading || !!error} sx={{ bgcolor: "action.hover" }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton onClick={handleDownload} size="small" disabled={loading || !!error} sx={{ bgcolor: "action.hover" }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {/* Show menu for smaller screens */}
          {(isMd || isSm || isXs) && (
            <Tooltip title="More">
              <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ bgcolor: "action.hover" }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {/* XS screens - show download in toolbar */}
          {isXs && (
            <Tooltip title="Download">
              <IconButton onClick={handleDownload} size="small" disabled={loading || !!error} sx={{ bgcolor: "action.hover" }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading file...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body1" color="error">
              Error: {error}
            </Typography>
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            value={searchTerm && content ? content.replace(
              new RegExp(searchTerm, 'gi'),
              (match) => `🔍${match}🔍`
            ) : content}
            InputProps={{ readOnly: true }}
            variant="outlined"
            sx={{
              height: '100%',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
                bgcolor: darkMode ? '#1e1e1e' : 'background.paper',
                color: darkMode ? '#ffffff' : 'text.primary',
                alignItems: 'flex-start',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-input': {
                padding: 2,
                verticalAlign: 'top',
                whiteSpace: 'pre-wrap',
              },
              '& .MuiInputBase-inputMultiline': {
                verticalAlign: 'top !important',
                whiteSpace: 'pre-wrap',
              },
            }}
          />
        )}
      </Box>
      
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {/* XS screens - show all menu items */}
        {isXs && (
          <>
            <MenuItem onClick={() => { handleSearch(); setMenuAnchor(null); }}>
              <SearchIcon sx={{ mr: 1 }} /> Search
            </MenuItem>
            <MenuItem onClick={() => { handleFontDecrease(); setMenuAnchor(null); }}>
              <TextDecreaseIcon sx={{ mr: 1 }} /> Font Size -
            </MenuItem>
            <MenuItem onClick={() => { handleFontIncrease(); setMenuAnchor(null); }}>
              <TextIncreaseIcon sx={{ mr: 1 }} /> Font Size +
            </MenuItem>
            <MenuItem onClick={() => { handleThemeToggle(); setMenuAnchor(null); }}>
              {darkMode ? <LightModeIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>
            <MenuItem onClick={() => { handleRefresh(); setMenuAnchor(null); }}>
              <RefreshIcon sx={{ mr: 1 }} /> Refresh
            </MenuItem>
            <MenuItem onClick={() => { handleShare(); setMenuAnchor(null); }}>
              <ShareIcon sx={{ mr: 1 }} /> Share
            </MenuItem>
            <MenuItem onClick={() => { handleInfo(); setMenuAnchor(null); }}>
              <InfoIcon sx={{ mr: 1 }} /> Info
            </MenuItem>
            <MenuItem onClick={() => { handlePrint(); setMenuAnchor(null); }}>
              <PrintIcon sx={{ mr: 1 }} /> Print
            </MenuItem>
          </>
        )}
        
        {/* SM screens - show font controls + other options */}
        {isSm && !isXs && (
          <>
            <MenuItem onClick={() => { handleFontDecrease(); setMenuAnchor(null); }}>
              <TextDecreaseIcon sx={{ mr: 1 }} /> Font Size -
            </MenuItem>
            <MenuItem onClick={() => { handleFontIncrease(); setMenuAnchor(null); }}>
              <TextIncreaseIcon sx={{ mr: 1 }} /> Font Size +
            </MenuItem>
            <MenuItem onClick={() => { handleThemeToggle(); setMenuAnchor(null); }}>
              {darkMode ? <LightModeIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>
            <MenuItem onClick={() => { handleRefresh(); setMenuAnchor(null); }}>
              <RefreshIcon sx={{ mr: 1 }} /> Refresh
            </MenuItem>
            <MenuItem onClick={() => { handleShare(); setMenuAnchor(null); }}>
              <ShareIcon sx={{ mr: 1 }} /> Share
            </MenuItem>
            <MenuItem onClick={() => { handleInfo(); setMenuAnchor(null); }}>
              <InfoIcon sx={{ mr: 1 }} /> Info
            </MenuItem>
          </>
        )}
        
        {/* MD screens - show theme + other options */}
        {isMd && !isSm && (
          <>
            <MenuItem onClick={() => { handleThemeToggle(); setMenuAnchor(null); }}>
              {darkMode ? <LightModeIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>
            <MenuItem onClick={() => { handleRefresh(); setMenuAnchor(null); }}>
              <RefreshIcon sx={{ mr: 1 }} /> Refresh
            </MenuItem>
            <MenuItem onClick={() => { handleShare(); setMenuAnchor(null); }}>
              <ShareIcon sx={{ mr: 1 }} /> Share
            </MenuItem>
            <MenuItem onClick={() => { handleInfo(); setMenuAnchor(null); }}>
              <InfoIcon sx={{ mr: 1 }} /> Info
            </MenuItem>
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default TxtViewer;
