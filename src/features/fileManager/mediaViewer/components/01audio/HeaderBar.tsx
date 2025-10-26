import React from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export interface HeaderBarProps {
  onBack?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onBack }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: 1, borderColor: "divider" }}>
      <IconButton onClick={onBack} size="small">
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default HeaderBar;
