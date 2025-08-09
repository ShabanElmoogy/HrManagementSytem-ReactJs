import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Avatar, Chip, IconButton, Box, Typography, Grid } from '@mui/material';
import { Edit, Delete, Email, Phone, LocationOn, Work } from '@mui/icons-material';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';

const EmployeeCard = ({ employee, onEdit, onDelete, onViewDetails }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (employeeToDelete) => {
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onDelete) {
        onDelete(employeeToDelete);
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDialogClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Engineering': 'primary',
      'Human Resources': 'secondary',
      'Marketing': 'info',
      'Finance': 'warning',
      'Sales': 'success',
      'Operations': 'error'
    };
    return colors[department] || 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        cursor: 'pointer'
      }}
      onClick={() => onViewDetails && onViewDetails(employee)}
    >
      <CardHeader
        avatar={
          <Avatar
            src={employee.avatar}
            sx={{ 
              width: 60, 
              height: 60,
              bgcolor: employee.avatar ? 'transparent' : 'primary.main'
            }}
          >
            {!employee.avatar && `${employee.firstName[0]}${employee.lastName[0]}`}
          </Avatar>
        }
        action={
          <Box>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(employee);
              }}
              sx={{ mr: 1 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color="error"
              onClick={handleDeleteClick}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        }
        title={
          <Typography variant="h6" component="div" fontWeight="bold">
            {`${employee.firstName} ${employee.lastName}`}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            ID: {employee.employeeId}
          </Typography>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={employee.status} 
            color={getStatusColor(employee.status)}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip 
            label={employee.department} 
            color={getDepartmentColor(employee.department)}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
        </Box>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Work sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {employee.position}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {employee.email}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12}}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {employee.phone}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {employee.location}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            Joined: {new Date(employee.hireDate).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      {/* Delete Dialog */}
      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        employee={employee}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </Card>
  );
};

export default EmployeeCard;