// Custom hook for permission management
import { useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  PermissionEnum, 
  PermissionString, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  PermissionModule 
} from "@/constants/appPermissions";

interface DecodedToken {
  [key: string]: any;
  Permissions?: string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string[];
}

interface UsePermissionsReturn {
  // Basic permission checks
  hasPermission: (permission: PermissionEnum | PermissionString) => boolean;
  hasAnyPermission: (permissions: (PermissionEnum | PermissionString)[]) => boolean;
  hasAllPermissions: (permissions: (PermissionEnum | PermissionString)[]) => boolean;
  
  // Module-specific permission checks
  canViewModule: (module: PermissionModule) => boolean;
  canCreateInModule: (module: PermissionModule) => boolean;
  canEditInModule: (module: PermissionModule) => boolean;
  canDeleteInModule: (module: PermissionModule) => boolean;
  
  // Convenience methods for common patterns
  getModulePermissions: (module: PermissionModule) => {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  
  // User info
  userPermissions: string[];
  userRoles: string[];
  isAuthenticated: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const token = sessionStorage.getItem("token");
  
  const { userPermissions, userRoles, isAuthenticated } = useMemo(() => {
    if (!token) {
      return {
        userPermissions: [],
        userRoles: [],
        isAuthenticated: false,
      };
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      
      return {
        userPermissions: decodedToken.Permissions || [],
        userRoles: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return {
        userPermissions: [],
        userRoles: [],
        isAuthenticated: false,
      };
    }
  }, [token]);

  const checkPermission = useCallback(
    (permission: PermissionEnum | PermissionString): boolean => {
      if (!isAuthenticated) return false;
      return hasPermission(userPermissions, permission);
    },
    [userPermissions, isAuthenticated]
  );

  const checkAnyPermission = useCallback(
    (permissions: (PermissionEnum | PermissionString)[]): boolean => {
      if (!isAuthenticated) return false;
      return hasAnyPermission(userPermissions, permissions);
    },
    [userPermissions, isAuthenticated]
  );

  const checkAllPermissions = useCallback(
    (permissions: (PermissionEnum | PermissionString)[]): boolean => {
      if (!isAuthenticated) return false;
      return hasAllPermissions(userPermissions, permissions);
    },
    [userPermissions, isAuthenticated]
  );

  const canViewModule = useCallback(
    (module: PermissionModule): boolean => {
      return checkPermission(`${module}:View` as PermissionString);
    },
    [checkPermission]
  );

  const canCreateInModule = useCallback(
    (module: PermissionModule): boolean => {
      return checkPermission(`${module}:Create` as PermissionString);
    },
    [checkPermission]
  );

  const canEditInModule = useCallback(
    (module: PermissionModule): boolean => {
      return checkPermission(`${module}:Edit` as PermissionString);
    },
    [checkPermission]
  );

  const canDeleteInModule = useCallback(
    (module: PermissionModule): boolean => {
      return checkPermission(`${module}:Delete` as PermissionString);
    },
    [checkPermission]
  );

  const getModulePermissions = useCallback(
    (module: PermissionModule) => ({
      canView: canViewModule(module),
      canCreate: canCreateInModule(module),
      canEdit: canEditInModule(module),
      canDelete: canDeleteInModule(module),
    }),
    [canViewModule, canCreateInModule, canEditInModule, canDeleteInModule]
  );

  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    canViewModule,
    canCreateInModule,
    canEditInModule,
    canDeleteInModule,
    getModulePermissions,
    userPermissions,
    userRoles,
    isAuthenticated,
  };
};

// Specialized hook for Countries module
export const useCountriesPermissions = () => {
  const permissions = usePermissions();
  
  return useMemo(() => ({
    ...permissions.getModulePermissions('Countries'),
    // Additional country-specific permission checks can be added here
    canManageCountries: permissions.hasAnyPermission([
      PermissionEnum.CreateCountries,
      PermissionEnum.EditCountries,
      PermissionEnum.DeleteCountries,
    ]),
  }), [permissions]);
};

// Generic hook factory for any module
export const createModulePermissionsHook = (module: PermissionModule) => {
  return () => {
    const permissions = usePermissions();
    return permissions.getModulePermissions(module);
  };
};

export default usePermissions;