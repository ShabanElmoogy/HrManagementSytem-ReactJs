/* eslint-disable react/prop-types */
// components/CountriesDataGrid.jsx
import { appPermissions } from "@/constants";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
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

const CountriesDataGrid = ({
  countries,
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
      <AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>
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
    [t, getActions, renderPhoneCode, renderCurrencyCode]
  );

  return (
    <MyContentsWrapper>
      <MyDataGrid
        rows={countries}
        columns={columns}
        loading={loading}
        apiRef={apiRef}
        filterMode="client"
        sortModel={[{ field: "id", sort: "asc" }]}
        addNewRow={onAdd}
        pagination
        pageSizeOptions={[5, 10, 25]}
        fileName={t("countries.title")}
        reportPdfHeader={t("countries.title")}
      />
    </MyContentsWrapper>
  );
};

export default CountriesDataGrid;
