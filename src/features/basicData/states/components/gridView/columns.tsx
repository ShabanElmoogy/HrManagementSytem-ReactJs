import React from "react";
import { GridActionsCellItemProps, GridColDef } from "@mui/x-data-grid";
import { renderAlphaCode, renderDate } from "@/shared/components";
import type { State } from "../../types/State";

export interface ColumnsFactoryProps {
  t: (key: string) => string;
  permissions: { canView: boolean; canEdit: boolean; canDelete: boolean };
  getActions: (params: { row: State }) => React.ReactElement<GridActionsCellItemProps>[];
}

// Local renderers specific to States
const renderStateName = (isArabic: boolean = false) => (params: any) => {
  const name = isArabic ? params.row.nameAr : params.row.nameEn;
  return (
    <div style={{ fontWeight: 500, color: "#1976d2", textAlign: "center" }}>
      {name || "-"}
    </div>
  );
};

const renderCountryInfo = (params: any) => {
  const country = params.row.country;
  if (!country) return "-";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 500, color: "#1976d2" }}>{country.nameEn}</div>
      <div style={{ fontSize: "0.8em", color: "#666" }}>{country.nameAr}</div>
    </div>
  );
};

export const useStateColumns = ({ t, permissions, getActions }: ColumnsFactoryProps): GridColDef[] => {
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
};
