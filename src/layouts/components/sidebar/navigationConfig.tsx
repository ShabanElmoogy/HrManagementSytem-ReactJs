// navigationConfig.tsx
import { appRoutes } from "@/routes/appRoutes";
import { authService } from "@/shared/services";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ApiIcon from "@mui/icons-material/Api";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Business from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from '@mui/icons-material/Chat';
import Description from "@mui/icons-material/Description";
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
    // HR Management Section
    {
      id: NavigationSectionId.ANALYTICS,
      title: NavigationTitles.ANALYTICS,
      icon: (
        <ColoredIcon color={NavigationColors.ANALYTICS_GREEN}>
          <AssessmentIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.ANALYTICS_DASHBOARD,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.mainDashboard,
        },
        {
          title: NavigationTitles.PERFORMANCE_ANALYTICS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.performanceAnalytics,
        },
        {
          title: NavigationTitles.TIME_ATTENDANCE_ANALYTICS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.timeAttendanceAnalytics,
        },
        {
          title: NavigationTitles.EMPLOYEE_ENGAGEMENT,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.employeeEngagement,
        },
        {
          title: NavigationTitles.DOCUMENT_ANALYTICS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.documentAnalytics,
        },
        {
          title: NavigationTitles.CUSTOM_REPORTS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.customReports,
        },
        {
          title: NavigationTitles.DATA_EXPORT,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_ANALYTICS_GREEN}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.analytics.dataExport,
        },
      ],
    },
    // Communication Section
    {
      id: NavigationSectionId.COMMUNICATION,
      title: NavigationTitles.COMMUNICATION,
      icon: (
        <ColoredIcon color={NavigationColors.COMMUNICATION_PURPLE}>
          <ChatIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.MESSAGING,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <ChatIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.messaging,
        },
        {
          title: NavigationTitles.ANNOUNCEMENTS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <NotificationsIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.announcements,
        },
        {
          title: NavigationTitles.FEEDBACK,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.feedback,
        },
        {
          title: NavigationTitles.COMMUNICATION_DASHBOARD,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.dashboard,
        },
        {
          title: NavigationTitles.NOTIFICATIONS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <NotificationsIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.notifications,
        },
        {
          title: NavigationTitles.COMMUNICATION_REPORTS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_COMMUNICATION_PURPLE}>
              <AssessmentIcon />
            </ColoredIcon>
          ),
          path: appRoutes.communication.reports,
        },
      ],
    },
    // Documents Section
    {
      id: NavigationSectionId.DOCUMENTS,
      title: NavigationTitles.DOCUMENTS,
      icon: (
        <ColoredIcon color={NavigationColors.DOCUMENTS_ORANGE}>
          <ArchiveIcon />
        </ColoredIcon>
      ),
      items: [
        {
          title: NavigationTitles.DOCUMENT_OVERVIEW,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_DOCUMENTS_ORANGE}>
              <Description />
            </ColoredIcon>
          ),
          path: appRoutes.documents.overview,
        },
        {
          title: NavigationTitles.EMPLOYEE_DOCUMENTS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_DOCUMENTS_ORANGE}>
              <PeopleIcon />
            </ColoredIcon>
          ),
          path: appRoutes.documents.employeeDocuments,
        },
        {
          title: NavigationTitles.COMPANY_DOCUMENTS,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_DOCUMENTS_ORANGE}>
              <Business />
            </ColoredIcon>
          ),
          path: appRoutes.documents.companyDocuments,
        },
        {
          title: NavigationTitles.DOCUMENT_TEMPLATES,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_DOCUMENTS_ORANGE}>
              <Description />
            </ColoredIcon>
          ),
          path: appRoutes.documents.templates,
        },
        {
          title: NavigationTitles.DOCUMENT_ARCHIVES,
          icon: (
            <ColoredIcon color={NavigationColors.LIGHT_DOCUMENTS_ORANGE}>
              <ArchiveIcon />
            </ColoredIcon>
          ),
          path: appRoutes.documents.archives,
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