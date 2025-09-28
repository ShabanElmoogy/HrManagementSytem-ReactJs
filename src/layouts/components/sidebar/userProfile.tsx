/* eslint-disable react/prop-types */
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { Avatar, Box, Tooltip, Typography, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { apiRoutes } from "../../../routes";
import { apiService } from "../../../shared/services";
import AuthService from "../../../shared/services/authService";

interface UserProfileProps {
  open: boolean;
}

// Define animations
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UserProfile = ({ open }: UserProfileProps) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user info from API and get role from token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get user role from JWT token
        const currentUser = AuthService.getCurrentUser();

        if (currentUser?.roles && currentUser.roles.length > 0) {
          const role = currentUser.roles[0];
          setUserRole(
            role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
          );
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
      return `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    if (userInfo.userName) {
      return userInfo.userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getRoleIcon = () => {
    const role = userRole.toLowerCase();

    if (role.includes("admin")) {
      return (
        <AdminPanelSettingsIcon
          fontSize="small"
          sx={{
            color: "#ff5252", // Red for admin
            filter: "drop-shadow(0 0 2px rgba(255, 82, 82, 0.5))",
          }}
        />
      );
    }

    if (role.includes("manager") || role.includes("supervisor")) {
      return (
        <SupervisorAccountIcon
          fontSize="small"
          sx={{
            color: "#ffab00", // Amber for manager/supervisor
            filter: "drop-shadow(0 0 2px rgba(255, 171, 0, 0.5))",
          }}
        />
      );
    }

    if (role.includes("engineer") || role.includes("developer")) {
      return (
        <EngineeringIcon
          fontSize="small"
          sx={{
            color: "#448aff", // Blue for engineer/developer
            filter: "drop-shadow(0 0 2px rgba(68, 138, 255, 0.5))",
          }}
        />
      );
    }

    return (
      <PersonIcon
        fontSize="small"
        sx={{
          color: "#69f0ae", // Green for default user
          filter: "drop-shadow(0 0 2px rgba(105, 240, 174, 0.5))",
        }}
      />
    );
  };

  const displayName = getDisplayName();
  const initials = getInitials();

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 100,
        }}
      >
        <Avatar
          sx={{
            mx: "auto",
            width: open ? 64 : 40,
            height: open ? 64 : 40,
            mb: open ? 1 : 0,
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            animation: `${pulse} 2s infinite`,
          }}
        >
          <PersonIcon />
        </Avatar>
        {open && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, opacity: 0.8 }}
          >
            Loading...
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)"
            : "linear-gradient(135deg, #5e35b1 0%, #7e57c2 50%, #9575cd 100%)",
        borderRadius: 3,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
            : "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 30px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)"
              : "0 12px 30px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* User Avatar */}
      <Tooltip
        title={open ? "" : `${displayName} • ${userRole}`}
        placement="right"
        arrow
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  border: "2px solid #fff",
                  animation: `${pulse} 2s infinite`,
                }}
              />
            }
          >
            <Avatar
              sx={{
                mx: "auto",
                width: open ? 72 : 40,
                height: open ? 72 : 40,
                mb: open ? 1.5 : 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 6px 12px rgba(0,0,0,0.4)"
                      : "0 6px 12px rgba(0,0,0,0.2)",
                },
                border: (theme) =>
                  `3px solid ${theme.palette.background.paper}`,
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
                color: "white",
                fontSize: open ? "1.5rem" : "1rem",
              }}
              alt={displayName}
            >
              {open ? initials : <PersonIcon />}
            </Avatar>
          </Badge>
        </Box>
      </Tooltip>

      {/* Username */}
      <Box
        sx={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          overflow: "hidden",
          animation: open ? `${fadeIn} 0.5s ease forwards` : "none",
        }}
      >
        {open && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.75,
              fontSize: "1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {displayName}
          </Typography>
        )}
      </Box>

      {/* User Role */}
      <Box
        sx={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
          overflow: "hidden",
          animation: open ? `${fadeIn} 0.5s ease 0.2s forwards` : "none",
        }}
      >
        {open && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 600,
              fontSize: "0.75rem",
              color: (theme) => theme.palette.primary.contrastText,
              backgroundColor: (theme) => theme.palette.primary.dark,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {getRoleIcon()}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                lineHeight: 1,
                color: "white",
              }}
            >
              {userRole}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
