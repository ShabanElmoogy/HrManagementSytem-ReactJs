// Simplified TypeScript permissions system

// Define permission actions and modules
export type PermissionAction = 'View' | 'Create' | 'Edit' | 'Delete';
export type PermissionModule = 
  | 'Addresses' | 'AddressTypes' | 'ApiKeys' | 'Categories' | 'Countries'
  | 'Districts' | 'ChangeLogs' | 'Localizations' | 'ReportsCategories'
  | 'Roles' | 'States' | 'SubCategories' | 'Users';

// Permission string type
export type PermissionString = `${PermissionModule}:${PermissionAction}` | 'ChangeLogs:View';

// All permissions in a simple object with methods for backward compatibility
export const Permissions = {
  // Addresses
  ViewAddresses: "Addresses:View",
  CreateAddresses: "Addresses:Create",
  EditAddresses: "Addresses:Edit",
  DeleteAddresses: "Addresses:Delete",

  // AddressTypes
  ViewAddressTypes: "AddressTypes:View",
  CreateAddressTypes: "AddressTypes:Create",
  EditAddressTypes: "AddressTypes:Edit",
  DeleteAddressTypes: "AddressTypes:Delete",

  // ApiKeys
  ViewApiKeys: "ApiKeys:View",
  CreateApiKeys: "ApiKeys:Create",
  EditApiKeys: "ApiKeys:Edit",
  DeleteApiKeys: "ApiKeys:Delete",

  // Categories
  ViewCategories: "Categories:View",
  CreateCategories: "Categories:Create",
  EditCategories: "Categories:Edit",
  DeleteCategories: "Categories:Delete",

  // Countries
  ViewCountries: "Countries:View",
  CreateCountries: "Countries:Create",
  EditCountries: "Countries:Edit",
  DeleteCountries: "Countries:Delete",

  // Districts
  ViewDistricts: "Districts:View",
  CreateDistricts: "Districts:Create",
  EditDistricts: "Districts:Edit",
  DeleteDistricts: "Districts:Delete",

  // ChangeLogs (View only)
  ViewChangeLogs: "ChangeLogs:View",

  // Localizations
  ViewLocalizations: "Localizations:View",
  CreateLocalizations: "Localizations:Create",
  EditLocalizations: "Localizations:Edit",
  DeleteLocalizations: "Localizations:Delete",

  // ReportsCategories
  ViewReportsCategories: "ReportsCategories:View",
  CreateReportsCategories: "ReportsCategories:Create",
  EditReportsCategories: "ReportsCategories:Edit",
  DeleteReportsCategories: "ReportsCategories:Delete",

  // Roles
  ViewRoles: "Roles:View",
  CreateRoles: "Roles:Create",
  EditRoles: "Roles:Edit",
  DeleteRoles: "Roles:Delete",

  // States
  ViewStates: "States:View",
  CreateStates: "States:Create",
  EditStates: "States:Edit",
  DeleteStates: "States:Delete",

  // SubCategories
  ViewSubCategories: "SubCategories:View",
  CreateSubCategories: "SubCategories:Create",
  EditSubCategories: "SubCategories:Edit",
  DeleteSubCategories: "SubCategories:Delete",

  // Users
  ViewUsers: "Users:View",
  CreateUsers: "Users:Create",
  EditUsers: "Users:Edit",
  DeleteUsers: "Users:Delete",

  // Methods for backward compatibility
  getAllPermissions: () => getAllPermissions(),
  getAllModules: () => getAllModules(),
  getModuleName: (permission: string) => getModuleName(permission),
} as const;

// Helper functions
export const getAllPermissions = (): string[] => {
  const { getAllPermissions: _, getAllModules: __, getModuleName: ___, ...permissions } = Permissions;
  return Object.values(permissions);
};

export const getModuleName = (permission: string): string | null => {
  return permission.includes(':') ? permission.split(':')[0] : null;
};

export const getAllModules = (): string[] => {
  const modules = getAllPermissions().map(getModuleName).filter(Boolean);
  return [...new Set(modules)] as string[];
};

// Permission checking helpers
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.every(permission => userPermissions.includes(permission));
};

// Default export for backward compatibility
export default Permissions;