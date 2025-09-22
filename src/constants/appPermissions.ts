// TypeScript version of appPermissions.js
// Enhanced with proper typing, enums, and type safety

// Define permission actions as a union type
export type PermissionAction = 'View' | 'Create' | 'Edit' | 'Delete';

// Define all available modules
export type PermissionModule = 
  | 'Addresses'
  | 'AddressTypes'
  | 'ApiKeys'
  | 'Categories'
  | 'Countries'
  | 'Districts'
  | 'ChangeLogs'
  | 'Localizations'
  | 'ReportsCategories'
  | 'Roles'
  | 'States'
  | 'SubCategories'
  | 'Users';

// Define the permission string format
export type PermissionString = `${PermissionModule}:${PermissionAction}` | 'ChangeLogs:View';

// Enum for better type safety and IntelliSense
export enum PermissionEnum {
  // Addresses
  ViewAddresses = "Addresses:View",
  CreateAddresses = "Addresses:Create",
  EditAddresses = "Addresses:Edit",
  DeleteAddresses = "Addresses:Delete",

  // Address Types
  ViewAddressTypes = "AddressTypes:View",
  CreateAddressTypes = "AddressTypes:Create",
  EditAddressTypes = "AddressTypes:Edit",
  DeleteAddressTypes = "AddressTypes:Delete",

  // API Keys
  ViewApiKeys = "ApiKeys:View",
  CreateApiKeys = "ApiKeys:Create",
  EditApiKeys = "ApiKeys:Edit",
  DeleteApiKeys = "ApiKeys:Delete",

  // Categories
  ViewCategories = "Categories:View",
  CreateCategories = "Categories:Create",
  EditCategories = "Categories:Edit",
  DeleteCategories = "Categories:Delete",

  // Countries
  ViewCountries = "Countries:View",
  CreateCountries = "Countries:Create",
  EditCountries = "Countries:Edit",
  DeleteCountries = "Countries:Delete",

  // Districts
  ViewDistricts = "Districts:View",
  CreateDistricts = "Districts:Create",
  EditDistricts = "Districts:Edit",
  DeleteDistricts = "Districts:Delete",

  // Change Logs (View only)
  ViewChangeLogs = "ChangeLogs:View",

  // Localizations
  ViewLocalizations = "Localizations:View",
  CreateLocalizations = "Localizations:Create",
  EditLocalizations = "Localizations:Edit",
  DeleteLocalizations = "Localizations:Delete",

  // Reports Categories
  ViewReportsCategories = "ReportsCategories:View",
  CreateReportsCategories = "ReportsCategories:Create",
  EditReportsCategories = "ReportsCategories:Edit",
  DeleteReportsCategories = "ReportsCategories:Delete",

  // Roles
  ViewRoles = "Roles:View",
  CreateRoles = "Roles:Create",
  EditRoles = "Roles:Edit",
  DeleteRoles = "Roles:Delete",

  // States
  ViewStates = "States:View",
  CreateStates = "States:Create",
  EditStates = "States:Edit",
  DeleteStates = "States:Delete",

  // Sub Categories
  ViewSubCategories = "SubCategories:View",
  CreateSubCategories = "SubCategories:Create",
  EditSubCategories = "SubCategories:Edit",
  DeleteSubCategories = "SubCategories:Delete",

  // Users
  ViewUsers = "Users:View",
  CreateUsers = "Users:Create",
  EditUsers = "Users:Edit",
  DeleteUsers = "Users:Delete",
}

// Interface for permission checking
export interface IPermissionChecker {
  hasPermission(permission: PermissionString | PermissionEnum): boolean;
  hasAnyPermission(permissions: (PermissionString | PermissionEnum)[]): boolean;
  hasAllPermissions(permissions: (PermissionString | PermissionEnum)[]): boolean;
  getModulePermissions(module: PermissionModule): PermissionString[];
}

// Enhanced Permissions class with TypeScript features
class Permissions {
  static readonly Type = "Permissions" as const;

  // Addresses
  static readonly ViewAddresses = PermissionEnum.ViewAddresses;
  static readonly CreateAddresses = PermissionEnum.CreateAddresses;
  static readonly EditAddresses = PermissionEnum.EditAddresses;
  static readonly DeleteAddresses = PermissionEnum.DeleteAddresses;

  // Address Types
  static readonly ViewAddressTypes = PermissionEnum.ViewAddressTypes;
  static readonly CreateAddressTypes = PermissionEnum.CreateAddressTypes;
  static readonly EditAddressTypes = PermissionEnum.EditAddressTypes;
  static readonly DeleteAddressTypes = PermissionEnum.DeleteAddressTypes;

  // API Keys
  static readonly ViewApiKeys = PermissionEnum.ViewApiKeys;
  static readonly CreateApiKeys = PermissionEnum.CreateApiKeys;
  static readonly EditApiKeys = PermissionEnum.EditApiKeys;
  static readonly DeleteApiKeys = PermissionEnum.DeleteApiKeys;

  // Categories
  static readonly ViewCategories = PermissionEnum.ViewCategories;
  static readonly CreateCategories = PermissionEnum.CreateCategories;
  static readonly EditCategories = PermissionEnum.EditCategories;
  static readonly DeleteCategories = PermissionEnum.DeleteCategories;

