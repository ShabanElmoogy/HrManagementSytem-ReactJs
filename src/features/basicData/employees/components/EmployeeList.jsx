import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Fab,
  Pagination
} from '@mui/material';
import { Search, Add, FilterList } from '@mui/icons-material';
import EmployeeCard from './EmployeeCard';
import EmployeeModal from './EmployeeModal';
import EmployeeDetailView from './EmployeeDetailView';

const EmployeeList = ({ employees, onAddEmployee, onEditEmployee, onDeleteEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [showDetailView, setShowDetailView] = useState(false);

  const itemsPerPage = 12;

  // Get unique departments and statuses for filters
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].sort(),
    [employees]
  );

  const statuses = useMemo(() => 
    [...new Set(employees.map(emp => emp.status))].sort(),
    [employees]
  );

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || employee.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  // Paginate results
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailView(true);
  };

  const handleDeleteEmployee = (employee) => {
    // The EmployeeCard component now handles the delete dialog internally
    // This function will be called after the user confirms deletion in the dialog
    onDeleteEmployee && onDeleteEmployee(employee.id);
  };

  const handleModalSave = (employeeData) => {
    if (modalMode === 'add') {
      onAddEmployee && onAddEmployee(employeeData);
    } else if (modalMode === 'edit') {
      onEditEmployee && onEditEmployee(selectedEmployee.id, employeeData);
    }
    setModalOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const handleEditFromDetailView = (employee) => {
    setShowDetailView(false);
    setSelectedEmployee(employee);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedEmployee(null);
  };

  // If showing detail view, render only the detail view
  if (showDetailView && selectedEmployee) {
    return (
      <EmployeeDetailView
        employee={selectedEmployee}
        onClose={handleCloseDetailView}
        onEdit={handleEditFromDetailView}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Employee Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddEmployee}
          size="large"
        >
          Add Employee
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
        <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
        <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
        <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
          {filteredEmployees.length !== employees.length && ` (filtered from ${employees.length} total)`}
        </Typography>
      </Box>

      {/* Employee Grid */}
      {paginatedEmployees.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedEmployees.map((employee) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={employee.id}>
                <EmployeeCard
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                  onViewDetails={handleViewEmployee}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No employees found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || departmentFilter || statusFilter
              ? 'Try adjusting your search criteria or filters'
              : 'Get started by adding your first employee'
            }
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Paper>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add employee"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={handleAddEmployee}
      >
        <Add />
      </Fab>

      {/* Employee Modal */}
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        employee={selectedEmployee}
        mode={modalMode}
      />
    </Box>
  );
};

export default EmployeeList;