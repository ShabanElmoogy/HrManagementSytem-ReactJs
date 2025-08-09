/* eslint-disable react/prop-types */
// components/StatesDataGrid.jsx
import { appPermissions } from "@/constants";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
import AuthorizeView from "../../../../shared/components/auth/authorizeView";

import {
  MyDataGrid,
  renderCountryName,
  renderDate,
  renderDateTime
} from "@/shared/components";
import { MyContentsWrapper } from "@/layouts";

const StatesDataGrid = ({
  states,
  loading,
  apiRef,
  onEdit,
  onDelete,
  onView,
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
      <AuthorizeView requiredPermissions={[appPermissions.DeleteStates]}>
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
      </AuthorizeView>,
    ],
    [t, onEdit, onDelete, onView]
  );

  // Memoized columns
  const columns = useMemo(
    () => [
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
        field: "code",
        headerName: t("states.code"),
        flex: 0.8,
        align: "center",
        headerAlign: "center",
      },
      //values direct in params object
      {
        field: "country",
        headerName: t("general.country"),
        flex: 1.2,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => params?.nameEn || "N/A",
        renderCell: renderCountryName(true),
      },
      {
        field: "createdOn",
        headerName: t("general.createdOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDateTime,
      },
      {
        field: "updatedOn",
        headerName: t("general.updatedOn"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: renderDateTime,
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("actions.buttons"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        getActions,
      },
    ],
    [t, getActions]
  );

  return (
    // @ts-ignore
  <MyContentsWrapper>
    <MyDataGrid
      rows={states}
      columns={columns}
      loading={loading}
      apiRef={apiRef}
      filterMode="client"
      sortModel={[{ field: "id", sort: "asc" }]}
      addNewRow={onAdd}
      pagination
      pageSizeOptions={[5, 10, 25]}
      fileName={t("states.title")}
      reportPdfHeader={t("states.title")}
    />
    </MyContentsWrapper>
  );
};

export default StatesDataGrid;