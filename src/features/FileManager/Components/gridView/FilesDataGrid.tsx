import MyDataGrid from "@/shared/components/common/datagrid/myDataGrid";
import { useCallback, useMemo } from "react";
import makeFileActions from "./components/makeFileActions";
import makeFileColumns from "./components/makeFileColumns";
import { FilesDataGridProps } from "./types/gridView.type";

const FilesDataGrid = ({
  files,
  loading,
  apiRef,
  onDownload,
  onView,
  onDelete,
  onAdd,
  t,
}: FilesDataGridProps) => {


  const getActions = useCallback(
    makeFileActions({ t, onDownload, onView, onDelete }),
    [t, onDownload, onView, onDelete]
  );

  const columns = useMemo(
    () => makeFileColumns({ t, getActions }),
    [t, getActions]
  );

  return (
    <MyDataGrid
      rows={files}
      columns={columns}
      loading={loading}
      apiRef={apiRef}
      filterMode="client"
      sortModel={[{ field: "createdOn", sort: "asc" }]}
      addNewRow={onAdd}
      pagination
      pageSizeOptions={[5, 10, 25, 50]}
      fileName="files"
      reportPdfHeader="Files Report"
    />
  );
};

export default FilesDataGrid;
