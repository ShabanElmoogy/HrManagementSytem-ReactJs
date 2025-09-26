import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SortOption } from "./UnifiedCardViewHeader";

export interface SortBySelectProps {
  sortBy: string;
  options: SortOption[];
  onChange: (value: string) => void;
}

export const SortBySelect: React.FC<SortBySelectProps> = ({ sortBy, options, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>Sort By</InputLabel>
    <Select value={sortBy} label="Sort By" onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
