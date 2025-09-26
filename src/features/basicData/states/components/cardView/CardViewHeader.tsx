import UnifiedCardViewHeader from "@/shared/components/common/cardView/cardHeader/UnifiedCardViewHeader";

interface CardViewHeaderProps {
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  filterBy: string;
  processedStatesLength: number;
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
  processedStatesLength,
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
      title="States Card View"
      subtitle={`Browse and manage ${processedStatesLength} states with enhanced search and filtering`}
      mainChipLabel={`${processedStatesLength} States`}
      page={page}

      searchTerm={searchTerm}
      searchPlaceholder="Search states by name, code, or country..."
      onSearchChange={onSearchChange}
      onClearSearch={() => {
        onSearchChange("");
        onFilterByChange("all");
        onClearSearch();
      }}

      sortBy={sortBy}
      sortByOptions={[
        { value: "name", label: "Name" },
        { value: "code", label: "State Code" },
        { value: "country", label: "Country" },
        { value: "created", label: "Created Date" },
      ]}
      onSortByChange={onSortByChange}

      sortOrder={sortOrder as "asc" | "desc"}
      onSortOrderChange={(v) => onSortOrderChange(v)}

      filterBy={filterBy}
      filterOptions={[
        { value: "all", label: "All States" },
        { value: "recent", label: "Recent (30 days)" },
        { value: "hasCode", label: "Has State Code" },
        { value: "hasCountry", label: "Has Country" },
      ]}
      onFilterByChange={onFilterByChange}

      onReset={onReset}
    />
  );
};

export default CardViewHeader;
