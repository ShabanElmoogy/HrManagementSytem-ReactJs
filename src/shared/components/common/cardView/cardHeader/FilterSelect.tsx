import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { FilterOption } from "./UnifiedCardViewHeader";

export interface FilterSelectProps {
  filterBy: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ filterBy, options, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>Filter</InputLabel>
    <Select value={filterBy} label="Filter" onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
