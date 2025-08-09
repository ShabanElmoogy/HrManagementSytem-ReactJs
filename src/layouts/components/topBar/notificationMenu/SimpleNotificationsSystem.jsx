/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, forwardRef, useImperativeHandle } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTranslation } from "react-i18next";
import NotificationsMenu from "./notificationsMenu";
import useSimpleNotifications from "../../../../shared/hooks/useSimpleNotifications";

const SimpleNotificationsSystem = forwardRef((props, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const { isMobile = false } = props;

  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    toggleReadStatus,
    getStats
  } = useSimpleNotifications();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
    handleMenuClose();
  };

  const handleClearAll = () => {
    clearAll();
    handleMenuClose();
  };

  // Expose minimal UI-focused methods
  useImperativeHandle(ref, () => ({
    // Core notification methods (for direct UI interactions)
    addNotification,
    getUnreadCount: () => unreadCount,
    
    // Filtering methods (for UI display)
    getNotificationsByCategory: (category) => notifications.filter(n => n.category === category),
    getNotificationsByType: (type) => notifications.filter(n => n.type === type),
    
    // Statistics (for UI analytics)
    getNotificationStats: getStats,
  }));

  return (
    <>
      <IconButton
        size="large"
        aria-label={t("notifications") || "Notifications"}
        color="inherit"
        onClick={handleMenuOpen}
        sx={{
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationsMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        notifications={notifications}
        unreadCount={unreadCount}
        markAllAsRead={markAllAsRead}
        markAsRead={handleMarkAsRead}
        clearAllNotifications={handleClearAll}
        isMobile={isMobile}
        toggleReadStatus={toggleReadStatus}
        clearNotification={removeNotification}
      />
    </>
  );
});

export default SimpleNotificationsSystem;