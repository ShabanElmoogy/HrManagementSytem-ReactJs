/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Tabs, Tab, Badge } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";

const NotificationsHeader = ({
  tabValue,
  handleTabChange,
  unreadCount,
  onClose,
  isMobileView,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1,
          flexDirection: isRtl ? "row-reverse" : "row",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {t("notifications") || "Notifications"}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="more options">
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={t("all") || "All"} id="all-tab" />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {t("unread") || "Unread"}
              {unreadCount > 0 && (
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{ mx: 2, px: isMobileView ? 1 : 0 }}
                />
              )}
            </Box>
          }
          id="unread-tab"
        />
      </Tabs>
    </Box>
  );
};

export default NotificationsHeader;
