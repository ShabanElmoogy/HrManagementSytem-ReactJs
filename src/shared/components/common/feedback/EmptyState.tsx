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
  Inbox,
  Add,
  Refresh
} from '@mui/icons-material';

interface EmptyStateProps {
  /** The icon to display - can be a MUI icon component or custom icon */
  icon?: React.ComponentType<SvgIconProps>;
  /** Main title text */
  title: string;
  /** Subtitle or description text */
  subtitle?: string;
  /** Primary action button text */
  actionText?: string;
  /** Primary action button handler */
  onAction?: () => void;
  /** Custom action element (takes precedence over actionText/onAction) */
  action?: React.ReactNode;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Secondary action button handler */
  onSecondaryAction?: () => void;
  /** Whether to show the component in a Paper container */
  withPaper?: boolean;
  /** Custom styling for the container */
  sx?: object;
  /** Size variant for the icon */
  iconSize?: 'small' | 'medium' | 'large';
  /** Whether to show a refresh button */
  showRefresh?: boolean;
  /** Refresh button handler */
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent = Inbox,
  title,
  subtitle,
  actionText,
  onAction,
  action,
  secondaryActionText,
  onSecondaryAction,
  withPaper = true,
  sx = {},
  iconSize = 'large',
  showRefresh = false,
  onRefresh
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
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400, opacity: 0.8 }}
        >
          {subtitle}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {action ? (
          action
        ) : (
          actionText && onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              startIcon={<Add />}
              sx={{ minWidth: 120 }}
            >
              {actionText}
            </Button>
          )
        )}

        {secondaryActionText && onSecondaryAction && (
          <Button
            variant="outlined"
            onClick={onSecondaryAction}
            sx={{ minWidth: 120 }}
          >
            {secondaryActionText}
          </Button>
        )}

        {showRefresh && onRefresh && (
          <Button
            variant="text"
            onClick={onRefresh}
            startIcon={<Refresh />}
            sx={{ minWidth: 100 }}
          >
            Refresh
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

export default EmptyState;