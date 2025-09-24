import { Public } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme
} from "@mui/material";

interface EmptyStateProps {
  onAdd: () => void;
}

const EmptyState = ({ onAdd }: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Empty State Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" color="primary.main" fontWeight="bold" gutterBottom>
          Countries Card View
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No countries available to display
        </Typography>
      </Paper>

      {/* Empty State Content */}
      <Paper sx={{
        p: 6,
        textAlign: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`
      }}>
        <Public sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
        <Typography variant="h4" color="text.secondary" gutterBottom>
          No Countries Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          Start building your geographic database by adding countries. You'll be able to search, filter, and organize them in this enhanced card view.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Public />}
          onClick={onAdd}
          sx={{ mt: 2 }}
        >
          Add Your First Country
        </Button>
      </Paper>
    </Box>
  );
};

export default EmptyState;