/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { GridApiCommon } from "@mui/x-data-grid";
import { MyContentsWrapper } from "@/layouts";
import { MyDataGrid } from "@/shared/components";
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";
import { Country } from "../../types/Country";
import { makeCountryActions } from "./gridActions";
import { useCountryColumns } from "./columns";

// Define interfaces for better type safety
interface CountriesDataGridProps {
  countries: Country[];
  loading?: boolean;
  apiRef?: React.RefObject<GridApiCommon>;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
  onView: (country: Country) => void;
  onAdd: () => void;
  t: (key: string) => string;
}

const CountriesDataGrid: React.FC<CountriesDataGridProps> = ({
  countries,
  loading = false,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const permissions = useCountriesPermissions();

  // Actions factory based on permissions and handlers
  const getActions = useCallback(
    makeCountryActions({ t, permissions, onView, onEdit, onDelete }),
    [t, permissions, onView, onEdit, onDelete]
  );

  // Columns factory
  const columns = useCountryColumns({ t, permissions, getActions });

  // Enhanced add button with permission check
  const handleAddNew = useCallback(() => {
    if (permissions.canCreate) {
      onAdd();
    }
  }, [onAdd, permissions.canCreate]);

  return (
    <MyContentsWrapper>
      <MyDataGrid
        rows={countries}
        columns={columns}
        loading={loading}
        apiRef={apiRef}
        filterMode="client"
        sortModel={[{ field: "id", sort: "asc" }]}
        addNewRow={permissions.canCreate ? handleAddNew : undefined}
        pagination
        pageSizeOptions={[5, 10, 25]}
        fileName={t("countries.title")}
        reportPdfHeader={t("countries.title")}
      />
    </MyContentsWrapper>
  );
};

export default CountriesDataGrid;

// Export types for use in other components
export type { CountriesDataGridProps, Country };
