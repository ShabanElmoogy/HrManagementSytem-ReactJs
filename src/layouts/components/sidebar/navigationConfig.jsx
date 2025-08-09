/* eslint-disable react/prop-types */
// navigationConfig.js
import ArchiveIcon from "@mui/icons-material/Archive";
import CategoryIcon from "@mui/icons-material/Category";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PeopleIcon from "@mui/icons-material/People";


import SubtitlesIcon from "@mui/icons-material/Subtitles";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskIcon from "@mui/icons-material/Task";
import BusinessIcon from "@mui/icons-material/Business";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import AppsIcon from "@mui/icons-material/Apps";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ApiIcon from "@mui/icons-material/Api";
import TranslateIcon from "@mui/icons-material/Translate";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { appRoutes } from "@/routes/appRoutes";
import { authService } from "@/shared/services";

import { ColoredIcon } from "../../../constants/styles";
import { apiRoutes } from "@/routes";

// Simple function to check if user has role OR permission
const canAccess = (roles = [], permissions = []) => {
  // If no roles or permissions specified, allow access
  if (roles.length === 0 && permissions.length === 0) {
    return true;
  }

  // Check if user has any of the roles
  const hasRole = roles.length > 0 ? authService.isInRole(roles) : false;

  // Check if user has any of the permissions
  const hasPermission =
    permissions.length > 0 ? authService.hasPermission(permissions) : false;

  // Return true if user has role OR permission
  return hasRole || hasPermission;
};

export const getNavigationConfig = () => {
  // Full navigation configuration
  const fullConfig = [
    {
      id: "archieve",
      title: "menu.basicData",
      icon: (
        <ColoredIcon color="#4a6da7">
          <ArchiveIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: "menu.countries",
          icon: (
            <ColoredIcon color="#5c7cbc">
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.countries,
          permissions: ["Countries:View"],
        },
        {
          title: "menu.states",
          icon: (
            <ColoredIcon color="#5c7cbc">
              <LocationCityIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.states,
          roles: ["admin"],
        },
        {
          title: "menu.employees",
          icon: (
            <ColoredIcon color="#5c7cbc">
              <PeopleIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.employees,
        },
      ],
    },
    //roles and users
    {
      id: "Users And Roles",
      title: "menu.rolesAndUsersManagement",
      icon: (
        <ColoredIcon color="#4a6da7">
          <ArchiveIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: "menu.rolesManagement",
          icon: (
            <ColoredIcon color="#5c7cbc">
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.auth.rolesPage,
          roles: ["admin"],
        },
        {
          title: "menu.usersManagement",
          icon: (
            <ColoredIcon color="#5c7cbc">
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.auth.usersPage,
          roles: ["admin"],
        },
      ],
    },
    // Chat Section
    {
      id: "chat",
      title: "menu.chat",
      icon: (
        <ColoredIcon color="#2e7d32">
          <ChatIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: "menu.chatInterface",
          icon: (
            <ColoredIcon color="#388e3c">
              <ChatIcon />
            </ColoredIcon>
          ),
          path: appRoutes.chat,
        },
      ],
    },
    // Chart Examples Section
    {
      id: "chartExamples",
      title: "Chart Examples",
      icon: (
        <ColoredIcon color="#1976d2">
          <AssessmentIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: "Chart Library",
          icon: (
            <ColoredIcon color="#1976d2">
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.chartExamples,
        },
      ],
    },
    {
      id: "advancedTools",
      title: "advancedTools.title",
      icon: (
        <ColoredIcon color="#7b1fa2">
          <MonitorHeartIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: "advancedTools.trackChanges",
          icon: (
            <ColoredIcon color="#8e24aa">
              <AddTaskIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.trackChanges,
        },
                {
          title: "advancedTools.localizationApi",
          icon: (
            <ColoredIcon color="#ba68c8">
              <TranslateIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.localizationApi,
        },
        {
          title: "advancedTools.healthCheck",
          icon: (
            <ColoredIcon color="#9c27b0">
              <HealthAndSafetyIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.healthCheck,
          roles: ["admin"],
        },
        {
          title: "advancedTools.apiEndPoints",
          icon: (
            <ColoredIcon color="#352F36FF">
              <ApiIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.apiEndpoints,
        },
        {
          title: "advancedTools.hangfireDashboard",
          icon: (
            <ColoredIcon color="#ba68c8">
              <TranslateIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.hangfireDashboard,
        },
        {
          title: "Notification Test",
          icon: (
            <ColoredIcon color="#ff5722">
              <NotificationsIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.notificationTest,
        }
      ],
    },
  ];

  // Filter out items based on roles and permissions
  const filteredConfig = fullConfig.map((section) => {
    // If the section has items, filter them
    if (section.items) {
      const filteredItems = section.items.filter((item) => {
        return canAccess(item.roles || [], item.permissions || []);
      });
      // If the section has any visible items after filtering, return it
      if (filteredItems.length > 0) {
        return {
          ...section,
          items: filteredItems,
        };
      }
      // Otherwise, filter out the whole section
      return null;
    }
    // If it's a direct link, check its permissions
    if (canAccess(section.roles || [], section.permissions || [])) {
      return section;
    }
    return null;
  }).filter(Boolean); // Remove null entries

  return filteredConfig;
};