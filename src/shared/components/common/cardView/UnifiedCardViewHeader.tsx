import { Search, TrendingUp, ViewModule, Clear } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { useRef } from "react";
import { MyTextField } from "@/shared/components";

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface UnifiedCardViewHeaderProps {
  // Visual
  title: string;
  subtitle?: string;
  mainChipLabel: string; // e.g. `${processedItemsLength} Countries`

  // Paging
  page: number; // zero-based

  // Search
  searchTerm: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;

  // Sort / Filter
  sortBy: string;
  sortByOptions: SortOption[];
  onSortByChange: (value: string) => void;

  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;

  filterBy: string;
  filterOptions: FilterOption[];
  onFilterByChange: (value: string) => void;

  // Actions
  onReset: () => void;
}

const UnifiedCardViewHeader = ({
  title,
  subtitle,
  mainChipLabel,
  page,
  searchTerm,
  searchPlaceholder,
  onSearchChange,
  onClearSearch,
  sortBy,
  sortByOptions,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  filterBy,
  filterOptions,
  onFilterByChange,
  onReset,
}: UnifiedCardViewHeaderProps) => {
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const clearSearchField = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 3,
      }}
    >
      {/* Title Section */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 48,
            height: 48,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <ViewModule sx={{ fontSize: 24 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label={mainChipLabel} color="primary" variant="outlined" />
          <Chip label={`Page: ${page + 1}`} color="info" variant="outlined" size="small" />
        </Stack>
      </Stack>

      {/* Search and Filter Controls */}
      <Grid container spacing={2} alignItems="center">
        {/* Search Bar */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ mb: 2 }}>
          <MyTextField
            fieldName="search"
            labelKey={null as any}
            placeholder={searchPlaceholder}
            value={searchTerm}
            register={() => ({
              onChange: (e: any) => onSearchChange(e.target.value),
            })}
            inputRef={searchInputRef}
            startIcon={<Search color="action" />}
            size="small"
            showClearButton={false}
            endAdornment={
              <IconButton
                aria-label="clear search"
                onClick={() => {
                  clearSearchField();
                  onClearSearch();
                }}
                disabled={!searchTerm}
                edge="end"
                size="small"
              >
                <Clear fontSize="small" />
              </IconButton>
            }
            showCounter={false}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                "&:hover": {
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              },
            }}
          />
        </Grid>

        {/* Sort By */}
        <Grid size={{ xs: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => onSortByChange(e.target.value)}>
              {sortByOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Order */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(event, value) => {
              void event;
              if (value) onSortOrderChange(value);
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
        </Grid>

        {/* Filter */}
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter</InputLabel>
            <Select value={filterBy} label="Filter" onChange={(e) => onFilterByChange(e.target.value)}>
              {filterOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 2 }}>
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
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UnifiedCardViewHeader;