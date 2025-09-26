import { appPermissions } from "@/constants";
import { CardView } from "@/shared/components/cardView";
import { Delete, Edit, LocationOn, Public, Visibility } from "@mui/icons-material";
import { Chip, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import type { State } from "../../types/State";
import {
  BadgePercentage,
  CardActionsRow,
  CreatedDateRow,
  QualityMeter,
  HighlightBadge,
} from "@/shared/components/common/cardView/cardBody/UnifiedCardParts";

// Deterministic color selection for countries
const paletteKeys = ["primary", "secondary", "success", "info", "warning", "error"] as const;
type ColorKey = typeof paletteKeys[number];

const hashString = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // Convert to 32bit integer
  }
  return Math.abs(h);
};

const countryColorKeyFor = (countryId?: string | number | null, countryName?: string | null): ColorKey => {
  const base =
    typeof countryId === "number"
      ? countryId
      : countryId
      ? hashString(String(countryId))
      : countryName
      ? hashString(countryName)
      : 0;
  const idx = Math.abs(base % paletteKeys.length);
  return paletteKeys[idx];
};

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
    if (score >= 90) return { level: "excellent", color: theme.palette.success.main };
    if (score >= 75) return { level: "good", color: theme.palette.info.main };
    if (score >= 60) return { level: "average", color: theme.palette.warning.main };
    return { level: "poor", color: theme.palette.error.main };
  };

  const qualityScore = getQualityScore(state);
  const qualityInfo = getQualityLevel(qualityScore);

  const topRightBadge = (
    <BadgePercentage value={qualityScore} highlighted={isHighlighted} color={qualityInfo.color} />
  );

  const leftBadge = isHighlighted && highlightLabel ? (
    <HighlightBadge label={highlightLabel} />
  ) : undefined;

  const chips = (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
      {state.code && (
        <Chip
          label={state.code}
          size="small"
          sx={{
            fontWeight: "bold",
            fontFamily: "monospace",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2), transform: "scale(1.05)" },
          }}
        />
      )}
      <Chip
        label={`ID: ${state.id}`}
        size="small"
        variant="outlined"
        sx={{ fontSize: "0.7rem", fontFamily: "monospace" }}
      />
    </Stack>
  );

  const content = (
    <>
      {/* State Details */}
      <Box sx={{ mb: 2 }}>
        {state.country && (() => {
          const key = countryColorKeyFor(state.countryId ?? null, state.country?.nameEn ?? null);
          const colorMain = theme.palette[key].main;
          const contrast = theme.palette.getContrastText(colorMain);
          return (
            <Tooltip title={`${state.country.nameEn}${state.country.nameAr ? ` / ${state.country.nameAr}` : ""}`} arrow>
              <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    height: 28,
                    pl: 3.5,
                    pr: 1.25,
                    borderRadius: 999,
                    bgcolor: alpha(colorMain, 0.12),
                    border: `1px solid ${alpha(colorMain, 0.35)}`,
                  }}
                >
                  <Typography variant="caption" sx={{ color: colorMain, fontWeight: "bold", lineHeight: 1 }}>
                    {state.country.nameEn}
                  </Typography>

                  <Box
                    sx={{
                      position: "absolute",
                      left: -6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: colorMain,
                      boxShadow: `0 2px 8px ${alpha(colorMain, 0.25)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${alpha(contrast, 0.15)}`,
                    }}
                  >
                    <Public sx={{ fontSize: 16, color: contrast }} />
                  </Box>
                </Box>
              </Box>
            </Tooltip>
          );
        })()}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {t("states.code")}: {state.code || "N/A"}
          </Typography>
        </Stack>
      </Box>

      {/* Quality Progress */}
      <QualityMeter score={qualityScore} />

      {/* Creation Date */}
      <CreatedDateRow
        date={state.createdOn ? new Date(state.createdOn) : null}
        formatter={(d) => format(d, "MMM dd, yyyy")}
      />
    </>
  );

  const footer = (
    <CardActionsRow
      actions={[
        {
          key: "view",
          title: t("actions.view") || "View Details",
          color: "info",
          icon: <Visibility sx={{ fontSize: 16 }} />,
          onClick: () => onView(state),
        },
        {
          key: "edit",
          title: t("actions.edit") || "Edit State",
          color: "primary",
          icon: <Edit sx={{ fontSize: 16 }} />,
          onClick: () => onEdit(state),
        },
        {
          key: "delete",
          title: t("actions.delete") || "Delete State",
          color: "error",
          icon: <Delete sx={{ fontSize: 16 }} />,
          onClick: () => onDelete(state),
          requiredPermissions: [appPermissions.DeleteStates],
        },
      ]}
    />
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
