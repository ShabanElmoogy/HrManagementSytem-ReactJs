/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { GridApiCommon } from "@mui/x-data-grid";
import { MyContentsWrapper } from "@/layouts";
import { MyDataGrid } from "@/shared/components";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { AddressType } from "../../types/AddressType";
import { makeAddressTypeActions } from "./gridActions";
import { useAddressTypeColumns } from "./columns";

interface AddressTypesDataGridProps {
  items: AddressType[];
  loading?: boolean;
  apiRef?: React.RefObject<GridApiCommon>;
  onEdit: (item: AddressType) => void;
  onDelete: (item: AddressType) => void;
  onView: (item: AddressType) => void;
  onAdd: () => void;
  t: (key: string) => string;
  lastAddedId?: string | number | null;
  lastEditedId?: string | number | null;
  lastDeletedIndex?: number | null;
}

const AddressTypesDataGrid: React.FC<AddressTypesDataGridProps> = ({
  items,
  loading = false,
  apiRef,
  onEdit,
  onDelete,
  onView,
  onAdd,
  t,
  lastAddedId,
  lastEditedId,
  lastDeletedIndex,
}) => {
  const permissions = useModulePermissions("AddressTypes");

  const getActions = useCallback(
    makeAddressTypeActions({ t, permissions, onView, onEdit, onDelete }),
    [t, permissions, onView, onEdit, onDelete]
  );

  const columns = useAddressTypeColumns({ t, permissions, getActions });

  const handleAddNew = useCallback(() => {
    if (permissions.canCreate) {
      onAdd();
    }
  }, [onAdd, permissions.canCreate]);

  return (
    <MyContentsWrapper>
      <MyDataGrid
        rows={items}
        columns={columns}
        loading={loading}
        apiRef={apiRef}
        filterMode="client"
        sortModel={[{ field: "id", sort: "asc" }]}
        addNewRow={permissions.canCreate ? handleAddNew : undefined}
        pagination
        pageSizeOptions={[5, 10, 25]}
        fileName={t("addressTypes.title")}
        reportPdfHeader={t("addressTypes.title")}
        lastAddedId={lastAddedId}
        lastEditedId={lastEditedId}
        lastDeletedIndex={lastDeletedIndex}
      />
    </MyContentsWrapper>
  );
};

export default AddressTypesDataGrid;

export type { AddressTypesDataGridProps, AddressType };
