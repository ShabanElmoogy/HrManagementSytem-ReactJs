import React from "react";
import { LinearProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";

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
