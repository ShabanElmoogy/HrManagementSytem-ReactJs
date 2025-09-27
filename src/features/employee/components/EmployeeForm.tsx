/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  ArrowBack,
  ArrowForward,
  Save,
  PhotoCamera,
  CalendarToday,
  AccountBalance,
  ContactEmergency
} from '@mui/icons-material';
import { Employee } from '../types/Employee';

// Mock data for dropdowns
const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const POSITIONS = ['Software Engineer', 'Senior Engineer', 'Manager', 'Director', 'VP', 'CEO'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'intern'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia'];

const steps = ['Basic Information', 'Employment Details'];

interface EmployeeFormProps {
  mode: 'create' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    employmentDetails: {
      employmentType: 'full-time',
      workLocation: '',
      workSchedule: 'Monday-Friday, 9AM-5PM'
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: 'USA',
      postalCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    salaryInfo: {
      baseSalary: 0,
      currency: 'USD',
      payFrequency: 'monthly',
      allowances: [],
      deductions: [],
      bankDetails: {
        bankName: '',
        accountNumber: '',
        accountType: 'checking'
      }
    }
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      // Load employee data for editing
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setEmployee({
          id: '1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1-555-0123',
          photo: 'https://via.placeholder.com/150',
          position: 'Software Engineer',
          department: 'Engineering',
          hireDate: '2023-01-15',
          birthDate: '1990-05-20',
          gender: 'male',
          nationality: 'American',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001'
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1-555-0124',
            email: 'jane.doe@email.com'
          },
          employmentDetails: {
            employmentType: 'full-time',
            workLocation: 'New York Office',
            workSchedule: 'Monday-Friday, 9AM-5PM',
            probationEndDate: '2023-04-15'
          },
          salaryInfo: {
            baseSalary: 85000,
            currency: 'USD',
            payFrequency: 'monthly',
            allowances: [],
            deductions: [],
            bankDetails: {
              bankName: 'Chase Bank',
              accountNumber: '****1234',
              accountType: 'checking'
            }
          },
          status: 'active',
          createdAt: '2023-01-10T00:00:00Z',
          updatedAt: '2023-01-10T00:00:00Z'
        });
        setLoading(false);
      }, 500);
    }
  }, [mode, id]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === 'create') {
      navigate('/basic-data/employees');
    } else {
      navigate(`/basic-data/employees/${id}`);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: keyof Employee, field: string, value: any) => {
    setEmployee(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [field]: value
      }
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Photo Upload */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Profile Photo
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={employee.photo}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }}
                  >
                    <Person sx={{ fontSize: 60 }} />
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: -8,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                    size="small"
                  >
                    <PhotoCamera />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Click to upload a new photo
                </Typography>
              </Card>
            </Grid>

            {/* Basic Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Basic Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={employee.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={employee.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={employee.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={employee.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={employee.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        label="Department"
                      >
                        {DEPARTMENTS.map(dept => (
                          <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Position</InputLabel>
                      <Select
                        value={employee.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        label="Position"
                      >
                        {POSITIONS.map(pos => (
                          <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Address Information */}
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} />
                  Address Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={employee.address?.street || ''}
                      onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={employee.address?.city || ''}
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={employee.address?.state || ''}
                      onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={employee.address?.country || 'USA'}
                        onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                        label="Country"
                      >
                        {COUNTRIES.map(country => (
                          <MenuItem key={country} value={country}>{country}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={employee.address?.postalCode || ''}
                      onChange={(e) => handleNestedInputChange('address', 'postalCode', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {/* Employment Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ mr: 1 }} />
                  Employment Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        value={employee.employmentDetails?.employmentType || 'full-time'}
                        onChange={(e) => handleNestedInputChange('employmentDetails', 'employmentType', e.target.value)}
                        label="Employment Type"
                      >
                        {EMPLOYMENT_TYPES.map(type => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Work Location"
                      value={employee.employmentDetails?.workLocation || ''}
                      onChange={(e) => handleNestedInputChange('employmentDetails', 'workLocation', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Work Schedule"
                      value={employee.employmentDetails?.workSchedule || ''}
                      onChange={(e) => handleNestedInputChange('employmentDetails', 'workSchedule', e.target.value)}
                      placeholder="e.g., Monday-Friday, 9AM-5PM"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Hire Date"
                      type="date"
                      value={employee.hireDate || ''}
                      onChange={(e) => handleInputChange('hireDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Salary Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  Salary Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth
                      label="Base Salary"
                      type="number"
                      value={employee.salaryInfo?.baseSalary || ''}
                      onChange={(e) => handleNestedInputChange('salaryInfo', 'baseSalary', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={employee.salaryInfo?.currency || 'USD'}
                        onChange={(e) => handleNestedInputChange('salaryInfo', 'currency', e.target.value)}
                        label="Currency"
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                        <MenuItem value="CAD">CAD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Pay Frequency</InputLabel>
                      <Select
                        value={employee.salaryInfo?.payFrequency || 'monthly'}
                        onChange={(e) => handleNestedInputChange('salaryInfo', 'payFrequency', e.target.value)}
                        label="Pay Frequency"
                      >
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="annually">Annually</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Emergency Contact */}
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <ContactEmergency sx={{ mr: 1 }} />
                  Emergency Contact
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Contact Name"
                      value={employee.emergencyContact?.name || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Relationship"
                      value={employee.emergencyContact?.relationship || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Contact Phone"
                      value={employee.emergencyContact?.phone || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      type="email"
                      value={employee.emergencyContact?.email || ''}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'email', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/basic-data/employees" color="inherit">
            Employees
          </MuiLink>
          <Typography color="text.primary">
            {mode === 'create' ? 'Create Employee' : 'Edit Employee'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {mode === 'create' ? 'Create New Employee' : 'Edit Employee'}
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/basic-data/employees')}
            variant="outlined"
          >
            Back to Employees
          </Button>
        </Box>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form Content */}
      <Box sx={{ px: 3 }}>
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={<Save />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${alpha(theme.palette.primary.dark, 0.8)})`
                  }
                }}
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Save Changes'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${alpha(theme.palette.primary.dark, 0.8)})`
                  }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeForm;