import React from "react";
import { Box, Button, Divider } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";

const NotificationsFooter = ({
  markAllAsRead,
  markAllAsUnread,
  clearAllNotifications,
  notificationsCount,
  unreadCount,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const readNotificationsCount = notificationsCount - unreadCount;

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          p: 1.5,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Button
          startIcon={<DoneAllIcon />}
          onClick={markAllAsRead}
          disabled={notificationsCount === 0 || unreadCount === 0}
          color="primary"
          size="small"
          sx={{ textTransform: "none" }}
        >
          {t("markAllAsRead") || "Mark all as read"}
        </Button>
        <Button
          startIcon={<MarkEmailUnreadIcon />}
          onClick={markAllAsUnread}
          disabled={notificationsCount === 0 || readNotificationsCount === 0}
          color="primary"
          size="small"
          sx={{ textTransform: "none" }}
        >
          {t("markAllAsUnread") || "Mark all as unread"}
        </Button>
        <Button
          startIcon={<ClearAllIcon />}
          onClick={clearAllNotifications}
          disabled={notificationsCount === 0}
          color="primary"
          size="small"
          sx={{ textTransform: "none" }}
        >
          {t("clearAll") || "Clear all"}
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationsFooter;
