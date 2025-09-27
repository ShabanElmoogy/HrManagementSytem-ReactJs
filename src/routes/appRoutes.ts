// appRoutes.ts - Application route definitions with TypeScript support

// Type definitions for route structures
export interface ImportDataRoutes {
  companies: string;
  companyUsers: string;
  servers: string;
}

export interface ExtrasRoutes {
  filesManager: string;
  mediaViewer: string;
  appointments: string;
}

export interface AdvancedToolsRoutes {
  trackChanges: string;
  healthCheck: string;
  apiEndpoints: string;
  localizationApi: string;
  hangfireDashboard: string;
  notificationTest: string;
}

export interface CategoriesRoutes {
  view: string;
  subCategories: string;
}

export interface TicketsRoutes {
  manager: string;
  details: string;
  add: string;
  edit: string;
}

export interface MonitorsRoutes {
  trackChanges: string;
  healthCheck: string;
  apiEndpoints: string;
  localization: string;
  hangfireDashboard: string;
  backups: string;
}

export interface BasicDataRoutes {
  countries: string;
  states: string;
  employees: string;
  employeeDetail: string;
  employeeCreate: string;
}

export interface AuthRoutes {
  rolesPage: string;
  usersPage: string;
  rolePermissionsPage: string;
}

// Main application routes interface
export interface AppRoutes {
  // Auth routes
  login: string;
  register: string;
  resendEmailConfirmation: string;
  emailConfirmed: string;
  forgetPassword: string;
  resetPassword: string;
  changePassword: string;

  // Main app routes
  home: string;
  profile: string;
  ticketWithCommentsExample: string;

  // Nested route objects
  importsData: ImportDataRoutes;
  extras: ExtrasRoutes;
  advancedTools: AdvancedToolsRoutes;
  categories: CategoriesRoutes;
  tickets: TicketsRoutes;
  monitors: MonitorsRoutes;
  basicData: BasicDataRoutes;
  auth: AuthRoutes;

  // Simple routes
  codeSnippets: string;
  applications: string;
  servers: string;
  chat: string;
  chartExamples: string;
}

// Route constants with full type safety
export const appRoutes: AppRoutes = {
  // Auth routes
  login: "login",
  register: "/register",
  resendEmailConfirmation: "resend-email-confirmation",
  emailConfirmed: "auth/emailConfirmation",
  forgetPassword: "/forget-password",
  resetPassword: "resetpassword",
  changePassword: "/change-password",

  // Main app routes
  home: "/",
  profile: "profilePage",
  ticketWithCommentsExample: "TicketWithCommentsExample",

  importsData: {
    companies: "import-companies",
    companyUsers: "import-companyUsers",
    servers: "import-servers",
  },

  extras: {
    filesManager: "extras-filesmanager",
    mediaViewer: "extras-show-media/:id/:fileExtension/:storedFileName/:fileName",
    appointments: "extras-appointments",
  },

  advancedTools: {
    trackChanges: "advancedTools/track-changes",
    healthCheck: "advancedTools/health-check",
    apiEndpoints: "advancedTools/api-endpoints",
    localizationApi: "advancedTools/localization-api",
    hangfireDashboard: "advancedTools/hangfire-dashboard",
    notificationTest: "advancedTools/notification-test",
  },

  // Feature categories
  categories: {
    view: "categories/categoriesViews",
    subCategories: "categories/subCategoriesGrid",
  },

  codeSnippets: "codeSnippets",

  applications: "applications",

  tickets: {
    manager: "tickets/manager",
    details: "tickets/:action/:ticketId",
    add: "tickets/add",
    edit: "tickets/edit/:ticketId",
  },

  servers: "servers",

  monitors: {
    trackChanges: "monitors/track-changes",
    healthCheck: "monitors/health-check",
    apiEndpoints: "monitors/api-endpoints",
    localization: "monitors/localization",
    hangfireDashboard: "monitors/hangfire-dashboard",
    backups: "monitors/backups",
  },

  basicData: {
    countries: "basic-data/countries",
    states: "basic-data/states",
    employees: "basic-data/employees",
    employeeDetail: "basic-data/employees/:id",
    employeeCreate: "basic-data/employees/create",
  },

  auth: {
    rolesPage: "auth/roles",
    usersPage: "auth/users",
    rolePermissionsPage: "auth/manage-role-permissions/:id",
  },

  chat: "chat",
  chartExamples: "chart-examples",
} as const;

// Utility types for better type checking
export type RouteKey = keyof AppRoutes;
export type RouteValue = AppRoutes[RouteKey];

// Helper functions for route manipulation
export const getRouteWithParams = (route: string, params: Record<string, string | number>): string => {
  let result = route;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

// Route validation helper
export const isValidRoute = (route: string): boolean => {
  const flattenRoutes = (obj: any, prefix = ''): string[] => {
    const routes: string[] = [];
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        routes.push(value);
      } else if (typeof value === 'object' && value !== null) {
        routes.push(...flattenRoutes(value, `${prefix}${key}.`));
      }
    });
    return routes;
  };

  const allRoutes = flattenRoutes(appRoutes);
  return allRoutes.includes(route);
};

// Export default for backward compatibility
export default appRoutes;