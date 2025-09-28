// navigationConfig.tsx
import { authService } from "@/shared/services";
import { getBasicDataConfig } from "./configs/basicDataConfig";
import { getAnalyticsConfig } from "./configs/analyticsConfig";
import { getCommunicationConfig } from "./configs/communicationConfig";
import { getDocumentsConfig } from "./configs/documentsConfig";
import { getChatConfig } from "./configs/chatConfig";
import { getChartExamplesConfig } from "./configs/chartExamplesConfig";
import { getAdvancedToolsConfig } from "./configs/advancedToolsConfig";
import {getUsersAndRolesConfig} from "./configs/usersAndRolesConfig";

// Import types and enums from separate file
import {
  NavigationConfig,
  NavigationItem,
  NavigationSection,
  PermissionArray,
  RoleArray,
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
    getBasicDataConfig(),
    getUsersAndRolesConfig(),
    getAnalyticsConfig(),
    getCommunicationConfig(),
    getDocumentsConfig(),
    getChatConfig(),
    getChartExamplesConfig(),
    getAdvancedToolsConfig(),
  ];

  // Filter out items based on roles and permissions (recursive)
  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .filter((item) => {
        // Check if the item itself is accessible
        const itemAccessible = canAccess(item.roles || [], item.permissions || []);
        let hasAccessibleChildren = false;

        // If item has children, check if any are accessible
        if (item.items && item.items.length > 0) {
          const filteredChildren = filterItems(item.items);
          hasAccessibleChildren = filteredChildren.length > 0;
          // Update the item's children
          (item as any).items = filteredChildren;
        }

        // Include item if it's accessible or has accessible children
        return itemAccessible || hasAccessibleChildren;
      });
  };

  const filteredConfig: NavigationConfig = fullConfig
    .map((section: NavigationSection) => {
      // If the section has items, filter them
      if (section.items) {
        const filteredItems: NavigationItem[] = filterItems(section.items);
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