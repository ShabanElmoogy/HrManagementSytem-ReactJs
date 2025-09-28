/* eslint-disable react/prop-types */
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "../../../routes";
import { apiService } from "../../../shared/services";
import AuthService from "../../../shared/services/authService";

const UserProfile = ({ open, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const openMenu = Boolean(anchorEl);

  // Fetch user info from API and get role from token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(false);

        // Get user role from JWT token
        const currentUser = AuthService.getCurrentUser();
      
        if (currentUser?.roles && currentUser.roles.length > 0) {
          const role = currentUser.roles[0];
          setUserRole(role.charAt(0).toUpperCase() + role.slice(1).toLowerCase());
        } else {
          setUserRole("User");
        }

        // Get user info from API
        const response = await apiService.get(apiRoutes.auth.getUserInfo);

        setUserInfo(response);
      } catch (err) {
        setUserRole("User");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleClick = (event) => {
    if (open) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    navigate("/profilePage");
    handleClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
    handleClose();
  };

  // Get display values
  const getDisplayName = () => {
    if (!userInfo) return "User";
    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }
    return userInfo.userName || userInfo.email || "User";
  };

  const getInitials = () => {
    if (!userInfo) return "U";
    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`.toUpperCase();
    }
    if (userInfo.userName) {
      return userInfo.userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const displayName = getDisplayName();
  const initials = getInitials();

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Avatar
          sx={{
            mx: "auto",
            width: open ? 64 : 40,
            height: open ? 64 : 40,
            mb: open ? 1 : 0,
          }}
        >
          <PersonIcon />
        </Avatar>
        {open && (
          <Typography variant="caption" color="text.secondary">
            Loading...
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      {/* User Avatar */}
      <Tooltip
        title={open ? "" : `${displayName} • ${userRole}`}
        placement="right"
        arrow
      >
        <Avatar
          onClick={handleClick}
          sx={{
            mx: "auto",
            width: open ? 64 : 40,
            height: open ? 64 : 40,
            mb: open ? 1 : 0,
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
          alt={displayName}
        >
          {open ? initials : <PersonIcon />}
        </Avatar>
      </Tooltip>

      {/* Username */}
      {open && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </Typography>
      )}

      {/* User Role */}
      {open && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          {userRole}
        </Typography>
      )}

      {/* User Menu */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
        <MenuItem onClick={handleSettingsClick}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Profile Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfile;