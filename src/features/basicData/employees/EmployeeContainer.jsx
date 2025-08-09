import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import EmployeeList from './components/EmployeeList';
import { dummyEmployees } from './data/dummyEmployees';

const EmployeeContainer = () => {
  const [employees, setEmployees] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize with dummy data
  useEffect(() => {
    setEmployees(dummyEmployees);
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleAddEmployee = (employeeData) => {
    try {
      const newEmployee = {
        ...employeeData,
        id: Math.max(...employees.map(emp => emp.id), 0) + 1,
        employeeId: `EMP${String(Math.max(...employees.map(emp => parseInt(emp.employeeId.replace('EMP', ''))), 0) + 1).padStart(3, '0')}`
      };
      
      setEmployees(prev => [...prev, newEmployee]);
      showNotification(`Employee ${newEmployee.firstName} ${newEmployee.lastName} added successfully!`);
    } catch (error) {
      showNotification('Failed to add employee. Please try again.', 'error');
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = (employeeId, updatedData) => {
    try {
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, ...updatedData }
            : emp
        )
      );
      showNotification(`Employee ${updatedData.firstName} ${updatedData.lastName} updated successfully!`);
    } catch (error) {
      showNotification('Failed to update employee. Please try again.', 'error');
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    try {
      const employeeToDelete = employees.find(emp => emp.id === employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      showNotification(`Employee ${employeeToDelete?.firstName} ${employeeToDelete?.lastName} deleted successfully!`);
    } catch (error) {
      showNotification('Failed to delete employee. Please try again.', 'error');
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <Box>
      <EmployeeList
        employees={employees}
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeContainer;