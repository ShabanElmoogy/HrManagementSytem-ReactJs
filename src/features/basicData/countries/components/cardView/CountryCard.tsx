import { CardView } from "@/shared/components/cardView";
import { useTheme } from "@mui/material";
import { format } from "date-fns";
import type { Country } from "../../types/Country";
import CountryCardChips from "./CountryCardChips";
import {
  BadgePercentage,
  CountryDetails,
  CreatedDateRow,
  HighlightBadge,
  QualityMeter,
} from "@/shared/components/common/cardView/cardBody/UnifiedCardParts";
import CountryCardFooter from "./CountryCardFooter";
import CountryStatesSection from "./CountryStatesSection";

interface CountryCardProps {
  country: Country;
  index: number;
  isHovered: boolean;
  isHighlighted: boolean;
  highlightLabel?: string | null;
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
  highlightLabel,
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
    if (score >= 90)
      return { level: "excellent", color: theme.palette.success.main };
    if (score >= 75) return { level: "good", color: theme.palette.info.main };
    if (score >= 60)
      return { level: "average", color: theme.palette.warning.main };
    return { level: "poor", color: theme.palette.error.main };
  };

  const qualityScore = getQualityScore(country);
  const qualityInfo = getQualityLevel(qualityScore);

  const topRightBadge = (
    <BadgePercentage value={qualityScore} highlighted={isHighlighted} color={qualityInfo.color} />
  );

  const leftBadge = isHighlighted && highlightLabel ? (
    <HighlightBadge label={highlightLabel} />
  ) : undefined;

  const chips = (
    <CountryCardChips country={country} />
  );

  const content = (
    <>
      <CountryDetails phoneCode={country.phoneCode} currencyCode={country.currencyCode} />

      <CountryStatesSection country={country} t={t} />

      <QualityMeter score={qualityScore} title="Data Quality" />

      <CreatedDateRow
        date={country.createdOn ? new Date(country.createdOn) : null}
        formatter={(d) => format(d, "MMM dd, yyyy")}
      />
    </>
  );

  const footer = (
    <CountryCardFooter
      country={country}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      t={t}
    />
  );

  return (
    <CardView
      index={index}
      highlighted={isHighlighted}
      isHovered={isHovered}
      onMouseEnter={() => onHover(country.id)}
      onMouseLeave={() => onHover(null)}
      height={400}
      topRightBadge={topRightBadge}
      leftBadge={leftBadge}
      title={country.nameEn || "N/A"}
      subtitle={country.nameAr || undefined}
      chips={chips}
      content={content}
      footer={footer}
    />
  );
};

export default CountryCard;
