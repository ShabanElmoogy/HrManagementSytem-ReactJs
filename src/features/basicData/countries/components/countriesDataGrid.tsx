/* eslint-disable react/prop-types */
// TypeScript version of CountriesDataGrid with enhanced permissions implementation
import React, { useCallback, useMemo } from "react";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridApi } from "@mui/x-data-grid";

// Import the new TypeScript permissions and hooks
import Permissions, { PermissionEnum } from "@/constants/appPermissions";
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";
import {
  MyDataGrid,
  renderAlphaCode,
  renderCountryName,
  renderCurrencyCode,
  renderDate,
  renderPhoneCode,
} from "@/shared/components";
import { MyContentsWrapper } from "@/layouts";

// Define interfaces for better type safety
interface Country {
  id: string | number;
  nameAr: string;
  nameEn: string;
  alpha2Code: string;
  alpha3Code: string;
  phoneCode: string;
  currencyCode: string;
  createdOn: string;
  updatedOn: string;
}

interface CountriesDataGridProps {
  countries: Country[];
  loading?: boolean;
  apiRef?: React.MutableRefObject<GridApi>;
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

  // Memoized action buttons with enhanced permission checking
  const getActions = useCallback(
    (params: { row: Country }) => {
      const actions = [];

      // View action - always available if user has view permission
      if (permissions.canView) {
        actions.push(
          <Tooltip title={t("actions.view")} key={`view-${params.row.id}`} arrow>
            <GridActionsCellItem
              icon={<Visibility sx={{ fontSize: 25 }} />}
              label={t("actions.view")}
              color="info"
              onClick={() => onView(params.row)}
            />
          </Tooltip>
        );
      }

      // Edit action - only if user has edit permission
      if (permissions.canEdit) {
        actions.push(
          <Tooltip title={t("actions.edit")} key={`edit-${params.row.id}`} arrow>
            <GridActionsCellItem
              icon={<Edit sx={{ fontSize: 25 }} />}
              label={t("actions.edit")}
              color="primary"
              onClick={() => onEdit(params.row)}
            />
          </Tooltip>
        );
      }

      // Delete action - only if user has delete permission
      if (permissions.canDelete) {
        actions.push(
          <AuthorizeView requiredPermissions={[Permissions.DeleteCountries]}>
            <Tooltip
              title={t("actions.delete")}
              key={`delete-${params.row.id}`}
              arrow
            >
              <GridActionsCellItem
                icon={<Delete sx={{ fontSize: 25 }} />}
                label={t("actions.delete")}
                color="error"
                onClick={() => onDelete(params.row)}
              />
            </Tooltip>
          </AuthorizeView>
        );
      }

      return actions;
    },
    [t, onEdit, onDelete, onView, permissions]
  );

  // Memoized columns with proper typing
  const columns = useMemo((): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: "id",
        headerName: t("general.id"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "nameAr",
        headerName: t("general.nameAr"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: renderCountryName(true),
      },
      {
        field: "nameEn",
        headerName: t("general.nameEn"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
        renderCell: renderCountryName(true),
      },
      {
        field: "alpha2Code",
        headerName: t("countries.alpha2Code"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: renderAlphaCode,
      },
      {
        field: "alpha3Code",
        headerName: t("countries.alpha3Code"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: renderAlphaCode,
      },
      {
        field: "phoneCode",
        headerName: t("countries.phoneCode"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: renderPhoneCode,
      },
      {
        field: "currencyCode",
        headerName: t("countries.currencyCode"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: renderCurrencyCode,
      },
      {
        field: "createdOn",
        headerName: t("general.createdOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDate,
      },
      {
        field: "updatedOn",
        headerName: t("general.updatedOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDate,
      },
    ];

    // Only add actions column if user has any permissions
    if (permissions.canView || permissions.canEdit || permissions.canDelete) {
      baseColumns.push({
        field: "actions",
        type: "actions",
        headerName: t("actions.buttons"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        getActions,
      });
    }

    return baseColumns;
  }, [t, getActions, permissions]);

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
export type { Country, CountriesDataGridProps };