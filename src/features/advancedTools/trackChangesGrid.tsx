import { useState, useEffect, useMemo } from "react";
import { useGridApiRef } from "@mui/x-data-grid";
import { HandleApiError } from "@/shared/services";
import { MyDataGrid } from "@/shared/components";
import { MyHeader } from "@/shared/components";
import { useTranslation } from "react-i18next";
import { MyContentsWrapper } from "@/layouts/components";
import { useSnackbar } from "@/shared/hooks";
import { apiService } from "@/shared/services";
import { dateFormat } from "@/constants/strings";
import dayjs from "dayjs";
import { apiRoutes } from "@/routes";

const TrackChangesGrid = () => {
  const [loading, setLoading] = useState(true);
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [changes, setChanges] = useState([]);
  const { t } = useTranslation();
  const apiRef = useGridApiRef(); // Add this line

  useEffect(() => {
    getAllChanges();
  }, []);

  const getAllChanges = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(
        "/api/v1/EntityChangeLogs/GetAllChangesLogs"
      );
      const allChanges = response.data || response;
      setChanges(
        allChanges.map((row) => ({ ...row, id: crypto.randomUUID() }))
      );
    } catch (error) {
      HandleApiError(error, (updatedState) => {
        showSnackbar("error", updatedState.messages, error.title);
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "changeLogId",
        headerName: t("trackhanges.changeLogId"),
        flex: 0.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "entityName",
        headerName: t("trackhanges.entityName"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "key",
        headerName: t("trackhanges.key"),
        flex: 1.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "oldValue",
        headerName: t("trackhanges.oldValue"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "newValue",
        headerName: t("trackhanges.newValue"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "changedBy",
        headerName: t("trackhanges.changedBy"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "changedAt",
        headerName: t("trackhanges.changedAt"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (params) => dayjs(params).format(dateFormat),
      },
      {
        field: "changedByPc",
        headerName: t("trackhanges.changedByPc"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ],
    [t]
  );

  return (
    <>
      <MyContentsWrapper>
        <MyHeader title={t("trackhanges.title")} subTitle={t("trackhanges.subTitle")} />
        {/* @ts-ignore */}
        <MyDataGrid
          rows={changes}
          columns={columns}
          loading={loading}
          apiRef={apiRef}
          showAddButton={false}
          filterMode="client"
          sortModel={[{ field: "id", sort: "asc" }]}
          pagination
          pageSizeOptions={[5, 10, 25]}
        />
      </MyContentsWrapper>
      {SnackbarComponent}
    </>
  );
};

export default TrackChangesGrid;
