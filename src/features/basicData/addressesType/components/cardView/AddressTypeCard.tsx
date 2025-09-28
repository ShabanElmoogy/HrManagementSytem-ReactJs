import { CardView } from "@/shared/components/cardView";
import { useTheme } from "@mui/material";
import { format } from "date-fns";
import AddressTypeCardChips from "./AddressTypeCardChips";
import {
  BadgePercentage,
  CreatedDateRow,
  HighlightBadge,
  QualityMeter,
} from "@/shared/components/common/cardView/cardBody/UnifiedCardParts";
import AddressTypeCardFooter from "./AddressTypeCardFooter";
import { getQualityScore, getQualityLevel } from "./AddressTypeCardUtils";
import type { AddressTypeCardProps } from "./AddressTypeCard.types";

const AddressTypeCard = ({
  addressType,
  index,
  isHovered,
  isHighlighted,
  highlightLabel,
  onEdit,
  onDelete,
  onView,
  onHover,
  t,
}: AddressTypeCardProps) => {
  const theme = useTheme();

  const qualityScore = getQualityScore(addressType);
  const qualityInfo = getQualityLevel(qualityScore, theme);

  const topRightBadge = (
    <BadgePercentage
      value={qualityScore}
      highlighted={isHighlighted}
      color={qualityInfo.color}
    />
  );

  const leftBadge =
    isHighlighted && highlightLabel ? (
      <HighlightBadge label={highlightLabel} />
    ) : undefined;

  const chips = <AddressTypeCardChips addressType={addressType} />;

  const content = (
    <>
      <QualityMeter score={qualityScore} title="Data Quality" />

      <CreatedDateRow
        date={addressType.createdOn ? new Date(addressType.createdOn) : null}
        formatter={(d) => format(d, "MMM dd, yyyy")}
      />
    </>
  );

  const footer = (
    <AddressTypeCardFooter
      addressType={addressType}
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
      onMouseEnter={() => onHover(addressType.id)}
      onMouseLeave={() => onHover(null)}
      height={320}
      topRightBadge={topRightBadge}
      leftBadge={leftBadge}
      title={addressType.nameEn || "N/A"}
      subtitle={addressType.nameAr || undefined}
      chips={chips}
      content={content}
      footer={footer}
    />
  );
};

export default AddressTypeCard;