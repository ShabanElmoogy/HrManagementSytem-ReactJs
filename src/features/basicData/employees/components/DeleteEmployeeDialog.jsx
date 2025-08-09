import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Slide,
  useTheme,
  alpha,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  DeleteForever,
  Warning,
  Person,
  Work,
  Assignment,
  Schedule,
  Close,
  ErrorOutline,
  CheckCircle,
  Info,
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteEmployeeDialog = ({ 
  open, 
  onClose, 
  employee, 
  onConfirm, 
  loading = false 
}) => {
  const theme = useTheme();
  const [confirmationText, setConfirmationText] = useState('');
  const [acknowledgeConsequences, setAcknowledgeConsequences] = useState(false);
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation

  const expectedConfirmationText = `DELETE ${employee?.firstName} ${employee?.lastName}`;

  const handleClose = () => {
    setConfirmationText('');
    setAcknowledgeConsequences(false);
    setStep(1);
    onClose();
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStep(2);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmationText === expectedConfirmationText && acknowledgeConsequences) {
      onConfirm(employee);
      handleClose();
    }
  };

  const isConfirmationValid = confirmationText === expectedConfirmationText && acknowledgeConsequences;

  const consequences = [
    {
      icon: <Person sx={{ color: theme.palette.error.main }} />,
      title: 'Employee Record',
      description: 'All personal information and employment history will be permanently removed'
    },
    {
      icon: <Work sx={{ color: theme.palette.warning.main }} />,
      title: 'Active Projects',
      description: 'Employee will be removed from all active projects and assignments'
    },
    {
      icon: <Assignment sx={{ color: theme.palette.info.main }} />,
      title: 'Documents & Files',
      description: 'All uploaded documents and files will be permanently deleted'
    },
    {
      icon: <Schedule sx={{ color: theme.palette.secondary.main }} />,
      title: 'Time Records',
      description: 'Attendance records and time logs will be archived but not accessible'
    }
  ];

  if (!employee) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={false}
      onClick={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
        },
        onClick: (e) => e.stopPropagation()
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          pb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`
              }}
            >
              <DeleteForever sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                Delete Employee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step === 1 ? 'Review consequences before proceeding' : 'Confirm deletion'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {step === 1 ? (
          // Step 1: Warning and Employee Info
          <Box sx={{ p: 3 }}>
            {/* Employee Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={employee.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: employee.avatar ? 'transparent' : 'primary.main',
                    fontSize: '1.5rem'
                  }}
                >
                  {!employee.avatar && `${employee.firstName[0]}${employee.lastName[0]}`}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {`${employee.firstName} ${employee.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {employee.position} • {employee.department}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={employee.status}
                      size="small"
                      color={employee.status === 'Active' ? 'success' : 'default'}
                    />
                    <Chip
                      label={`ID: ${employee.employeeId}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Box>
            </Paper>

            {/* Warning Alert */}
            <Alert
              severity="error"
              icon={<Warning />}
              sx={{
                mb: 3,
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                This action cannot be undone!
              </Typography>
              <Typography variant="body2">
                Deleting this employee will permanently remove all associated data from the system. 
                Please review the consequences below carefully.
              </Typography>
            </Alert>

            {/* Consequences List */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              What will be affected:
            </Typography>
            
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              {consequences.map((consequence, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      {consequence.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {consequence.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {consequence.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < consequences.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {/* Additional Warning */}
            <Alert
              severity="info"
              icon={<Info />}
              sx={{ mt: 3 }}
            >
              <Typography variant="body2">
                <strong>Alternative:</strong> Consider deactivating the employee instead of deleting. 
                This preserves historical data while removing access to the system.
              </Typography>
            </Alert>
          </Box>
        ) : (
          // Step 2: Confirmation
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              icon={<ErrorOutline />}
              sx={{ mb: 3 }}
            >
              <Typography variant="body1" fontWeight="medium">
                Final confirmation required to delete employee
              </Typography>
            </Alert>

            {/* Employee Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                background: alpha(theme.palette.error.main, 0.05),
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={employee.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    bgcolor: employee.avatar ? 'transparent' : 'error.main'
                  }}
                >
                  {!employee.avatar && `${employee.firstName[0]}${employee.lastName[0]}`}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {`${employee.firstName} ${employee.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employee.position} • ID: {employee.employeeId}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Confirmation Text Input */}
            <Typography variant="body1" gutterBottom>
              Type <strong>{expectedConfirmationText}</strong> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={expectedConfirmationText}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: confirmationText === expectedConfirmationText ? 'success.main' : 'error.main',
                  }
                }
              }}
              InputProps={{
                endAdornment: confirmationText === expectedConfirmationText && (
                  <CheckCircle sx={{ color: 'success.main' }} />
                )
              }}
            />

            {/* Acknowledgment Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={acknowledgeConsequences}
                  onChange={(e) => setAcknowledgeConsequences(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography variant="body2">
                  I understand that this action is permanent and cannot be undone
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            {/* Final Warning */}
            {isConfirmationValid && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  You are about to permanently delete this employee record. 
                  Click "Delete Employee" to proceed.
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          background: alpha(theme.palette.background.default, 0.5),
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        
        {step === 1 ? (
          <Button
            onClick={handleNextStep}
            variant="contained"
            color="warning"
            size="large"
            startIcon={<Warning />}
            sx={{ minWidth: 120 }}
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            size="large"
            disabled={!isConfirmationValid || loading}
            startIcon={<DeleteForever />}
            sx={{
              minWidth: 160,
              background: isConfirmationValid 
                ? `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`
                : undefined,
              '&:hover': {
                background: isConfirmationValid 
                  ? `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`
                  : undefined,
              }
            }}
          >
            {loading ? 'Deleting...' : 'Delete Employee'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEmployeeDialog;