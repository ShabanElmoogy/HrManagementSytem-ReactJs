import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { Close, PhotoCamera, Person, Work, ContactMail, LocationOn } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EmployeeModal = ({ open, onClose, onSave, employee, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'Active',
    hireDate: new Date(),
    salary: '',
    location: '',
    manager: '',
    avatar: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [errors, setErrors] = useState({});

  const departments = [
    'Engineering',
    'Human Resources',
    'Marketing',
    'Finance',
    'Sales',
    'Operations',
    'Customer Service',
    'Legal',
    'IT Support'
  ];

  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated'];

  const positions = [
    'Software Engineer',
    'Senior Software Engineer',
    'Team Lead',
    'Project Manager',
    'HR Manager',
    'HR Specialist',
    'Marketing Manager',
    'Marketing Specialist',
    'Financial Analyst',
    'Accountant',
    'Sales Manager',
    'Sales Representative',
    'Operations Manager',
    'Customer Service Representative',
    'Legal Counsel',
    'IT Support Specialist'
  ];

  useEffect(() => {
    if (employee && (mode === 'edit' || mode === 'view')) {
      setFormData({
        ...employee,
        hireDate: new Date(employee.hireDate),
        emergencyContact: employee.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        address: employee.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } else {
      // Reset form for add mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        status: 'Active',
        hireDate: new Date(),
        salary: '',
        location: '',
        manager: '',
        avatar: '',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
    setErrors({});
  }, [employee, mode, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const employeeData = {
      ...formData,
      employeeId: employee?.employeeId || `EMP${Date.now()}`,
      id: employee?.id || Date.now()
    };

    onSave(employeeData);
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Add New Employee';
      case 'edit': return 'Edit Employee';
      case 'view': return 'Employee Details';
      default: return 'Employee';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{getModalTitle()}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Avatar Section */}
            <Grid size={{xs:12}} sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={formData.avatar}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mx: 'auto',
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {!formData.avatar && formData.firstName && formData.lastName && 
                    `${formData.firstName[0]}${formData.lastName[0]}`
                  }
                </Avatar>
                {!isReadOnly && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    size="small"
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                )}
              </Box>
              {mode === 'view' && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={formData.status} 
                    color={formData.status === 'Active' ? 'success' : 'error'}
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={formData.department} 
                    variant="outlined"
                  />
                </Box>
              )}
            </Grid>

            {/* Personal Information */}
            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Personal Information</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isReadOnly}
                required
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isReadOnly}
                required
              />
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isReadOnly}
                required
              />
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={isReadOnly}
                required
              />
            </Grid>

            {/* Work Information */}
              <Grid size={{xs:12,sm:6}}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Work Information</Typography>
              </Box>
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth error={!!errors.position} disabled={isReadOnly} required>
                <InputLabel>Position</InputLabel>
                <Select
                  value={formData.position}
                  label="Position"
                  onChange={(e) => handleInputChange('position', e.target.value)}
                >
                  {positions.map(position => (
                    <MenuItem key={position} value={position}>{position}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth error={!!errors.department} disabled={isReadOnly} required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <FormControl fullWidth disabled={isReadOnly}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <DatePicker
                label="Hire Date"
                value={formData.hireDate}
                onChange={(date) => handleInputChange('hireDate', date)}
                disabled={isReadOnly}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                disabled={isReadOnly}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Manager"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

            {/* Location Information */}
            <Grid size={{xs:12}}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Location Information</Typography>
              </Box>
            </Grid>

              <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Work Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                disabled={isReadOnly}
                required
              />
            </Grid>

              <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

              <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="Zip Code"
                value={formData.address.zipCode}
                onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

              <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="Country"
                value={formData.address.country}
                onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

            {/* Emergency Contact */}
              <Grid size={{xs:12}}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ContactMail sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Emergency Contact</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="Contact Name"
                value={formData.emergencyContact.name}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

            <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>

              <Grid size={{xs:12,sm:4}}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button onClick={handleSave} variant="contained">
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EmployeeModal;