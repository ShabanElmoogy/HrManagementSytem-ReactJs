// FileUpload.tsx - Container, split into smaller components
import { StyledCard } from "@/shared/components/fileUpload/styledComponents";
import useFileUpload from "./hooks/useFileUpload.js";
import UploadHeader from "./components/UploadHeader.js";
import UploadDropArea from "./components/UploadDropArea.js";
import UploadList from "./components/UploadList.js";
import UploadActions from "./components/UploadActions.js";

interface FileUploadProps {
  onSuccess?: (fileName: string) => void;
  onClose?: () => void;
  multiple?: boolean;
}

const FileUpload = ({ onSuccess, onClose, multiple = true }: FileUploadProps) => {
  const {
    files,
    isUploading,
    dragActive,
    globalError,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    uploadFiles,
    SnackbarComponent,
    accept,
  } = useFileUpload({ onSuccess, onClose, multiple });

  return (
    <StyledCard>
      <UploadHeader globalError={globalError} />

      <UploadDropArea
        dragActive={dragActive}
        isUploading={isUploading}
        multiple={multiple}
        accept={accept}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onFileInput={handleFileInput}
      />

      <UploadList files={files} isUploading={isUploading} onRemoveFile={removeFile} />

      <UploadActions files={files} isUploading={isUploading} onUpload={uploadFiles} onClose={onClose} />

      {SnackbarComponent}
    </StyledCard>
  );
};

export default FileUpload;
