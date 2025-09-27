/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Pagination,
  Skeleton,
  useTheme,
  alpha,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Search,
  FilterList,
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Edit,
  Delete,
  Visibility,
  Add,
} from "@mui/icons-material";
import { Employee, EmployeeFilters } from "../types/Employee";

interface EmployeeListProps {
  employees: Employee[];
  loading?: boolean;
  onEmployeeClick?: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employee: Employee) => void;
  onAddEmployee?: () => void;
  filters?: EmployeeFilters;
  onFiltersChange?: (filters: EmployeeFilters) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading = false,
  onEmployeeClick,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee,
  filters = {},
  onFiltersChange,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        !searchTerm ||
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        !filters.department || employee.department === filters.department;
      const matchesStatus =
        !filters.status || employee.status === filters.status;
      const matchesCountry =
        !filters.country || employee.address.country === filters.country;

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesCountry
      );
    });
  }, [employees, searchTerm, filters]);

  // Paginate employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, page]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange?.({ ...filters, search: value });
    setPage(1); // Reset to first page
  };

  const handleFilterChange = (key: keyof EmployeeFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange?.(newFilters);
    setPage(1); // Reset to first page
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "terminated":
        return "error";
      case "on-leave":
        return "info";
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "terminated":
        return "Terminated";
      case "on-leave":
        return "On Leave";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box>
        {/* Search and filters skeleton */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>

        {/* Employee cards skeleton */}
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Card sx={{ height: 200 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Skeleton
                      variant="circular"
                      width={50}
                      height={50}
                      sx={{ mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="100%" height={16} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with search and filters */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            backgroundColor: showFilters
              ? alpha(theme.palette.primary.main, 0.1)
              : "transparent",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <FilterList />
        </IconButton>

        {onAddEmployee && (
          <Tooltip title="Add Employee">
            <IconButton
              onClick={onAddEmployee}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department || ""}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {/* Add department options dynamically */}
                  {Array.from(
                    new Set(employees.map((emp) => emp.department))
                  ).map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                  <MenuItem value="on-leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Country</InputLabel>
                <Select
                  value={filters.country || ""}
                  onChange={(e) =>
                    handleFilterChange("country", e.target.value)
                  }
                  label="Country"
                >
                  <MenuItem value="">All Countries</MenuItem>
                  {/* Add country options dynamically */}
                  {Array.from(
                    new Set(employees.map((emp) => emp.address.country))
                  ).map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Results count */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedEmployees.length} of {filteredEmployees.length}{" "}
          employees
        </Typography>
      </Box>

      {/* Employee cards */}
      <Grid container spacing={3}>
        {paginatedEmployees.map((employee) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={employee.id}>
            <Card
              sx={{
                height: "100%",
                cursor: onEmployeeClick ? "pointer" : "default",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: onEmployeeClick ? "translateY(-4px)" : "none",
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => onEmployeeClick?.(employee)}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Employee header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor:
                            theme.palette[getStatusColor(employee.status)].main,
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={employee.photo}
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        border: `2px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Person />
                    </Avatar>
                  </Badge>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                      {employee.firstName} {employee.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {employee.position}
                    </Typography>
                  </Box>
                </Box>

                {/* Employee details */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Email
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                      {employee.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Phone
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" noWrap>
                      {employee.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Business
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" noWrap>
                      {employee.department}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" noWrap>
                      {employee.address.city}, {employee.address.country}
                    </Typography>
                  </Box>
                </Box>

                {/* Status and actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={getStatusLabel(employee.status)}
                    size="small"
                    color={getStatusColor(employee.status)}
                    variant="outlined"
                  />

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {onEmployeeClick && (
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEmployeeClick(employee);
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {onEditEmployee && (
                      <Tooltip title="Edit Employee">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEmployee(employee);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {onDeleteEmployee && (
                      <Tooltip title="Delete Employee">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEmployee(employee);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Empty state */}
      {filteredEmployees.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No employees found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || Object.keys(filters).length > 0
              ? "Try adjusting your search or filters"
              : "Start by adding your first employee"}
          </Typography>
          {onAddEmployee && (
            <Box sx={{ mt: 2 }}>
              <IconButton
                onClick={onAddEmployee}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <Add />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmployeeList;
