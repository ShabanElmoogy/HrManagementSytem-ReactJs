import { Public } from "@mui/icons-material";
import {
  Box,
  Paper,
  Typography
} from "@mui/material";
import { EmptyState as ReusableEmptyState } from "@/shared/components/common/feedback";

interface EmptyStateProps {
  onAdd: () => void;
}

const EmptyState = ({ onAdd }: EmptyStateProps) => {
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

      {/* Empty State Content using reusable component */}
      <ReusableEmptyState
        icon={Public}
        title="No Countries Available"
        subtitle="Start building your geographic database by adding countries. You'll be able to search, filter, and organize them in this enhanced card view."
        actionText="Add Your First Country"
        onAction={onAdd}
        iconSize="large"
      />
    </Box>
  );
};

export default EmptyState;