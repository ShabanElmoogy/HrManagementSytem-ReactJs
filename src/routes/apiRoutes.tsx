const version = "/api/v1";

interface AuthRoutes {
  home: string;
  login: string;
  register: string;
  changePassword: string;
  forgetPassword: string;
  resetPassword: string;
  resendEmailConfirmation: string;
  getUserPhoto: string;
  updateUserPhoto: string;
  getUserInfo: string;
  updateUserInfo: string;
}

interface CrudRoutes {
  getAll: string;
  getById: (id: string | number) => string;
  add: string;
  update: string;
  delete: (id: string | number) => string;
}

interface StatesRoutes extends CrudRoutes { }

interface RolesRoutes extends Omit<CrudRoutes, 'delete'> {
  toggle: (id: string | number) => string;
  getRoleClaims: (id: string | number) => string;
  updateRoleClaims: string;
}

interface UsersRoutes {
  getAll: string;
  add: string;
  update: (id: string | number) => string;
  toggle: (id: string | number) => string;
  unlock: (id: string | number) => string;
  revoke: (userId: string | number) => string;
}

interface ExportRoutes {
  excel: string;
  pdf: string;
}

interface AdvancedToolsRoutes {
  getLocalizationApi: string;
  updateLocalizationApi: string;
  trackChanges: string;
}

interface GoogleRoutes {
  auth: string;
}

interface ApiRoutes {
  version: string;
  auth: AuthRoutes;
  countries: CrudRoutes;
  states: StatesRoutes;
  roles: RolesRoutes;
  users: UsersRoutes;
  export: ExportRoutes;
  advancedTools: AdvancedToolsRoutes;
  google: GoogleRoutes;
}

const apiRoutes: ApiRoutes = {
  version,

  auth: {
    home: "/",
    login: `${version}/auth/login`,
    register: `${version}/auth/register`,
    changePassword: "accountInfo/changePassword",
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
    getById: (id: string | number) => `${version}/countries/${id}`,
    add: `${version}/countries/add`,
    update: `${version}/countries/update`,
    delete: (id: string | number) => `${version}/countries/delete/${id}`,
  },
  states: {
    getAll: `${version}/states/getAll`,
    getById: (id: string | number) => `${version}/states/${id}`,
    add: `${version}/states/add`,
    update: `${version}/states/update`,
    delete: (id: string | number) => `${version}/states/delete/${id}`,
  },
  roles: {
    getAll: `${version}/roles/getAll`,
    getById: (id: string | number) => `${version}/roles/${id}`,
    add: `${version}/roles/add`,
    update: `${version}/roles/update`,
    toggle: (id: string | number) => `${version}/roles/toggle/${id}`,
    // Role claims/permissions management
    getRoleClaims: (id: string | number) => `${version}/roles/getRoleClaims?roleId=${id}`,
    updateRoleClaims: `${version}/roles/updateRoleClaims`,
  },
  users: {
    getAll: `${version}/users/getAll`, // ApiRoutes.Users.GetAll
    add: `${version}/users/add`, // ApiRoutes.Users.AddUser
    update: (id: string | number) => `${version}/users/update/${id}`, // ApiRoutes.Users.UpdateUser/{id}
    toggle: (id: string | number) => `${version}/users/toggle/${id}`,
    unlock: (id: string | number) => `${version}/users/unlock/${id}`,
    revoke: (userId: string | number) =>
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
export type { ApiRoutes, AuthRoutes, CrudRoutes, RolesRoutes, UsersRoutes };
