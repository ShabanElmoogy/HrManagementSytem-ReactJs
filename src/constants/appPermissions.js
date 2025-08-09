// src/utils/Permissions.js

class Permissions {
  static Type = "Permissions";

  static ViewAddresses = "Addresses:View";
  static CreateAddresses = "Addresses:Create";
  static EditAddresses = "Addresses:Edit";
  static DeleteAddresses = "Addresses:Delete";

  static ViewAddressTypes = "AddressTypes:View";
  static CreateAddressTypes = "AddressTypes:Create";
  static EditAddressTypes = "AddressTypes:Edit";
  static DeleteAddressTypes = "AddressTypes:Delete";

  static ViewApiKeys = "ApiKeys:View";
  static CreateApiKeys = "ApiKeys:Create";
  static EditApiKeys = "ApiKeys:Edit";
  static DeleteApiKeys = "ApiKeys:Delete";

  static ViewCategories = "Categories:View";
  static CreateCategories = "Categories:Create";
  static EditCategories = "Categories:Edit";
  static DeleteCategories = "Categories:Delete";

  static ViewCountries = "Countries:View";
  static CreateCountries = "Countries:Create";
  static EditCountries = "Countries:Edit";
  static DeleteCountries = "Countries:Delete";

  static ViewDistricts = "Districts:View";
  static CreateDistricts = "Districts:Create";
  static EditDistricts = "Districts:Edit";
  static DeleteDistricts = "Districts:Delete";

  static ViewChangeLogs = "ChangeLogs:View";

  static ViewLocalizations = "Localizations:View";
  static CreateLocalizations = "Localizations:Create";
  static EditLocalizations = "Localizations:Edit";
  static DeleteLocalizations = "Localizations:Delete";

  static ViewReportsCategories = "ReportsCategories:View";
  static CreateReportsCategories = "ReportsCategories:Create";
  static EditReportsCategories = "ReportsCategories:Edit";
  static DeleteReportsCategories = "ReportsCategories:Delete";

  static ViewRoles = "Roles:View";
  static CreateRoles = "Roles:Create";
  static EditRoles = "Roles:Edit";
  static DeleteRoles = "Roles:Delete";

  static ViewStates = "States:View";
  static CreateStates = "States:Create";
  static EditStates = "States:Edit";
  static DeleteStates = "States:Delete";

  static ViewSubCategories = "SubCategories:View";
  static CreateSubCategories = "SubCategories:Create";
  static EditSubCategories = "SubCategories:Edit";
  static DeleteSubCategories = "SubCategories:Delete";

  static ViewUsers = "Users:View";
  static CreateUsers = "Users:Create";
  static EditUsers = "Users:Edit";
  static DeleteUsers = "Users:Delete";

  static getAllPermissions() {
    return Object.getOwnPropertyNames(this)
      .filter((prop) => typeof this[prop] === "string" && prop !== "Type")
      .map((prop) => this[prop]);
  }

  static getModuleName(permission) {
    if (typeof permission === "string" && permission.includes(":")) {
      return permission.split(":")[0];
    }
    return null;
  }

  static getAllModules() {
    const permissions = this.getAllPermissions();
    const modules = permissions
      .map((permission) => this.getModuleName(permission))
      .filter((module) => module !== null);

    // Remove duplicates and return unique modules
    return [...new Set(modules)];
  }
}

export default Permissions;
