export const appRoutes = {
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
    mediaViewer:
      "extras-show-media/:id/:fileExtension/:storedFileName/:fileName",
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

  reports: {
    queryBuilder: "reports/query-builder",
  },
  basicData: {
    countries: "basic-data/countries",
    states: "basic-data/states",
    employees: "basic-data/employees",
  },
  auth: {
    rolesPage: "auth/roles",
    usersPage: "auth/users",
    rolePermissionsPage: "auth/manage-role-permissions/:id",
  },
  chat: "chat",
  chartExamples: "chart-examples",
};