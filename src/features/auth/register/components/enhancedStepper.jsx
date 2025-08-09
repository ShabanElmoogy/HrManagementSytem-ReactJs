import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// Custom StepConnector with simplified styling
const CustomConnector = styled(StepConnector)(
  ({ theme, completed, active }) => ({
    "& .MuiStepConnector-line": {
      height: 3,
      border: 0,
      backgroundColor: completed
        ? theme.palette.purple.completed
        : active
        ? theme.palette.purple.primary
        : theme.palette.purple.connector,
      borderRadius: 4,
      transition: theme.transitions.create("background-color", {
        duration: 300,
      }),
    },
  })
);

// Improved icon container with better color choices
const StepIconContainer = styled(Box)(({ theme, active, completed }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: active
    ? "transparent"
    : completed
    ? theme.palette.purple.completedLight
    : theme.palette.purple.inactive,
  backgroundImage: active
    ? `linear-gradient(135deg, 
         ${theme.palette.purple.primary}, 
         ${theme.palette.purple.primaryDark})`
    : "none",
  transform: active ? "scale(1.08)" : "scale(1)",
  transition: theme.transitions.create(
    [
      "background-color",
      "color",
      "box-shadow",
      "transform",
      "background-image",
    ],
    { duration: 200 }
  ),
}));

// Custom CheckCircleIcon with improved styling
const CompletedCheckIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.purple.iconCompleted,
  filter: `drop-shadow(0 2px 3px ${alpha(
    theme.palette.purple.completed,
    0.3
  )})`,
  transition: theme.transitions.create("all", { duration: 200 }),
}));

// Custom Step Icon Component (modern approach)
const CustomStepIcon = ({ active, completed, step }) => {
  const theme = useTheme();

  return (
    <StepIconContainer active={active || false} completed={completed || false}>
      {completed ? (
        <CompletedCheckIcon />
      ) : (
        React.cloneElement(step.icon, {
          sx: {
            fontSize: "1.25rem",
            color: active
              ? "#fff"
              : theme.palette.purple.inactiveIcon,
          },
        })
      )}
    </StepIconContainer>
  );
};

/**
 * Enhanced Stepper with improved icon colors for inactive and completed states
 */
export const EnhancedStepper = ({
  activeStep = 0,
  isTablet = false,
  formSteps = [],
}) => {
  const theme = useTheme();

  return (
    <Stepper
      alternativeLabel={isTablet}
      activeStep={activeStep}
      sx={{
        width: "100%",
        mb: -3,
        "& .MuiStepLabel-label": { mt: 1 },
        padding: isTablet ? 1 : 2,
      }}
      connector={<CustomConnector />}
    >
      {formSteps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        return (
          <Step key={step.id || index} completed={isCompleted}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} step={step} />
              )}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isActive
                    ? theme.palette.purple.white
                    : isCompleted
                    ? theme.palette.purple.completed
                    : theme.palette.purple.inactive,
                  fontWeight: isActive ? 600 : isCompleted ? 500 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};