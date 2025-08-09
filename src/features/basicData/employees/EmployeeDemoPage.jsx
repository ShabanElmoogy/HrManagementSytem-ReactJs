import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import EmployeeContainer from './EmployeeContainer';

const EmployeeDemoPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 0 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          HR Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Employee Management Module Demo
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" color="text.secondary">
          This demo showcases a comprehensive employee management system with the following features:
        </Typography>
        <Box component="ul" sx={{ mt: 2, pl: 3 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Employee Cards:</strong> Visual representation of employee information with status indicators
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Advanced Search & Filtering:</strong> Search by name, email, or employee ID with department and status filters
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>CRUD Operations:</strong> Add, edit, view, and delete employee records
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Responsive Design:</strong> Works seamlessly on desktop, tablet, and mobile devices
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Pagination:</strong> Efficient handling of large employee datasets
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Form Validation:</strong> Comprehensive client-side validation with error handling
          </Typography>
        </Box>
      </Paper>

      {/* Employee Management Component */}
      <EmployeeContainer />
    </Box>
  );
};

export default EmployeeDemoPage;