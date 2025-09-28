// navigationUtils.tsx
import { ReactElement } from "react";
import { ColoredIcon } from "../../../constants/styles";
import { NavigationItem, NavigationSection, NavigationSectionId, NavigationTitles, UserRoles } from "./navigationTypes";
import { PermissionString } from "../../../constants/appPermissions";

// Helper to create a colored icon
export const createColoredIcon = (icon: ReactElement, color: string): ReactElement => (
  <ColoredIcon color={color}>
    {icon}
  </ColoredIcon>
);

// Helper to create a navigation item
export const createNavItem = (
  title: NavigationTitles | string,
  icon: ReactElement,
  path?: string,
  roles?: UserRoles[],
  permissions?: PermissionString[],
  items?: NavigationItem[]
): NavigationItem => ({
  title,
  icon,
  path,
  roles,
  permissions,
  items,
});

// Helper to create a navigation section
export const createNavSection = (
  id: NavigationSectionId,
  title: NavigationTitles | string,
  icon: ReactElement,
  items: NavigationItem[],
  roles?: UserRoles[],
  permissions?: PermissionString[]
): NavigationSection => ({
  id,
  title,
  icon,
  items,
  roles,
  permissions,
});