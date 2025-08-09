import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Avatar,
  Typography,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import { Timeline } from '@/shared/components';
import { generateEmployeeTimeline } from '../data/employeeTimelineData';
import {
  ArrowBack,
  Edit,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Person,
  FamilyRestroom,
  School,
  Assignment,
  AttachMoney,
  Security,
  HealthAndSafety,
  Timeline as TimelineIcon,
  Assessment,
  Notifications,
  Close,
  TrendingUp,
  Star,
  CheckCircle,
  Schedule,
  BusinessCenter,
  Home,
  ContactPhone,
  Language,
  Cake,
  Wc,
  Flag,
  History,
  Delete
} from '@mui/icons-material';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Basic Info Tab Component
const BasicInfoTab = ({ employee }) => {
  const theme = useTheme();
  
  return (
    <Fade in timeout={400}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Person sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
              </Stack>
              <List dense>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Full Name</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{`${employee.firstName} ${employee.lastName}`}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Assignment sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Employee ID</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.employeeId}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Email</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.email}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Phone</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.phone}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Cake sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.dateOfBirth || 'Not provided'}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Wc sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Gender</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.gender || 'Not specified'}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Flag sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Nationality</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.nationality || 'Not provided'}</Typography>}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Home sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="h6" fontWeight="bold">Address Information</Typography>
              </Stack>
              <List dense>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Current Address</Typography>}
                    secondary={
                      <Typography variant="body1" fontWeight="medium">
                        {employee.address ? 
                          `${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.zipCode}` : 
                          'Not provided'
                        }
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Language sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Country</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.address?.country || 'Not provided'}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ContactPhone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.emergencyContact?.name || 'Not provided'}</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="subtitle2" color="text.secondary">Emergency Phone</Typography>}
                    secondary={<Typography variant="body1" fontWeight="medium">{employee.emergencyContact?.phone || 'Not provided'}</Typography>}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fade>
  );
};

