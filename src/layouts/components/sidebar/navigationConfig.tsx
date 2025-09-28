// navigationConfig.tsx
import { getBasicDataConfig } from "./configs/basicDataConfig";
import { getAnalyticsConfig } from "./configs/analyticsConfig";
import { getCommunicationConfig } from "./configs/communicationConfig";
import { getDocumentsConfig } from "./configs/documentsConfig";
import { getChatConfig } from "./configs/chatConfig";
import { getChartExamplesConfig } from "./configs/chartExamplesConfig";
import { getAdvancedToolsConfig } from "./configs/advancedToolsConfig";
import { getUsersAndRolesConfig } from "./configs/usersAndRolesConfig";
import { filterNavigationConfig } from "./navigationUtils";

// Import types and enums from separate file
import {
  NavigationConfig,
} from './navigationTypes';

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

  // Filter the configuration based on user permissions
  return filterNavigationConfig(fullConfig);
};