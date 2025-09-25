import React from "react";
import { CalendarToday } from "@mui/icons-material";
import { Chip, IconButton, LinearProgress, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import AuthorizeView from "@/shared/components/auth/authorizeView";

// BadgePercentage: percentage chip for top-right corner
export const BadgePercentage: React.FC<{
  value: number;
  highlighted?: boolean;
  color?: string; // fallback color if provided
}> = ({ value, highlighted = false, color }) => {
  const theme = useTheme();
  const badgeColor = color || theme.palette.primary.main;
  return (
    <Chip
      label={`${Math.round(value)}%`}
      size="small"
      sx={{
        bgcolor: highlighted ? theme.palette.success.main : badgeColor,
        color: "white",
        fontWeight: "bold",
        fontSize: "0.7rem",
        boxShadow: `0 2px 8px ${alpha(highlighted ? theme.palette.success.main : badgeColor, 0.3)}`,
      }}
    />
  );
};

// HighlightBadge: animated left badge with label (e.g., New, Edited)
export const HighlightBadge: React.FC<{ label: string }> = ({ label }) => {
  const theme = useTheme();
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: theme.palette.error.main,
        color: "white",
        fontWeight: "bold",
        fontSize: "0.65rem",
        animation: "bounce 1s ease-in-out infinite",
        "@keyframes bounce": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-4px)" },
          "60%": { transform: "translateY(-2px)" },
        },
      }}
    />
  );
};

// QualityMeter: label + progress with dynamic color and level text
export const QualityMeter: React.FC<{
  score: number; // 0-100
  title?: string;
}> = ({ score, title = "Data Quality" }) => {
  const theme = useTheme();
  const getQualityLevel = (s: number) => {
    if (s >= 90) return { level: "excellent", color: theme.palette.success.main };
    if (s >= 75) return { level: "good", color: theme.palette.info.main };
    if (s >= 60) return { level: "average", color: theme.palette.warning.main };
    return { level: "poor", color: theme.palette.error.main };
  };
  const qualityInfo = getQualityLevel(score);

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="caption" color={qualityInfo.color} fontWeight="bold">
          {qualityInfo.level.toUpperCase()}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(100, score))}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.grey[300], 0.3),
          "& .MuiLinearProgress-bar": { borderRadius: 3, backgroundColor: qualityInfo.color },
        }}
      />
    </Box>
  );
};

// InfoIconText: generic icon + text rows (with optional secondary line)
export const InfoIconText: React.FC<{
  icon: React.ReactNode;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  mb?: number;
}> = ({ icon, primary, secondary, mb = 1 }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb }}>
    {icon}
    <Box>
      <Typography variant="body2" fontWeight="medium">
        {primary}
      </Typography>
      {secondary && (
        <Typography variant="caption" color="text.secondary">
          {secondary}
        </Typography>
      )}
    </Box>
  </Stack>
);

// CreatedDateRow: date row with calendar icon
export const CreatedDateRow: React.FC<{
  date?: string | Date | null;
  formatter?: (d: Date) => string;
}> = ({ date, formatter }) => {
  const formatDate = (d?: string | Date | null) => {
    if (!d) return "N/A";
    const dd = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dd.getTime())) return "N/A";
    const f = formatter || ((x: Date) => x.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }));
    return f(dd);
  };
  return (
    <Box sx={{ mt: "auto" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
        <Typography variant="caption" color="text.secondary">
          {formatDate(date)}
        </Typography>
      </Stack>
    </Box>
  );
};

// CardActionsRow: row of action icon buttons with common styling and optional permissions
export interface CardActionItem {
  key: string;
  title: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  icon: React.ReactNode;
  onClick: () => void;
  requiredPermissions?: string[];
}

export const CardActionsRow: React.FC<{ actions: CardActionItem[] }> = ({ actions }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      {actions.map((action) => {
        const button = (
          <Tooltip key={action.key} title={action.title} arrow>
            <IconButton
              size="small"
              color={action.color}
              onClick={action.onClick}
              sx={{
                bgcolor: alpha(theme.palette[action.color].main, 0.1),
                border: `1px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
                "&:hover": {
                  bgcolor: alpha(theme.palette[action.color].main, 0.2),
                  transform: "scale(1.1)",
                  borderColor: theme.palette[action.color].main,
                },
              }}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        );

        if (action.requiredPermissions && action.requiredPermissions.length > 0) {
          return (
            <AuthorizeView key={action.key} requiredPermissions={action.requiredPermissions}>
              {button}
            </AuthorizeView>
          );
        }
        return button;
      })}
    </Stack>
  );
};
