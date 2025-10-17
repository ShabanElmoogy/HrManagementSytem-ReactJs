import React from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";

const Section = ({ children, title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        position: "relative",
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.primary.main,
          0.04
        )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 10px 30px ${alpha(theme.palette.common.black, 0.4)}`
            : `0 10px 30px ${alpha(theme.palette.primary.main, 0.12)}`,
        overflow: "hidden",
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ mb: 1.5 }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};

export default Section;
