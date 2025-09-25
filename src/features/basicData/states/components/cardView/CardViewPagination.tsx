import {
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Box
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface CardViewPaginationProps {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  itemsPerPageOptions: number[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
}

const CardViewPagination = ({
  page,
  rowsPerPage,
  totalItems,
  itemsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
}: CardViewPaginationProps) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isNarrow = useMediaQuery('(max-width:724px)');
  const isCompact = useMediaQuery('(max-width:660px)');

  return (
    <Paper sx={{ mt: 3, p: 3 }}>
      <Stack
        direction={isCompact ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Left side - Showing info and items per page */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          sx={{ order: isCompact ? 1 : 1, flexDirection: isCompact ? 'row' : undefined, justifyContent: isXs ? 'center' : (isCompact ? 'space-between' : undefined), width: isCompact ? '100%' : undefined }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: isXs ? 'center' : 'inherit' }}>
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalItems)} of {totalItems} states
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              Items per page:
            </Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
              sx={{ minWidth: 80 }}
            >
              {itemsPerPageOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>

        {/* Right side - Pagination controls */}
        <Box sx={{ order: isCompact ? 2 : 2, maxWidth: '100%', display: 'flex', justifyContent: isXs ? 'center' : 'flex-start', overflowX: isNarrow ? 'auto' : 'visible', whiteSpace: isNarrow ? 'nowrap' : 'normal', '& .MuiPagination-ul': { flexWrap: 'nowrap' } }}>
          <Pagination
            count={Math.ceil(totalItems / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => onPageChange(event, value - 1)}
            color="primary"
            showFirstButton={!isNarrow}
            showLastButton={!isNarrow}
            siblingCount={isNarrow ? 0 : 1}
            boundaryCount={isNarrow ? 0 : 1}
            size={isXs || isNarrow ? "small" : "medium"}
            sx={{ display: 'inline-flex', '& .MuiPagination-ul': { flexWrap: 'nowrap' } }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default CardViewPagination;