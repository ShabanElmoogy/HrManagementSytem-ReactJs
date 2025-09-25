import { Search } from "@mui/icons-material";
import {
  Button,
  Paper,
  Typography,
  useTheme
} from "@mui/material";

interface NoResultsStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const NoResultsState = ({ searchTerm, onClearSearch }: NoResultsStateProps) => {
  const theme = useTheme();

  return (
    <Paper sx={{
      p: 4,
      textAlign: 'center',
      mt: 3,
      background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
    }}>
      <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No States Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        No states match your search criteria "{searchTerm}"
      </Typography>
      <Button
        variant="outlined"
        onClick={onClearSearch}
        startIcon={<Search />}
      >
        Clear Search
      </Button>
    </Paper>
  );
};

export default NoResultsState;