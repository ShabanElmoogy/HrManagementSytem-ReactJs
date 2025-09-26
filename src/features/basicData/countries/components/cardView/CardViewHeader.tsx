import UnifiedCardViewHeader from "@/shared/components/common/cardView/cardHeader/UnifiedCardViewHeader";

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
  return (
    <UnifiedCardViewHeader
      title="Countries Card View"
      subtitle={`Browse and manage ${processedCountriesLength} countries with enhanced search and filtering`}
      mainChipLabel={`${processedCountriesLength} Countries`}
      page={page}

      searchTerm={searchTerm}
      searchPlaceholder="Search countries by name, code, phone, or currency..."
      onSearchChange={onSearchChange}
      onClearSearch={() => {
        onSearchChange("");
        onFilterByChange("all");
        onClearSearch();
      }}

      sortBy={sortBy}
      sortByOptions={[
        { value: "name", label: "Name" },
        { value: "alpha2", label: "Alpha-2 Code" },
        { value: "alpha3", label: "Alpha-3 Code" },
        { value: "phone", label: "Phone Code" },
        { value: "currency", label: "Currency" },
        { value: "created", label: "Created Date" },
      ]}
      onSortByChange={onSortByChange}

      sortOrder={sortOrder as "asc" | "desc"}
      onSortOrderChange={(v) => onSortOrderChange(v)}

      filterBy={filterBy}
      filterOptions={[
        { value: "all", label: "All Countries" },
        { value: "recent", label: "Recent (30 days)" },
        { value: "hasPhone", label: "Has Phone Code" },
        { value: "hasCurrency", label: "Has Currency" },
      ]}
      onFilterByChange={onFilterByChange}

      onReset={onReset}
    />
  );
};

export default CardViewHeader;
