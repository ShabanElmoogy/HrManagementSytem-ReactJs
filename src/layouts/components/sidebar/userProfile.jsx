/* eslint-disable react/prop-types */
// UserProfile.jsx
import {
  Avatar,
  Typography,
  Box,
  useTheme,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SecurityIcon from "@mui/icons-material/Security";

// Styled Badge component for online status with pulsating effect
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

// Styled background element with gradient effect
const GradientBackground = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}22, ${theme.palette.primary.light}33)`,
  padding: theme.spacing(2, 0, 2.5, 0),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1, 1.5, 1),
  transition: "all 0.3s ease",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: `linear-gradient(to right, 
                  ${theme.palette.background.paper}00, 
                  ${theme.palette.primary.light}20, 
                  ${theme.palette.background.paper}00)`,
    transform: "translateX(-100%)",
    animation: "shimmer 2.5s infinite",
  },
  "@keyframes shimmer": {
    "100%": {
      transform: "translateX(100%)",
    },
  },
}));

// Available user status options with specific colors that exist in Material UI
const STATUS_OPTIONS = [
  { label: "Online", color: "#44b700" }, // Custom green
  { label: "Away", color: "#ff9800" }, // Orange
  { label: "Busy", color: "#f44336" }, // Red
  { label: "Invisible", color: "#bdbdbd" }, // Grey
];

const UserProfile = ({
  open,
  username = "Alex Johnson",
  role = "Administrator",
  onLogout = () => console.log("Logout clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [userStatus, setUserStatus] = useState(STATUS_OPTIONS[0]);

  const openMenu = Boolean(anchorEl);
  const openStatusMenu = Boolean(statusMenuAnchor);

  const handleClick = (event) => {
    if (open) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusClick = (event) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusChange = (status) => {
    setUserStatus(status);
    handleStatusClose();
  };

  // Premium badge with enhanced visual effects
  const PremiumBadge = styled(Box)(({ theme, isOpen }) => ({
    position: "absolute",
    top: isOpen ? -10 : -6,
    right: isOpen ? -10 : "50%",
    transform: isOpen ? "none" : "translateX(50%)",
    background: `linear-gradient(135deg, #FFD700, #FFA500)`,
    color: "#000",
    borderRadius: "50%",
    width: isOpen ? 26 : 20,
    height: isOpen ? 26 : 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isOpen ? 14 : 12,
    fontWeight: "bold",
    boxShadow: `0 3px 8px rgba(0,0,0,0.3), 0 0 2px rgba(255,215,0,0.6), 0 0 ${
      isOpen ? "15px" : "10px"
    } rgba(255,215,0,0.5)`,
    border: `2px solid #FFF`,
    zIndex: 5,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    animation: "pulse-gold 2s infinite",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: -2,
      padding: 2,
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      opacity: 0.8,
    },
    "@keyframes pulse-gold": {
      "0%": {
        boxShadow: `0 3px 8px rgba(0,0,0,0.3), 0 0 2px rgba(255,215,0,0.6), 0 0 ${
          isOpen ? "10px" : "5px"
        } rgba(255,215,0,0.5)`,
      },
      "50%": {
        boxShadow: `0 3px 8px rgba(0,0,0,0.3), 0 0 2px rgba(255,215,0,0.6), 0 0 ${
          isOpen ? "15px" : "10px"
        } rgba(255,215,0,0.8)`,
      },
      "100%": {
        boxShadow: `0 3px 8px rgba(0,0,0,0.3), 0 0 2px rgba(255,215,0,0.6), 0 0 ${
          isOpen ? "10px" : "5px"
        } rgba(255,215,0,0.5)`,
      },
    },
  }));

  // Avatar styling with gradient border and advanced effects
  const avatarStyle = {
    mx: "auto",
    width: open ? 88 : 44,
    height: open ? 88 : 44,
    my: open ? 1.5 : 1,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", // Bouncy animation
    border: `3px solid ${theme.palette.background.paper}`,
    boxShadow: open
      ? `0 0 0 2px ${theme.palette.primary.main}, 0 8px 16px rgba(0,0,0,0.2)`
      : `0 0 0 2px ${theme.palette.primary.main}, 0 4px 8px rgba(0,0,0,0.15)`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.primary.contrastText,
    fontSize: open ? 32 : 18,
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      transform: open ? "scale(1.05)" : "scale(1.1)",
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}, 0 10px 20px rgba(0,0,0,0.25)`,
    },
  };

  const nameStyle = {
    fontSize: open ? 17 : 0,
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    opacity: open ? 1 : 0,
    height: open ? "auto" : 0,
    marginTop: theme.spacing(1.5),
    color:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : theme.palette.text.primary,
    textShadow:
      theme.palette.mode === "dark" ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
  };

  const roleStyle = {
    fontSize: open ? 14 : 0,
    transition: "all 0.3s ease",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    opacity: open ? 0.85 : 0,
    height: open ? "auto" : 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    mt: 0.5,
  };

  // Helper function to determine the status chip color
  const getStatusColor = (status) => {
    switch (status.label) {
      case "Online":
        return "success";
      case "Away":
        return "warning";
      case "Busy":
        return "error";
      case "Invisible":
      default:
        return "default";
    }
  };

  const statusChipStyle = {
    height: 24,
    mt: 1,
    cursor: "pointer",
    opacity: open ? 1 : 0,
    visibility: open ? "visible" : "hidden",
    transform: open ? "scale(1)" : "scale(0.8)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
  };

  return (
    <GradientBackground>
      {/* User avatar with premium badge */}
      <Tooltip
        title={open ? "" : `${username} • ${role} • ${userStatus.label}`}
        placement="right"
        arrow
      >
        <Box
          onClick={handleClick}
          sx={{ position: "relative", width: "fit-content", mx: "auto" }}
        >
          <PremiumBadge isOpen={open}>
            <span style={{ transform: "rotate(5deg)" }}>★</span>
          </PremiumBadge>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{ "& .MuiBadge-badge": { backgroundColor: userStatus.color } }}
          >
            <Avatar sx={avatarStyle} alt={username}>
              {!open && <PersonIcon fontSize="small" />}
              {open && username.charAt(0).toUpperCase()}
            </Avatar>
          </StyledBadge>
        </Box>
      </Tooltip>

      {/* Username with verified badge */}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography align="center" sx={nameStyle}>
          {username}
        </Typography>
        {open && (
          <Tooltip title="Verified Account" placement="top">
            <VerifiedIcon
              sx={{
                fontSize: 16,
                color: theme.palette.primary.main,
                ml: 0.5,
                mt: 1.5,
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* User role */}
      <Typography component="div" align="center" sx={roleStyle}>
        {role}
      </Typography>

      {/* Status chip */}
      <Box sx={{ textAlign: "center" }}>
        <Chip
          label={userStatus.label}
          size="small"
          color={getStatusColor(userStatus)}
          onClick={handleStatusClick}
          onDelete={handleStatusClick}
          deleteIcon={<KeyboardArrowDownIcon />}
          sx={statusChipStyle}
        />
      </Box>

      {/* Status selection menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={openStatusMenu}
        onClose={handleStatusClose}
        TransitionComponent={Fade}
        sx={{ mt: 0.5 }}
      >
        {STATUS_OPTIONS.map((status) => (
          <MenuItem
            key={status.label}
            onClick={() => handleStatusChange(status)}
            selected={userStatus.label === status.label}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: status.color,
                  boxShadow: `0 0 0 2px ${status.color}22`,
                }}
              />
              {status.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsIcon fontSize="small" color="action" />
            <Typography variant="body2">Notifications</Typography>
            <Chip
              label="3"
              size="small"
              color="error"
              sx={{ height: 16, fontSize: 10, ml: 1 }}
            />
          </Box>
        </MenuItem>
        <MenuItem onClick={onSettingsClick}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsIcon fontSize="small" color="action" />
            <Typography variant="body2">Settings</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DarkModeIcon fontSize="small" color="action" />
            <Typography variant="body2">Dark Mode</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SecurityIcon fontSize="small" color="action" />
            <Typography variant="body2">Security</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: theme.palette.error.main,
            }}
          >
            <LogoutIcon fontSize="small" color="error" />
            <Typography variant="body2" color="error">
              Logout
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </GradientBackground>
  );
};

export default UserProfile;
