/* eslint-disable react/prop-types */
// TypeScript version of StatesDataGrid with enhanced permissions implementation
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem, GridApi, GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useMemo } from "react";

// Import the simplified permissions and hooks
import Permissions from "@/constants/appPermissions";
import { MyContentsWrapper } from "@/layouts";
import {
  MyDataGrid,
  renderAlphaCode,
  renderCountryName,
  renderDate,
} from "@/shared/components";
import { useStatesPermissions } from "@/shared/hooks/usePermissions";
import AuthorizeView from "@/shared/components/auth/authorizeView";
import { State } from "../types/State";
import { Country } from "../../countries";

// Define interfaces for better type safety
interface StatesDataGridProps {
  states: State[];
  loading?: boolean;
  apiRef?: React.MutableRefObject<GridApi>;
  onEdit: (state: State) => void;
  onDelete: (state: State) => void;
  onView: (state: State) => void;
  onAdd: () => void;
  t: (key: string) => string;
}

// Custom render functions for states
const renderStateName = (isArabic: boolean = false) => (params: any) => {
  const name = isArabic ? params.row.nameAr : params.row.nameEn;
  return (
    <div style={{ 
      fontWeight: 500, 
      color: '#1976d2',
      textAlign: 'center'
    }}>
      {name || '-'}
    </div>
  );
};


const renderCountryInfo = (params: any) => {
  const country = params.row.country;
  if (!country) return '-';
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 500, color: '#1976d2' }}>
        {country.nameEn}
      </div>
      <div style={{ fontSize: '0.8em', color: '#666' }}>
        {country.nameAr}
      </div>
    </div>
  );
};

const StatesDataGrid: React.FC<StatesDataGridProps> = ({
  states,
  loading = false,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
}) => {
  const permissions = useStatesPermissions();

  // Memoized action buttons with enhanced permission checking
  const getActions = useCallback(
    (params: { row: State }) => {
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
          <AuthorizeView requiredPermissions={[Permissions.DeleteStates]}>
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
        flex: 1.2,
        align: "center",
        headerAlign: "center",
        renderCell: renderStateName(true),
      },
      {
        field: "nameEn",
        headerName: t("general.nameEn"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
        renderCell: renderStateName(false),
      },
      {
        field: "code",
        headerName: t("states.code"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: renderAlphaCode,
      },
      {
        field: "country",
        headerName: t("states.country"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
        renderCell: renderCountryInfo,
        sortable: false,
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
        rows={states}
        columns={columns}
        loading={loading}
        apiRef={apiRef}
        filterMode="client"
        sortModel={[{ field: "id", sort: "asc" }]}
        addNewRow={permissions.canCreate ? handleAddNew : undefined}
        pagination
        pageSizeOptions={[5, 10, 25]}
        fileName={t("states.title")}
        reportPdfHeader={t("states.title")}
      />
    </MyContentsWrapper>
  );
};

export default StatesDataGrid;

// Export types for use in other components
export type { StatesDataGridProps, State };