  // Countries
  static readonly ViewCountries = PermissionEnum.ViewCountries;
  static readonly CreateCountries = PermissionEnum.CreateCountries;
  static readonly EditCountries = PermissionEnum.EditCountries;
  static readonly DeleteCountries = PermissionEnum.DeleteCountries;

  // Districts
  static readonly ViewDistricts = PermissionEnum.ViewDistricts;
  static readonly CreateDistricts = PermissionEnum.CreateDistricts;
  static readonly EditDistricts = PermissionEnum.EditDistricts;
  static readonly DeleteDistricts = PermissionEnum.DeleteDistricts;

  // Change Logs
  static readonly ViewChangeLogs = PermissionEnum.ViewChangeLogs;

  // Localizations
  static readonly ViewLocalizations = PermissionEnum.ViewLocalizations;
  static readonly CreateLocalizations = PermissionEnum.CreateLocalizations;
  static readonly EditLocalizations = PermissionEnum.EditLocalizations;
  static readonly DeleteLocalizations = PermissionEnum.DeleteLocalizations;

  // Reports Categories
  static readonly ViewReportsCategories = PermissionEnum.ViewReportsCategories;
  static readonly CreateReportsCategories = PermissionEnum.CreateReportsCategories;
  static readonly EditReportsCategories = PermissionEnum.EditReportsCategories;
  static readonly DeleteReportsCategories = PermissionEnum.DeleteReportsCategories;

  // Roles
  static readonly ViewRoles = PermissionEnum.ViewRoles;
  static readonly CreateRoles = PermissionEnum.CreateRoles;
  static readonly EditRoles = PermissionEnum.EditRoles;
  static readonly DeleteRoles = PermissionEnum.DeleteRoles;

  // States
  static readonly ViewStates = PermissionEnum.ViewStates;
  static readonly CreateStates = PermissionEnum.CreateStates;
  static readonly EditStates = PermissionEnum.EditStates;
  static readonly DeleteStates = PermissionEnum.DeleteStates;

  // Sub Categories
  static readonly ViewSubCategories = PermissionEnum.ViewSubCategories;
  static readonly CreateSubCategories = PermissionEnum.CreateSubCategories;
  static readonly EditSubCategories = PermissionEnum.EditSubCategories;
  static readonly DeleteSubCategories = PermissionEnum.DeleteSubCategories;

  // Users
  static readonly ViewUsers = PermissionEnum.ViewUsers;
  static readonly CreateUsers = PermissionEnum.CreateUsers;
  static readonly EditUsers = PermissionEnum.EditUsers;
  static readonly DeleteUsers = PermissionEnum.DeleteUsers;

  /**
   * Get all available permissions
   * @returns Array of all permission strings
   */
  static getAllPermissions(): PermissionString[] {
    return Object.values(PermissionEnum);
  }

  /**
   * Extract module name from permission string
   * @param permission - Permission string to parse
   * @returns Module name or null if invalid format
   */
  static getModuleName(permission: string): PermissionModule | null {
    if (typeof permission === "string" && permission.includes(":")) {
      const moduleName = permission.split(":")[0] as PermissionModule;
      // Validate that it's a known module
      const validModules: PermissionModule[] = [
        'Addresses', 'AddressTypes', 'ApiKeys', 'Categories', 'Countries',
        'Districts', 'ChangeLogs', 'Localizations', 'ReportsCategories',
        'Roles', 'States', 'SubCategories', 'Users'
      ];
      return validModules.includes(moduleName) ? moduleName : null;
    }
    return null;
  }

  /**
   * Get all unique module names
   * @returns Array of unique module names
   */
  static getAllModules(): PermissionModule[] {
    const permissions = this.getAllPermissions();
    const modules = permissions
      .map((permission) => this.getModuleName(permission))
      .filter((module): module is PermissionModule => module !== null);

    // Remove duplicates and return unique modules
    return [...new Set(modules)];
  }

  /**
   * Get all permissions for a specific module
   * @param module - Module name
   * @returns Array of permissions for the module
   */
  static getModulePermissions(module: PermissionModule): PermissionString[] {
    return this.getAllPermissions().filter(permission => 
      permission.startsWith(`${module}:`)
    );
  }

  /**
   * Check if a permission string is valid
   * @param permission - Permission string to validate
   * @returns True if valid, false otherwise
   */
  static isValidPermission(permission: string): permission is PermissionString {
    return this.getAllPermissions().includes(permission as PermissionString);
  }

  /**
   * Get permissions by action type
   * @param action - Action type (View, Create, Edit, Delete)
   * @returns Array of permissions with the specified action
   */
  static getPermissionsByAction(action: PermissionAction): PermissionString[] {
    return this.getAllPermissions().filter(permission => 
      permission.endsWith(`:${action}`)
    );
  }

  /**
   * Create a permission string from module and action
   * @param module - Module name
   * @param action - Action type
   * @returns Permission string
   */
  static createPermission(module: PermissionModule, action: PermissionAction): PermissionString {
    return `${module}:${action}` as PermissionString;
  }
}

// Helper functions for permission checking
export const hasPermission = (
  userPermissions: string[], 
  requiredPermission: PermissionString | PermissionEnum
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (
  userPermissions: string[], 
  requiredPermissions: (PermissionString | PermissionEnum)[]
): boolean => {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export const hasAllPermissions = (
  userPermissions: string[], 
  requiredPermissions: (PermissionString | PermissionEnum)[]
): boolean => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

// Export both the class and enum for flexibility
export default Permissions;
export { PermissionEnum as Permissions };
