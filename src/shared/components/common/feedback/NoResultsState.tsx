import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  SvgIconProps
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Refresh
} from '@mui/icons-material';

interface NoResultsStateProps {
  /** The search term or filter criteria that produced no results */
  searchTerm?: string;
  /** Custom message to display instead of default */
  message?: string;
  /** Subtitle or additional context */
  subtitle?: string;
  /** Handler for clearing search/filters */
  onClearSearch?: () => void;
  /** Handler for clearing all filters */
  onClearFilters?: () => void;
  /** Handler for refreshing data */
  onRefresh?: () => void;
  /** Custom icon to display */
  icon?: React.ComponentType<SvgIconProps>;
  /** Whether to show the component in a Paper container */
  withPaper?: boolean;
  /** Custom styling for the container */
  sx?: object;
  /** Size variant for the icon */
  iconSize?: 'small' | 'medium' | 'large';
  /** Custom action button */
  customAction?: {
    text: string;
    handler: () => void;
    icon?: React.ComponentType<SvgIconProps>;
    variant?: 'contained' | 'outlined' | 'text';
  };
}

const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchTerm,
  message,
  subtitle,
  onClearSearch,
  onClearFilters,
  onRefresh,
  icon: IconComponent = Search,
  withPaper = true,
  sx = {},
  iconSize = 'large',
  customAction
}) => {
  const theme = useTheme();

  const getIconSize = () => {
    switch (iconSize) {
      case 'small': return 32;
      case 'medium': return 40;
      case 'large': return 64;
      default: return 64;
    }
  };

  const getDefaultMessage = () => {
    if (message) return message;
    if (searchTerm) return `No results found for "${searchTerm}"`;
    return 'No results found';
  };

  const getDefaultSubtitle = () => {
    if (subtitle) return subtitle;
    if (searchTerm) return 'Try adjusting your search criteria or clearing filters';
    return 'Try adjusting your filters or refreshing the data';
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
        minHeight: 200,
        ...sx
      }}
    >
      <IconComponent
        sx={{
          fontSize: getIconSize(),
          color: 'text.secondary',
          mb: 2,
          opacity: 0.7
        }}
      />
      
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        {getDefaultMessage()}
      </Typography>
      
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400, opacity: 0.8 }}
      >
        {getDefaultSubtitle()}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {searchTerm && onClearSearch && (
          <Button
            variant="outlined"
            onClick={onClearSearch}
            startIcon={<Clear />}
            sx={{ minWidth: 120 }}
          >
            Clear Search
          </Button>
        )}
        
        {onClearFilters && (
          <Button
            variant="outlined"
            onClick={onClearFilters}
            startIcon={<FilterList />}
            sx={{ minWidth: 120 }}
          >
            Clear Filters
          </Button>
        )}
        
        {onRefresh && (
          <Button
            variant="text"
            onClick={onRefresh}
            startIcon={<Refresh />}
            sx={{ minWidth: 100 }}
          >
            Refresh
          </Button>
        )}
        
        {customAction && (
          <Button
            variant={customAction.variant || 'contained'}
            onClick={customAction.handler}
            startIcon={customAction.icon ? <customAction.icon /> : undefined}
            sx={{ minWidth: 120 }}
          >
            {customAction.text}
          </Button>
        )}
      </Box>
    </Box>
  );

  if (withPaper) {
    return (
      <Paper
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        {content}
      </Paper>
    );
  }

  return content;
};

export default NoResultsState;