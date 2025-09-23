// navigationTypes.ts
import React from "react";
import { PermissionString } from "@/constants/appPermissions";

// Enums for better type safety
export enum NavigationSectionId {
  ARCHIVE = "archive",
  USERS_AND_ROLES = "usersAndRoles",
  CHAT = "chat",
  CHART_EXAMPLES = "chartExamples",
  ADVANCED_TOOLS = "advancedTools",
}

export enum NavigationColors {
  PRIMARY_BLUE = "#4a6da7",
  SECONDARY_BLUE = "#5c7cbc",
  GREEN = "#2e7d32",
  LIGHT_GREEN = "#388e3c",
  CHART_BLUE = "#1976d2",
  PURPLE = "#7b1fa2",
  LIGHT_PURPLE = "#8e24aa",
  PINK = "#ba68c8",
  DARK_PURPLE = "#9c27b0",
  DARK_GRAY = "#352F36FF",
  ORANGE = "#ff5722",
}

export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

export enum NavigationTitles {
  // Menu keys
  BASIC_DATA = "menu.basicData",
  COUNTRIES = "menu.countries",
  STATES = "menu.states",
  EMPLOYEES = "menu.employees",
  ROLES_AND_USERS_MANAGEMENT = "menu.rolesAndUsersManagement",
  ROLES_MANAGEMENT = "menu.rolesManagement",
  USERS_MANAGEMENT = "menu.usersManagement",
  CHAT = "menu.chat",
  CHAT_INTERFACE = "menu.chatInterface",

  // Direct titles
  CHART_EXAMPLES = "Chart Examples",
  CHART_LIBRARY = "Chart Library",
  NOTIFICATION_TEST = "Notification Test",

  // Advanced tools
  ADVANCED_TOOLS_TITLE = "advancedTools.title",
  TRACK_CHANGES = "advancedTools.trackChanges",
  LOCALIZATION_API = "advancedTools.localizationApi",
  HEALTH_CHECK = "advancedTools.healthCheck",
  API_ENDPOINTS = "advancedTools.apiEndPoints",
  HANGFIRE_DASHBOARD = "advancedTools.hangfireDashboard",
}

// Interface definitions
export interface NavigationItem {
  id?: string;
  title: NavigationTitles | string;
  icon: React.ReactElement;
  path?: string;
  roles?: UserRoles[];
  permissions?: PermissionString[];
  items?: NavigationItem[];
}

export interface NavigationSection {
  id: NavigationSectionId;
  title: NavigationTitles | string;
  icon: React.ReactElement;
  path?: string;
  roles?: UserRoles[];
  permissions?: PermissionString[];
  items?: NavigationItem[];
}

export type NavigationConfig = NavigationSection[];

// Utility types for better type checking
export type RoleArray = UserRoles[];
export type PermissionArray = PermissionString[];
export type ColorValue = NavigationColors | string;
export type TitleValue = NavigationTitles | string;