// Family Tab Component
const FamilyTab = ({ employee }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Marital Status</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Status" secondary={employee.maritalStatus || 'Not specified'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Spouse Name" secondary={employee.spouseName || 'N/A'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Anniversary Date" secondary={employee.anniversaryDate || 'N/A'} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Dependents</Typography>
          <Typography variant="body2" color="text.secondary">
            Number of Children: {employee.numberOfChildren || 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Employment Tab Component
const EmploymentTab = ({ employee }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Current Position</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Job Title" secondary={employee.position} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Department" secondary={employee.department} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Manager" secondary={employee.manager || 'Not assigned'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Employment Type" secondary={employee.employmentType || 'Full-time'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Hire Date" secondary={new Date(employee.hireDate).toLocaleDateString()} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Status" secondary={employee.status} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Work Schedule</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Work Hours" secondary={employee.workHours || '40 hours/week'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Shift" secondary={employee.shift || 'Day Shift'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Location" secondary={employee.location} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Education Tab Component
const EducationTab = ({ employee }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Educational Background</Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Highest Degree" 
            secondary={employee.education?.degree || 'Not provided'} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Institution" 
            secondary={employee.education?.institution || 'Not provided'} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Year of Graduation" 
            secondary={employee.education?.graduationYear || 'Not provided'} 
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Certifications" 
            secondary={employee.certifications?.join(', ') || 'None'} 
          />
        </ListItem>
      </List>
    </CardContent>
  </Card>
);

// Compensation Tab Component
const CompensationTab = ({ employee }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Salary Information</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Base Salary" secondary={employee.salary ? `$${employee.salary.toLocaleString()}` : 'Confidential'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Pay Frequency" secondary={employee.payFrequency || 'Monthly'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Currency" secondary={employee.currency || 'USD'} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Benefits</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Health Insurance" secondary={employee.benefits?.healthInsurance ? 'Enrolled' : 'Not enrolled'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Retirement Plan" secondary={employee.benefits?.retirement ? 'Enrolled' : 'Not enrolled'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Vacation Days" secondary={`${employee.vacationDays || 20} days/year`} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Performance Tab Component
const PerformanceTab = ({ employee }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">Overall Rating</Typography>
            <LinearProgress 
              variant="determinate" 
              value={employee.performanceRating || 75} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption">{employee.performanceRating || 75}%</Typography>
          </Box>
          <List dense>
            <ListItem>
              <ListItemText primary="Last Review Date" secondary={employee.lastReviewDate || 'Not available'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Next Review Date" secondary={employee.nextReviewDate || 'Not scheduled'} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Goals & Objectives</Typography>
          <Typography variant="body2" color="text.secondary">
            Current goals and performance objectives will be displayed here.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Documents Tab Component
const DocumentsTab = ({ employee }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Employee Documents</Typography>
      <List>
        <ListItem>
          <ListItemIcon><Assignment /></ListItemIcon>
          <ListItemText primary="Employment Contract" secondary="Signed on hire date" />
        </ListItem>
        <ListItem>
          <ListItemIcon><Security /></ListItemIcon>
          <ListItemText primary="ID Verification" secondary="Verified" />
        </ListItem>
        <ListItem>
          <ListItemIcon><HealthAndSafety /></ListItemIcon>
          <ListItemText primary="Health Records" secondary="Up to date" />
        </ListItem>
      </List>
    </CardContent>
  </Card>
);

// Time & Attendance Tab Component
const TimeAttendanceTab = ({ employee }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Days Present (This Month)" secondary="22 days" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Days Absent" secondary="1 day" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Late Arrivals" secondary="2 times" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Overtime Hours" secondary="8 hours" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Leave Balance</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Annual Leave" secondary="15 days remaining" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Sick Leave" secondary="5 days remaining" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personal Leave" secondary="3 days remaining" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Career Timeline Tab Component
const CareerTimelineTab = ({ employee }) => {
  const timelineData = generateEmployeeTimeline(employee);
  
  return (
    <Box>
      <Timeline 
        items={timelineData}
        title={`${employee.firstName} ${employee.lastName}'s Career Journey`}
        showOppositeContent={true}
      />
    </Box>
  );
};

const EmployeeDetailView = ({ employee, onClose, onEdit, onDelete }) => {
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteEmployee = async (employeeToDelete) => {
    setDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onDelete) {
        onDelete(employeeToDelete);
      }
      
      // Close the detail view after successful deletion
      onClose();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on leave': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'inactive': return <Schedule sx={{ fontSize: 16 }} />;
      case 'on leave': return <Schedule sx={{ fontSize: 16 }} />;
      default: return <Schedule sx={{ fontSize: 16 }} />;
    }
  };

  // Enhanced dashboard metrics with icons and colors
  const dashboardMetrics = [
    { 
      label: 'Years of Service', 
      value: Math.floor((new Date() - new Date(employee.hireDate)) / (365.25 * 24 * 60 * 60 * 1000)),
      icon: <TimelineIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1)
    },
    { 
      label: 'Performance Score', 
      value: `${employee.performanceRating || 75}%`,
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1)
    },
    { 
      label: 'Leave Balance', 
      value: `${employee.leaveBalance || 23} days`,
      icon: <Schedule />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1)
    },
    { 
      label: 'Active Projects', 
      value: employee.activeProjects || 3,
      icon: <BusinessCenter />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1)
    }
  ];

  return (
    <Fade in timeout={300}>
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        overflow: 'auto', 
        bgcolor: 'background.default',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
      }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 2, position: 'sticky', top: 0, zIndex: 1000 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={onClose} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" fontWeight="bold">
                Employee Details
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => onEdit && onEdit(employee)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ px: 2 }}>
          {/* First Row: Employee Image, Basic Data, and Simple Dashboard */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Employee Image and Basic Info */}
            <Grid size={{ xs: 12, md: 4}}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={employee.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: employee.avatar ? 'transparent' : 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {!employee.avatar && `${employee.firstName[0]}${employee.lastName[0]}`}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {`${employee.firstName} ${employee.lastName}`}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {employee.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {employee.employeeId}
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={employee.status}
                      color={getStatusColor(employee.status)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      label={employee.department} 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{employee.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{employee.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{employee.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Joined: {new Date(employee.hireDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Simple Dashboard */}
            <Grid size={{xs:12,md:8}}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Overview
                  </Typography>
                  <Grid container spacing={2}>
                    {dashboardMetrics.map((metric, index) => (
                      <Grid size={{ xs: 6, sm: 3}} key={index}>
                        <Zoom in timeout={300 + index * 100}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              textAlign: 'center', 
                              p: 2,
                              background: metric.bgColor,
                              border: `1px solid ${alpha(metric.color, 0.2)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${alpha(metric.color, 0.15)}`,
                                border: `1px solid ${alpha(metric.color, 0.3)}`
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              <Box sx={{ color: metric.color, mr: 1 }}>
                                {metric.icon}
                              </Box>
                            </Box>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold"
                              sx={{ color: metric.color, mb: 0.5 }}
                            >
                              {metric.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {metric.label}
                            </Typography>
                          </Card>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Badge color="success" variant="dot">
                          <Notifications />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Performance review completed" 
                        secondary="2 days ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Badge color="info" variant="dot">
                          <Assignment />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Training module completed" 
                        secondary="1 week ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Badge color="warning" variant="dot">
                          <TimelineIcon />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Leave request approved" 
                        secondary="2 weeks ago"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Second Row: Tabs with Employee Information */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 2 }}
              >
                <Tab icon={<Person />} label="Basic Info" />
                <Tab icon={<FamilyRestroom />} label="Family" />
                <Tab icon={<Work />} label="Employment" />
                <Tab icon={<School />} label="Education" />
                <Tab icon={<AttachMoney />} label="Compensation" />
                <Tab icon={<Assessment />} label="Performance" />
                <Tab icon={<Assignment />} label="Documents" />
                <Tab icon={<Schedule />} label="Time & Attendance" />
                <Tab icon={<History />} label="Career Timeline" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <BasicInfoTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <FamilyTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <EmploymentTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <EducationTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <CompensationTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <PerformanceTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <DocumentsTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={7}>
              <TimeAttendanceTab employee={employee} />
            </TabPanel>
            <TabPanel value={tabValue} index={8}>
              <CareerTimelineTab employee={employee} />
            </TabPanel>
          </Card>
        </Box>

        {/* Delete Dialog */}
        <DeleteEmployeeDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          employee={employee}
          onConfirm={handleDeleteEmployee}
          loading={deleteLoading}
        />
      </Box>
    </Fade>
  );
};

export default EmployeeDetailView;