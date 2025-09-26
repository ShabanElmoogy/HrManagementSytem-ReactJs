import React from "react";
import { Button, Stack } from "@mui/material";

export interface QuickActionsProps {
  searchTerm: string;
  onClearSearch: () => void;
  onReset: () => void;
  clearSearchField: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ searchTerm, onClearSearch, onReset, clearSearchField }) => (
  <Stack direction="column" spacing={1}>
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          onClearSearch();
          clearSearchField();
        }}
        disabled={!searchTerm}
      >
        Clear
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          onReset();
          clearSearchField();
        }}
      >
        Reset
      </Button>
    </Stack>
  </Stack>
);
