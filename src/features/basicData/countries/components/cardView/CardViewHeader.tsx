import { Search, TrendingUp, ViewModule, Clear } from "@mui/icons-material";
import { useRef } from "react";
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
import { MyTextField } from "@/shared/components";

interface CardViewHeaderProps {
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  filterBy: string;
  processedCountriesLength: number;
  page: number;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
  onClearSearch: () => void;
  onReset: () => void;
}

const CardViewHeader = ({
  searchTerm,
  sortBy,
  sortOrder,
  filterBy,
  processedCountriesLength,
  page,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onFilterByChange,
  onClearSearch,
  onReset,
}: CardViewHeaderProps) => {
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const clearSearchField = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
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
        borderRadius: 3
      }}
    >
      {/* Title Section */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 48,
            height: 48,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          <ViewModule sx={{ fontSize: 24 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            Countries Card View
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and manage {processedCountriesLength} countries with enhanced search and filtering
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`${processedCountriesLength} Countries`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Page: ${page + 1}`}
            color="info"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Stack>

      {/* Search and Filter Controls */}
      <Grid container spacing={2} alignItems="center">
        {/* Search Bar */}
        <Grid size={{ xs: 12, md: 4 }} sx={{mb:2}}>
          <MyTextField
            fieldName="search"
            labelKey={null}
            placeholder="Search countries by name, code, phone, or currency..."
            value={searchTerm}
            register={() => ({
              onChange: (e : any) => onSearchChange(e.target.value),
            })}
            inputRef={searchInputRef}
            startIcon={<Search color="action" />}
            size="small"
            showClearButton={false}
            endAdornment={
              <IconButton
                aria-label="clear search"
                onClick={() => { clearSearchField(); onSearchChange(''); onFilterByChange('all'); }}
                disabled={!searchTerm}
                edge="end"
                size="small"
              >
                <Clear fontSize="small" />
              </IconButton>
            }
            showCounter={false}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }
            }}
          />
        </Grid>

        {/* Sort By */}
        <Grid size={{ xs: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="alpha2">Alpha-2 Code</MenuItem>
              <MenuItem value="alpha3">Alpha-3 Code</MenuItem>
              <MenuItem value="phone">Phone Code</MenuItem>
              <MenuItem value="currency">Currency</MenuItem>
              <MenuItem value="created">Created Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Order */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(event, value) => { void event; if (value) onSortOrderChange(value); }}
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
                <TrendingUp sx={{ transform: 'rotate(180deg)' }} />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Filter */}
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterBy}
              label="Filter"
              onChange={(e) => onFilterByChange(e.target.value)}
            >
              <MenuItem value="all">All Countries</MenuItem>
              <MenuItem value="recent">Recent (30 days)</MenuItem>
              <MenuItem value="hasPhone">Has Phone Code</MenuItem>
              <MenuItem value="hasCurrency">Has Currency</MenuItem>
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
                onClick={() => { onClearSearch(); onFilterByChange('all'); clearSearchField(); }}
                disabled={!searchTerm}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => { onReset(); clearSearchField(); }}
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

export default CardViewHeader;