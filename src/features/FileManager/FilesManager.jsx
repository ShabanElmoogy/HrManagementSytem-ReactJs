// components/FilesManager.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Dialog,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../Utilites/CustomHooks/useSnackbar";
import { fileService } from "../../services/fileService";
import apiService from "../../Services/ApiService";
import FileUpload from "./FileUpload";
import { HandleApiError } from "../../Services/ApiError";
import { useTranslation } from "react-i18next";
import ConfirmationDialogue from "../../Shared/ConfirmationDialogue";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}));

const ActionBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const LoadingOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  zIndex: 10,
});

const FilesManager = () => {
  // Hooks
  const navigate = useNavigate();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { t } = useTranslation();

  // State
  const [files, setFiles] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("fileName");
  const [deleteFilter, setDeleteFilter] = useState("active");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const showViewButton = [
    "mp4",
    "webm",
    "pdf",
    "mp3",
    "rpt",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
  ];

  // Load files
  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiService.get(`v1/api/Files/GetAll`);
      const sortedFiles =
        result?.sort(
          (a, b) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        ) || [];
      setFiles(sortedFiles);
      setOriginalFiles(sortedFiles);
    } catch (error) {
      HandleApiError(error, (updatedState) => {
        showSnackbar("error", updatedState.messages, error.title);
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Filter files based on search and delete status
  const filteredFiles = useMemo(() => {
    let result = [...originalFiles];

    // Apply delete filter
    if (deleteFilter === "active") {
      result = result.filter((f) => !f.isDeleted);
    } else if (deleteFilter === "deleted") {
      result = result.filter((f) => f.isDeleted);
    }

    // Apply search
    if (searchText) {
      result = result.filter((file) => {
        const value = String(file[selectedColumn] || "").toLowerCase();
        return value.includes(searchText.toLowerCase());
      });
    }

    return result;
  }, [originalFiles, deleteFilter, searchText, selectedColumn]);

  // Handlers
  const handleUploadSuccess = async (fileName) => {
    await loadFiles();
    showSnackbar("success", [t("companyAdded")], t("success"));
    setUploadDialogOpen(false);
  };

  const handleUploadError = (errors) => {
    showSnackbar("error", [t("error")], t("error"));
  };

  const handleDownloadFile = async (file) => {
    try {
      const response = await fileService.downloadFile(
        `v1/api/Files/Download`,
        file.storedFileName
      );

      if (!response.success) {
        throw new Error("Download failed");
      }

      showSnackbar("success", ["File downloaded successfully"], t("success"));
    } catch (error) {
      HandleApiError(error, (updatedState) => {
        showSnackbar("error", updatedState.messages, error.title);
      });
    }
  };

  const handleViewFile = (file) => {
    navigate(
      `/extras-show-media/${file.id}/${file.fileExtension}/${file.storedFileName}/${file.fileName}`
    );
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await apiService.delete(
        `v1/api/Files/Delete/${fileToDelete.storedFileName}`
      );
      await loadFiles();
      showSnackbar("success", ["File deleted successfully"], t("success"));
    } catch (error) {
      HandleApiError(error, (updatedState) => {
        showSnackbar("error", updatedState.messages, error.title);
      });
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  // Grid columns
  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "contentType",
      headerName: "Content Type",
      width: 150,
    },
    {
      field: "fileExtension",
      headerName: "Extension",
      width: 120,
    },
    {
      field: "isDeleted",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? "Deleted" : "Active"}
          color={params.value ? "error" : "success"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={() => handleDownloadFile(params.row)}
              color="primary"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {showViewButton.includes(
            params.row.fileExtension.substring(1).toLowerCase()
          ) && (
            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={() => handleViewFile(params.row)}
                color="info"
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setFileToDelete(params.row);
                setDeleteDialogOpen(true);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ position: "relative" }}>
      {isLoading && (
        <LoadingOverlay>
          <CircularProgress size={60} />
        </LoadingOverlay>
      )}

      <StyledPaper>
        <ActionBar>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Files Manager
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Add File
            </Button>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={deleteFilter}
                onChange={(e) => setDeleteFilter(e.target.value)}
                label="Filter"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="deleted">Deleted</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </ActionBar>

        <SearchBar>
          <TextField
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Search In</InputLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              label="Search In"
            >
              <MenuItem value="fileName">File Name</MenuItem>
              <MenuItem value="contentType">Content Type</MenuItem>
              <MenuItem value="fileExtension">Extension</MenuItem>
            </Select>
          </FormControl>
        </SearchBar>

        <DataGrid
          rows={filteredFiles}
          columns={columns}
          pageSize={rowsPerPage}
          onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          autoHeight
          sx={{
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              fontSize: "0.875rem",
              fontWeight: 600,
            },
          }}
        />
      </StyledPaper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <FileUpload
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onClose={() => setUploadDialogOpen(false)}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialogue
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        handleDeleteConfirm={handleDeleteFile}
        t={t}
      />
      {SnackbarComponent}
    </Box>
  );
};

export default FilesManager;
