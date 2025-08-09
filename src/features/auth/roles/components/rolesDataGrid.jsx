/* eslint-disable react/prop-types */
// components/RolesDataGrid.jsx
import { Delete, Edit, Key, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";

import { MyDataGrid } from "@/shared/components";

const RolesDataGrid = ({
  roles,
  loading,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onManagePermissions,
  onAdd,
  t,
}) => {
  // Memoized action buttons
  const getActions = useCallback(
    (params) => [
      <Tooltip title={t("actions.view")} key={`view-${params.row.id}`} arrow>
        <GridActionsCellItem
          icon={<Visibility sx={{ fontSize: 25 }} />}
          label={t("actions.view")}
          color="info"
          onClick={() => onView(params.row)}
        />
      </Tooltip>,
      <Tooltip title={t("actions.edit")} key={`edit-${params.row.id}`} arrow>
        <GridActionsCellItem
          icon={<Edit sx={{ fontSize: 25 }} />}
          label={t("actions.edit")}
          color="primary"
          onClick={() => onEdit(params.row)}
        />
      </Tooltip>,
      <Tooltip
        title={t("roles.managePermissions")}
        key={`permissions-${params.row.id}`}
        arrow
      >
        <GridActionsCellItem
          icon={<Key sx={{ fontSize: 25 }} />}
          label={t("roles.managePermissions")}
          color="secondary"
          onClick={() => onManagePermissions(params.row)}
        />
      </Tooltip>,
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
      </Tooltip>,
    ],
    [t, onEdit, onDelete, onView, onManagePermissions]
  );

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("general.id"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "name",
        headerName: t("roles.name"),
        flex: 2,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "isDeleted",
        headerName: t("roles.status"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <span
            style={{
              color: params.value ? "#d32f2f" : "#2e7d32",
              fontWeight: "bold",
            }}
          >
            {params.value ? t("actions.deleted") : t("actions.active")}
          </span>
        ),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("actions.buttons"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
        getActions,
      },
    ],
    [t, getActions]
  );

  return (
    // @ts-ignore
    <MyDataGrid
      rows={roles}
      columns={columns}
      loading={loading}
      apiRef={apiRef}
      filterMode="client"
      sortModel={[{ field: "id", sort: "asc" }]}
      addNewRow={onAdd}
      pagination
      pageSizeOptions={[5, 10, 25]}
      fileName={t("roles.name")}
      reportPdfHeader={t("roles.name")}
    />
  );
};

export default RolesDataGrid;
