const version = "/api/v1";

const apiRoutes = {
  version,

  auth: {
    home: "/",
    login: `${version}/auth/login`,
    register: `${version}/auth/register`,
    chnagePassword: "accountInfo/changePassword",
    forgetPassword: `${version}/forgetPassword`,
    resetPassword: `${version}/auth/resetPassword`,
    resendEmailConfirmation: `${version}/auth/resendConfirmationEmail`,
    getUserPhoto: "accountInfo/getUserPhoto",
    updateUserPhoto: "accountInfo/updateUserPicture",
    getUserInfo: "accountInfo/getInfo",
    updateUserInfo: "accountInfo/updateInfo",
  },

  //Basic Data
  countries: {
    getAll: `${version}/countries/getAll`,
    getById: (id) => `${version}/countries/${id}`,
    add: `${version}/countries/add`,
    update: `${version}/countries/update`,
    delete: (id) => `${version}/countries/delete/${id}`,
  },
  states: {
    getAll: `${version}/states/getAll`,
    getById: (id) => `${version}/states/${id}`,
    add: `${version}/states/add`,
    update: `${version}/states/update`,
    delete: (id) => `${version}/states/delete/${id}`,
  },
  roles: {
    getAll: `${version}/roles/getAll`,
    getById: (id) => `${version}/roles/${id}`,
    add: `${version}/roles/add`,
    update: `${version}/roles/update`,
    toggle: (id) => `${version}/roles/toggle/${id}`,
    // Role claims/permissions management
    getRoleClaims: (id) => `${version}/roles/getRoleClaims?roleId=${id}`,
    updateRoleClaims: `${version}/roles/updateRoleClaims`,
  },
  users: {
    getAll: `${version}/users/getAll`, // ApiRoutes.Users.GetAll
    add: `${version}/users/add`, // ApiRoutes.Users.AddUser
    update: (id) => `${version}/users/update/${id}`, // ApiRoutes.Users.UpdateUser/{id}
    toggle: (id) => `${version}/users/toggle/${id}`,
    unlock: (id) => `${version}/users/unlock/${id}`,
    revoke: (userId) =>
      `${version}/auth/revokeRefreshTokenByUserId?userId=${userId}`, // ApiRoutes.Users.ToggleUsers/{id}
  },
  export: {
    excel: `${version}/export/exportExcel`,
    pdf: `${version}/exportPdf/generateSyncfusionPdf`,
  },
  advancedTools: {
    getLocalizationApi: `${version}/localization/getLocalization`,
    updateLocalizationApi: `${version}/localization/updateLocalizationKey`,
    trackChanges: `${version}/entityChangeLogs/getAllChangesLogs`,
  },
  // Google Auth
  google: {
    auth: "/api/account/google-auth",
  },
};

export default apiRoutes;
