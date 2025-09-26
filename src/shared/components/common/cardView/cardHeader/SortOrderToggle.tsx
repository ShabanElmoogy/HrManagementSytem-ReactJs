import React from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export interface SortOrderToggleProps {
  sortOrder: "asc" | "desc";
  onChange: (value: "asc" | "desc") => void;
}

export const SortOrderToggle: React.FC<SortOrderToggleProps> = ({ sortOrder, onChange }) => (
  <ToggleButtonGroup
    value={sortOrder}
    exclusive
    onChange={(event, value) => {
      void event;
      if (value) onChange(value);
    }}
    size="small"
    fullWidth
  >
    <ToggleButton value="asc">
      <Tooltip title="Ascending">
        <TrendingUp />
      </Tooltip>
    </ToggleButton>
    <ToggleButton value="desc">
      <Tooltip title="Descending">
        <TrendingUp sx={{ transform: "rotate(180deg)" }} />
      </Tooltip>
    </ToggleButton>
  </ToggleButtonGroup>
);
