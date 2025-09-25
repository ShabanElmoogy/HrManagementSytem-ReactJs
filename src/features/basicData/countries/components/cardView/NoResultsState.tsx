import { NoResultsState as ReusableNoResultsState } from "@/shared/components/common/feedback";

interface NoResultsStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  onClearFilters?: () => void;
  onRefresh?: () => void;
}

const NoResultsState = ({ 
  searchTerm, 
  onClearSearch, 
  onClearFilters, 
  onRefresh 
}: NoResultsStateProps) => {
  return (
    <ReusableNoResultsState
      searchTerm={searchTerm}
      message="No Countries Found"
      subtitle={`No countries match your search criteria "${searchTerm}"`}
      onClearSearch={onClearSearch}
      onClearFilters={onClearFilters}
      onRefresh={onRefresh}
      sx={{ mt: 3 }}
    />
  );
};

export default NoResultsState;