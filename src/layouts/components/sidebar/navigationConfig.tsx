// navigationConfig.tsx
import { appRoutes } from "@/routes/appRoutes";
import { authService } from "@/shared/services";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ApiIcon from "@mui/icons-material/Api";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from '@mui/icons-material/Chat';
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from "@mui/icons-material/People";
import TranslateIcon from "@mui/icons-material/Translate";
import { ColoredIcon } from "../../../constants/styles";

// Import types and enums from separate file
import Permissions from "@/constants/appPermissions";
import {
  NavigationColors,
  NavigationConfig,
  NavigationItem,
  NavigationSection,
  NavigationSectionId,
  NavigationTitles,
  PermissionArray,
  RoleArray,
  UserRoles
} from './navigationTypes';


// Simple function to check if user has role OR permission
const canAccess = (roles: RoleArray = [], permissions: PermissionArray = []): boolean => {
  // If no roles or permissions specified, allow access
  if (roles.length === 0 && permissions.length === 0) {
    return true;
  }

  // Convert enum arrays to string arrays for authService compatibility
  const roleStrings = roles.map(role => role.toString());
  // Permissions are already strings, no need to convert
  const permissionStrings = permissions;

  // Check if user has any of the roles
  const hasRole: boolean = roleStrings.length > 0 ? authService.isInRole(roleStrings) : false;

  // Check if user has any of the permissions
  const hasPermission: boolean =
    permissionStrings.length > 0 ? authService.hasPermission(permissionStrings) : false;

  // Return true if user has role OR permission
  return hasRole || hasPermission;
};

export const getNavigationConfig = (): NavigationConfig => {
  // Full navigation configuration
  const fullConfig: NavigationConfig = [
    {
      id: NavigationSectionId.ARCHIVE,
      title: NavigationTitles.BASIC_DATA,
      icon: (
        <ColoredIcon color={NavigationColors.PRIMARY_BLUE}>
          <ArchiveIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.COUNTRIES,
          icon: (
            <ColoredIcon color={NavigationColors.SECONDARY_BLUE}>
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.countries,
          permissions: [Permissions.ViewCountries],
        },
        {
          title: NavigationTitles.STATES,
          icon: (
            <ColoredIcon color={NavigationColors.SECONDARY_BLUE}>
              <LocationCityIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.states,
          roles: [UserRoles.ADMIN],
        },
        {
          title: NavigationTitles.EMPLOYEES,
          icon: (
            <ColoredIcon color={NavigationColors.SECONDARY_BLUE}>
              <PeopleIcon />
            </ColoredIcon>
          ),
          path: appRoutes.basicData.employees,
        },
      ],
    },
    // Roles and users
    {
      id: NavigationSectionId.USERS_AND_ROLES,
      title: NavigationTitles.ROLES_AND_USERS_MANAGEMENT,
      icon: (
        <ColoredIcon color={NavigationColors.PRIMARY_BLUE}>
          <ArchiveIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.ROLES_MANAGEMENT,
          icon: (
            <ColoredIcon color={NavigationColors.SECONDARY_BLUE}>
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.auth.rolesPage,
          roles: [UserRoles.ADMIN],
        },
        {
          title: NavigationTitles.USERS_MANAGEMENT,
          icon: (
            <ColoredIcon color={NavigationColors.SECONDARY_BLUE}>
              <CategoryIcon />
            </ColoredIcon>
          ),
          path: appRoutes.auth.usersPage,
          roles: [UserRoles.ADMIN],
        },
      ],
    },
    // Chat Section
    {
      id: NavigationSectionId.CHAT,
      title: NavigationTitles.CHAT,
      icon: (
        <ColoredIcon color={NavigationColors.GREEN}>
          <ChatIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.CHAT_INTERFACE,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_GREEN}>
              <ChatIcon />
            </ColoredIcon>
          ),
          path: appRoutes.chat,
        },
      ],
    },
    // Chart Examples Section
    {
      id: NavigationSectionId.CHART_EXAMPLES,
      title: NavigationTitles.CHART_EXAMPLES,
      icon: (
        <ColoredIcon color={NavigationColors.CHART_BLUE}>
          <AssessmentIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.CHART_LIBRARY,
          icon: (
            <ColoredIcon color={NavigationColors.CHART_BLUE}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.chartExamples,
        },
      ],
    },
    {
      id: NavigationSectionId.ADVANCED_TOOLS,
      title: NavigationTitles.ADVANCED_TOOLS_TITLE,
      icon: (
        <ColoredIcon color={NavigationColors.PURPLE}>
          <MonitorHeartIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.TRACK_CHANGES,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_PURPLE}>
              <AddTaskIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.trackChanges,
        },
        {
          title: NavigationTitles.LOCALIZATION_API,
          icon: (
            <ColoredIcon color={NavigationColors.PINK}>
              <TranslateIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.localizationApi,
        },
        {
          title: NavigationTitles.HEALTH_CHECK,
          icon: (
            <ColoredIcon color={NavigationColors.DARK_PURPLE}>
              <HealthAndSafetyIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.healthCheck,
          roles: [UserRoles.ADMIN],
        },
        {
          title: NavigationTitles.API_ENDPOINTS,
          icon: (
            <ColoredIcon color={NavigationColors.DARK_GRAY}>
              <ApiIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.apiEndpoints,
        },
        {
          title: NavigationTitles.HANGFIRE_DASHBOARD,
          icon: (
            <ColoredIcon color={NavigationColors.PINK}>
              <TranslateIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.hangfireDashboard,
        },
        {
          title: NavigationTitles.NOTIFICATION_TEST,
          icon: (
            <ColoredIcon color={NavigationColors.ORANGE}>
              <NotificationsIcon />
            </ColoredIcon>
          ),
          path: appRoutes.advancedTools.notificationTest,
        }
      ],
    },
  ];

  // Filter out items based on roles and permissions
  const filteredConfig: NavigationConfig = fullConfig
    .map((section: NavigationSection) => {
      // If the section has items, filter them
      if (section.items) {
        const filteredItems: NavigationItem[] = section.items.filter((item: NavigationItem) => {
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
    })
    .filter((section): section is NavigationSection => section !== null);

  return filteredConfig;
};