import {
  AttachMoney,
  CalendarToday,
  Delete,
  Edit,
  Phone,
  Visibility
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Fade,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { format } from "date-fns";
import AuthorizeView from "../../../../../shared/components/auth/authorizeView";
import { appPermissions } from "@/constants";
import type { Country } from "../../types/Country";

interface CountryCardProps {
  country: Country;
  index: number;
  isHovered: boolean;
  isHighlighted: boolean;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
  onView: (country: Country) => void;
  onHover: (id: string | number | null) => void;
  t: (key: string) => string;
}

const CountryCard = ({
  country,
  index,
  isHovered,
  isHighlighted,
  onEdit,
  onDelete,
  onView,
  onHover,
  t,
}: CountryCardProps) => {
  const theme = useTheme();

  const getQualityScore = (country: Country) => {
    let score = 50; // Base score
    if (country.nameEn) score += 15;
    if (country.nameAr) score += 15;
    if (country.alpha2Code) score += 5;
    if (country.alpha3Code) score += 5;
    if (country.phoneCode) score += 5;
    if (country.currencyCode) score += 5;
    return Math.min(score, 100);
  };

  const getQualityLevel = (score: number) => {
    if (score >= 90) return { level: 'excellent', color: theme.palette.success.main };
    if (score >= 75) return { level: 'good', color: theme.palette.info.main };
    if (score >= 60) return { level: 'average', color: theme.palette.warning.main };
    return { level: 'poor', color: theme.palette.error.main };
  };

  const qualityScore = getQualityScore(country);
  const qualityInfo = getQualityLevel(qualityScore);

  return (
    <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
      <Card
        onMouseEnter={() => onHover(country.id)}
        onMouseLeave={() => onHover(null)}
        sx={{
          height: 400,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: 'hidden',
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background: isHighlighted
            ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${isHighlighted
              ? theme.palette.success.main
              : alpha(theme.palette.primary.main, isHovered ? 0.3 : 0.1)
            }`,
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
          ...(isHighlighted && {
            transform: "translateY(-4px) scale(1.01)",
            boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`,
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`,
              },
              "50%": {
                boxShadow: `0 16px 40px ${alpha(theme.palette.success.main, 0.5)}`,
              },
              "100%": {
                boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`,
              },
            },
          }),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: isHighlighted
              ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              : `linear-gradient(90deg, ${qualityInfo.color} 0%, ${theme.palette.primary.main} 100%)`,
            opacity: isHovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease'
          }
        }}
      >
        {/* Quality Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
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
        </Box>

        {/* Highlight Badge */}
        {isHighlighted && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 50,
              zIndex: 3,
            }}
          >
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: theme.palette.success.main,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                animation: "bounce 1s ease-in-out infinite",
                "@keyframes bounce": {
                  "0%, 20%, 50%, 80%, 100%": {
                    transform: "translateY(0)",
                  },
                  "40%": {
                    transform: "translateY(-4px)",
                  },
                  "60%": {
                    transform: "translateY(-2px)",
                  },
                },
              }}
            />
          </Box>
        )}

        <CardContent sx={{ flex: 1, pt: 4, pb: 1 }}>
          {/* Country Names */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {country.nameEn || "N/A"}
            </Typography>
            {country.nameAr && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  direction: "rtl",
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {country.nameAr}
              </Typography>
            )}
          </Box>

          {/* Country Codes and ID */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {country.alpha2Code && (
              <Chip
                label={country.alpha2Code}
                size="small"
                sx={{
                  fontWeight: "bold",
                  fontFamily: 'monospace',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.05)'
                  }
                }}
              />
            )}
            {country.alpha3Code && (
              <Chip
                label={country.alpha3Code}
                size="small"
                sx={{
                  fontWeight: "bold",
                  fontFamily: 'monospace',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.secondary.main, 0.2),
                    transform: 'scale(1.05)'
                  }
                }}
              />
            )}
            <Chip
              label={`ID: ${country.id}`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.7rem',
                fontFamily: 'monospace'
              }}
            />
          </Stack>

          {/* Country Details */}
          <Box sx={{ mb: 2 }}>
            {country.phoneCode && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" fontWeight="medium">
                  +{country.phoneCode}
                </Typography>
              </Stack>
            )}
            {country.currencyCode && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AttachMoney sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" fontWeight="medium">
                  {country.currencyCode}
                </Typography>
              </Stack>
            )}
          </Box>

          {/* Quality Progress */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                Data Quality
              </Typography>
              <Typography variant="caption" color={qualityInfo.color} fontWeight="bold">
                {qualityInfo.level.toUpperCase()}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={qualityScore}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.grey[300], 0.3),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: qualityInfo.color,
                },
              }}
            />
          </Box>

          {/* Creation Date */}
          <Box sx={{ mt: "auto" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {country.createdOn
                  ? format(new Date(country.createdOn), "MMM dd, yyyy")
                  : "N/A"}
              </Typography>
            </Stack>
          </Box>
        </CardContent>

        <Divider />

        {/* Action Buttons */}
        <CardActions
          sx={{
            justifyContent: "center",
            px: 2,
            py: 1.5,
            minHeight: 64,
            alignItems: 'center'
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title={t("actions.view") || "View Details"} arrow>
              <IconButton
                size="small"
                color="info"
                onClick={() => onView(country)}
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    transform: 'scale(1.1)',
                    borderColor: theme.palette.info.main
                  }
                }}
              >
                <Visibility sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("actions.edit") || "Edit Country"} arrow>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(country)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.1)',
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>
              <Tooltip title={t("actions.delete") || "Delete Country"} arrow>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(country)}
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                      transform: 'scale(1.1)',
                      borderColor: theme.palette.error.main
                    }
                  }}
                >
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </AuthorizeView>
          </Stack>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default CountryCard;