/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  CalendarToday,
  Edit,
  Delete,
  Close,
  CheckCircle,
  Cancel,
  Schedule,
  AccountBalance,
  Description,
  ContactEmergency,
} from "@mui/icons-material";
import { Employee } from "../types/Employee";

interface EmployeeDetailProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onClose?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  onEdit,
  onDelete,
  onClose,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const getStatusIcon = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle />;
      case "inactive":
        return <Cancel />;
      case "terminated":
        return <Cancel />;
      case "on-leave":
        return <Schedule />;
      default:
        return <CheckCircle />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteConfirm = () => {
    onDelete?.(employee);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      {/* Top Section with Photo and Basic Data */}
      <Card sx={{ maxWidth: 1200, mx: "auto", mb: 3 }}>
        <CardContent sx={{ pb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: theme.palette[getStatusColor(employee.status)].main,
                      border: `3px solid ${theme.palette.background.paper}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getStatusIcon(employee.status)}
                  </Box>
                }
              >
                <Avatar
                  src={employee.photo}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  <Person sx={{ fontSize: 60 }} />
                </Avatar>
              </Badge>

              <Box sx={{ ml: 4, flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {employee.firstName} {employee.lastName}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                  {employee.position}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {employee.department} • Employee ID: {employee.employeeId}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    icon={<LocationOn />}
                    label={`${employee.address.city}, ${employee.address.country}`}
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    icon={<CalendarToday />}
                    label={`Hired ${formatDate(employee.hireDate)}`}
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    icon={<Business />}
                    label={employee.employmentDetails.employmentType.replace('-', ' ')}
                    variant="outlined"
                    size="medium"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('-', ' ')}
                    color={getStatusColor(employee.status)}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<Email />}
                    label={employee.email}
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    icon={<Phone />}
                    label={employee.phone}
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {onEdit && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => onEdit(employee)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${alpha(theme.palette.primary.dark, 0.8)})`
                    }
                  }}
                >
                  Edit Profile
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Delete Employee
                </Button>
              )}

              {onClose && (
                <IconButton
                  onClick={onClose}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.grey[500], 0.2)
                    }
                  }}
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Card sx={{ maxWidth: 1200, mx: "auto" }}>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: 500,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Personal Info" />
            <Tab label="Employment" />
            <Tab label="Salary & Benefits" />
            <Tab label="Documents" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          {/* Overview Tab */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <Person sx={{ mr: 1 }} />
                    Contact Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email
                        sx={{ mr: 2, color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography>{employee.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone
                        sx={{ mr: 2, color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography>{employee.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn
                        sx={{ mr: 2, color: "text.secondary", fontSize: 20 }}
                      />
                      <Typography>
                        {employee.address.street}, {employee.address.city},{" "}
                        {employee.address.state} {employee.address.postalCode},{" "}
                        {employee.address.country}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <Business sx={{ mr: 1 }} />
                    Employment Details
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography>{employee.department}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Position
                      </Typography>
                      <Typography>{employee.position}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employment Type
                      </Typography>
                      <Typography>
                        {employee.employmentDetails.employmentType.replace(
                          "-",
                          " "
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Work Location
                      </Typography>
                      <Typography>
                        {employee.employmentDetails.workLocation}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Personal Info Tab */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Basic Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography>
                        {employee.firstName} {employee.lastName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employee ID
                      </Typography>
                      <Typography>{employee.employeeId}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography>
                        {employee.birthDate
                          ? formatDate(employee.birthDate)
                          : "Not specified"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography>
                        {employee.gender
                          ? employee.gender.charAt(0).toUpperCase() +
                            employee.gender.slice(1)
                          : "Not specified"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography>
                        {employee.maritalStatus
                          ? employee.maritalStatus.charAt(0).toUpperCase() +
                            employee.maritalStatus.slice(1)
                          : "Not specified"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nationality
                      </Typography>
                      <Typography>{employee.nationality}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <ContactEmergency sx={{ mr: 1 }} />
                    Emergency Contact
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography>{employee.emergencyContact.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Relationship
                      </Typography>
                      <Typography>
                        {employee.emergencyContact.relationship}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography>{employee.emergencyContact.phone}</Typography>
                    </Box>
                    {employee.emergencyContact.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography>
                          {employee.emergencyContact.email}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Employment Tab */}
          <Grid container spacing={3}>
             <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Employment Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employment Type
                      </Typography>
                      <Typography>
                        {employee.employmentDetails.employmentType.replace(
                          "-",
                          " "
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Work Location
                      </Typography>
                      <Typography>
                        {employee.employmentDetails.workLocation}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Work Schedule
                      </Typography>
                      <Typography>
                        {employee.employmentDetails.workSchedule}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Hire Date
                      </Typography>
                      <Typography>{formatDate(employee.hireDate)}</Typography>
                    </Box>
                    {employee.employmentDetails.probationEndDate && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Probation End Date
                        </Typography>
                        <Typography>
                          {formatDate(
                            employee.employmentDetails.probationEndDate
                          )}
                        </Typography>
                      </Box>
                    )}
                    {employee.employmentDetails.contractEndDate && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Contract End Date
                        </Typography>
                        <Typography>
                          {formatDate(
                            employee.employmentDetails.contractEndDate
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

             <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Manager Information
                  </Typography>
                  {employee.managerId ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Typography color="text.secondary">
                        Manager information would be displayed here when
                        available
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      No manager assigned
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Salary & Benefits Tab */}
          <Grid container spacing={3}>
             <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <AccountBalance sx={{ mr: 1 }} />
                    Salary Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Base Salary
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(
                          employee.salaryInfo.baseSalary,
                          employee.salaryInfo.currency
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.salaryInfo.payFrequency}
                      </Typography>
                    </Box>

                    {employee.salaryInfo.allowances.length > 0 && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Allowances
                        </Typography>
                        {employee.salaryInfo.allowances.map(
                          (allowance, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {allowance.type}
                              </Typography>
                              <Typography variant="body2">
                                {formatCurrency(
                                  allowance.amount,
                                  employee.salaryInfo.currency
                                )}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}

                    {employee.salaryInfo.deductions.length > 0 && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Deductions
                        </Typography>
                        {employee.salaryInfo.deductions.map(
                          (deduction, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {deduction.type}
                              </Typography>
                              <Typography variant="body2" color="error">
                                -
                                {formatCurrency(
                                  deduction.amount,
                                  employee.salaryInfo.currency
                                )}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Banking Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Bank Name
                      </Typography>
                      <Typography>
                        {employee.salaryInfo.bankDetails.bankName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography fontFamily="monospace">
                        ****
                        {employee.salaryInfo.bankDetails.accountNumber.slice(
                          -4
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Type
                      </Typography>
                      <Typography>
                        {employee.salaryInfo.bankDetails.accountType}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          {/* Documents Tab */}
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <Description sx={{ mr: 1 }} />
                Employee Documents
              </Typography>

              {employee.documents.length > 0 ? (
                <Grid container spacing={2}>
                  {employee.documents.map((doc) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Description sx={{ mr: 1, color: "primary.main" }} />
                          <Typography variant="subtitle2" sx={{ flex: 1 }}>
                            {doc.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Type: {doc.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Uploaded: {formatDate(doc.uploadedAt)}
                        </Typography>
                        {doc.expiryDate && (
                          <Typography
                            variant="caption"
                            color="warning.main"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            Expires: {formatDate(doc.expiryDate)}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => window.open(doc.fileUrl, "_blank")}
                        >
                          View Document
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Description
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No documents uploaded
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employee documents will appear here when uploaded
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {employee.firstName}{" "}
            {employee.lastName}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeDetail;
