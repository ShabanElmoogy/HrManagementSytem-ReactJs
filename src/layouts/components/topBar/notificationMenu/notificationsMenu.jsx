/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Menu, Box, useMediaQuery, useTheme } from "@mui/material";
import NotificationsHeader from "./notificationsHeader";
import NotificationsList from "./notificationsList";
import NotificationsFooter from "./notificationsFooter";
import { getTimeAgo } from "../../../../shared/utils/dateUtils";

const NotificationsMenu = ({
  anchorEl,
  open,
  onClose,
  notifications,
  unreadCount,
  markAllAsRead,
  markAsRead,
  viewCompanyDetails,
  clearAllNotifications,
  isMobile,
  toggleReadStatus,
  clearNotification,
  markAllAsUnread,
}) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [calculatedUnreadCount, setCalculatedUnreadCount] =
    useState(unreadCount);
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";
  const isMobileView = useMediaQuery(theme.breakpoints.down("sm")) || isMobile;

  // Recalculate unread count to ensure accuracy
  useEffect(() => {
    const actualUnreadCount = notifications.filter((n) => !n.isRead).length;
    setCalculatedUnreadCount(actualUnreadCount);
  }, [notifications]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    tabValue === 0
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  return (
    <Menu
      anchorEl={anchorEl}
      id="notifications-menu"
      keepMounted
      open={open}
      onClose={onClose}
      disableScrollLock={true}
      PaperProps={{
        elevation: 4,
        sx: {
          width: isMobileView ? 320 : 360,
          maxHeight: "80vh",
          mt: 1.5,
          p: 0,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          // Adjust margins for RTL
          ml: isRtl ? 1.5 : "auto",
          mr: isRtl ? "auto" : 1.5,
        },
      }}
      // Adjust menu positioning for RTL
      transformOrigin={{
        horizontal: isRtl ? "left" : "right",
        vertical: "top",
      }}
      anchorOrigin={{
        horizontal: isRtl ? "left" : "right",
        vertical: "bottom",
      }}
    >
      {/* This container will hold all content and enforce proper layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxHeight: "80vh",
        }}
      >
        {/* Header component with title and tabs */}
        <NotificationsHeader
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          unreadCount={calculatedUnreadCount}
          onClose={onClose}
          isMobileView={isMobileView}
        />

        {/* Notifications list component */}
        <NotificationsList
          filteredNotifications={filteredNotifications}
          markAsRead={markAsRead}
          viewCompanyDetails={viewCompanyDetails}
          toggleReadStatus={toggleReadStatus}
          clearNotification={clearNotification}
          getTimeAgo={getTimeAgo}
          onClose={onClose}
        />

        {/* Footer component with action buttons */}
        <NotificationsFooter
          markAllAsRead={markAllAsRead}
          markAllAsUnread={markAllAsUnread}
          clearAllNotifications={clearAllNotifications}
          notificationsCount={notifications.length}
          unreadCount={calculatedUnreadCount}
        />
      </Box>
    </Menu>
  );
};

export default NotificationsMenu;
