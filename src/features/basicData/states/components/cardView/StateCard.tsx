import { appPermissions } from "@/constants";
import AuthorizeView from "@/shared/components/auth/authorizeView";
import { CardView } from "@/shared/components/cardView";
import { CalendarToday, Delete, Edit, LocationOn, Public, Visibility } from "@mui/icons-material";
import { Chip, IconButton, LinearProgress, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import type { State } from "../../types/State";

interface StateCardProps {
  state: State;
  index: number;
  isHovered: boolean;
  isHighlighted: boolean;
  highlightLabel?: string | null;
  onEdit: (state: State) => void;
  onDelete: (state: State) => void;
  onView: (state: State) => void;
  onHover: (id: string | number | null) => void;
  t: (key: string) => string;
}

const StateCard = ({
  state,
  index,
  isHovered,
  isHighlighted,
  highlightLabel,
  onEdit,
  onDelete,
  onView,
  onHover,
  t,
}: StateCardProps) => {
  const theme = useTheme();

  const getQualityScore = (state: State) => {
    let score = 40; // Base score
    if (state.nameEn) score += 20;
    if (state.nameAr) score += 20;
    if (state.code) score += 10;
    if (state.countryId && state.country) score += 10;
    return Math.min(score, 100);
  };

  const getQualityLevel = (score: number) => {
    if (score >= 90) return { level: 'excellent', color: theme.palette.success.main };
    if (score >= 75) return { level: 'good', color: theme.palette.info.main };
    if (score >= 60) return { level: 'average', color: theme.palette.warning.main };
    return { level: 'poor', color: theme.palette.error.main };
  };

  const qualityScore = getQualityScore(state);
  const qualityInfo = getQualityLevel(qualityScore);

  const topRightBadge = (
    <Chip
      label={`${qualityScore}%`}
      size="small"
      sx={{
        bgcolor: isHighlighted ? theme.palette.success.main : qualityInfo.color,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.7rem',
        boxShadow: `0 2px 8px ${alpha(isHighlighted ? theme.palette.success.main : qualityInfo.color, 0.3)}`
      }}
    />
  );

  const leftBadge = isHighlighted && highlightLabel ? (
    <Chip
      label={highlightLabel}
      size="small"
      sx={{
        bgcolor: theme.palette.error.main,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.65rem',
        animation: "bounce 1s ease-in-out infinite",
        "@keyframes bounce": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-4px)" },
          "60%": { transform: "translateY(-2px)" },
        },
      }}
    />
  ) : undefined;

  const chips = (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
      {state.code && (
        <Chip
          label={state.code}
          size="small"
          sx={{
            fontWeight: "bold",
            fontFamily: 'monospace',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2), transform: 'scale(1.05)' }
          }}
        />
      )}
      <Chip
        label={`ID: ${state.id}`}
        size="small"
        variant="outlined"
        sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}
      />
    </Stack>
  );

  const content = (
    <>
      {/* State Details */}
      <Box sx={{ mb: 2 }}>
        {state.country && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Public sx={{ fontSize: 16, color: "text.secondary" }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">{state.country.nameEn}</Typography>
              {state.country.nameAr && (
                <Typography variant="caption" color="text.secondary">{state.country.nameAr}</Typography>
              )}
            </Box>
          </Stack>
        )}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {t("states.code")}: {state.code || "N/A"}
          </Typography>
        </Stack>
      </Box>

      {/* Quality Progress */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">Data Quality</Typography>
          <Typography variant="caption" color={qualityInfo.color} fontWeight="bold">{qualityInfo.level.toUpperCase()}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={qualityScore}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.grey[300], 0.3),
            '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: qualityInfo.color },
          }}
        />
      </Box>

      {/* Creation Date */}
      <Box sx={{ mt: "auto" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {state.createdOn ? format(new Date(state.createdOn), "MMM dd, yyyy") : "N/A"}
          </Typography>
        </Stack>
      </Box>
    </>
  );

  const footer = (
    <Stack direction="row" spacing={1}>
      <Tooltip title={t("actions.view") || "View Details"} arrow>
        <IconButton
          size="small"
          color="info"
          onClick={() => onView(state)}
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2), transform: 'scale(1.1)', borderColor: theme.palette.info.main }
          }}
        >
          <Visibility sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("actions.edit") || "Edit State"} arrow>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(state)}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2), transform: 'scale(1.1)', borderColor: theme.palette.primary.main }
          }}
        >
          <Edit sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <AuthorizeView requiredPermissions={[appPermissions.DeleteStates]}>
        <Tooltip title={t("actions.delete") || "Delete State"} arrow>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(state)}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2), transform: 'scale(1.1)', borderColor: theme.palette.error.main }
            }}
          >
            <Delete sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </AuthorizeView>
    </Stack>
  );

  return (
    <CardView
      index={index}
      highlighted={isHighlighted}
      isHovered={isHovered}
      onMouseEnter={() => onHover(state.id)}
      onMouseLeave={() => onHover(null)}
      height={400}
      topRightBadge={topRightBadge}
      leftBadge={leftBadge}
      title={state.nameEn || "N/A"}
      subtitle={state.nameAr || undefined}
      chips={chips}
      content={content}
      footer={footer}
    />
  );
};

export default StateCard;