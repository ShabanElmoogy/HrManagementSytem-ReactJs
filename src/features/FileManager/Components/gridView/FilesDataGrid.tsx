import { useMemo, useCallback } from "react";
import MyDataGrid from "@/shared/components/common/datagrid/myDataGrid";
import type { FileItem } from "../../types/File";
import type { TFunction } from "i18next";
import makeFileActions from "./makeFileActions";
import makeFileColumns from "./makeFileColumns";

interface FilesDataGridProps {
  files: FileItem[];
  loading: boolean;
  apiRef: any;
  onDownload: (file: FileItem) => void;
  onView: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onAdd: () => void;
  t: TFunction;
}


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
