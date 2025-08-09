/* eslint-disable react/prop-types */
import { jwtDecode } from "jwt-decode";

// Authorization utility class
export default class AuthService {
  static getDecodedToken() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  static getCurrentUser() {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return null;

    return {
      id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      userName: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      roles: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
      permissions: decodedToken["Permissions"] || [],
    };
  }

  static getUserClaims() {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return { userRole: [], userPermissions: [] };
    }
    const userRole =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] || [];
    const userPermissions = decodedToken["Permissions"] || [];
    return { userRole, userPermissions };
  }

  static isAuthenticated() {
    return !!sessionStorage.getItem("token");
  }

  static isInRole(allowedRoles = []) {
    if (!this.isAuthenticated()) return false;

    const { userRole } = this.getUserClaims();

    // If no roles specified, no role requirement
    if (!allowedRoles.length) return true;

    // Check if user has any of the allowed roles
    return allowedRoles.some((role) => userRole.includes(role));
  }

  static hasPermission(requiredPermissions = []) {
    if (!this.isAuthenticated()) return false;

    const { userPermissions } = this.getUserClaims();

    // If no permissions specified, no permission requirement
    if (!requiredPermissions.length) return true;

    // Check if user has any of the required permissions
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }

  static isAuthorized(allowedRoles = [], requiredPermissions = []) {
    // User is authorized if they have any of the roles OR any of the permissions
    return (
      this.isInRole(allowedRoles) || this.hasPermission(requiredPermissions)
    );
  }
}
