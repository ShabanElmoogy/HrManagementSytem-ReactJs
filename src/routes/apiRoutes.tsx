const version = "/api/v1";

interface AuthRoutes {
  home: string;
  login: string;
  refreshToken: string;
  register: string;
  changePassword: string;
  forgetPassword: string;
  resetPassword: string;
  resendEmailConfirmation: string;
  getUserPhoto: string;
  updateUserPhoto: string;
  getUserInfo: string;
  updateUserInfo: string;
  confirmEmail : string
}

interface CrudRoutes {
  getAll: string;
  getById: (id: string | number) => string;
  add: string;
  update: string;
  delete: (id: string | number) => string;
}

interface StatesRoutes extends CrudRoutes { }

interface DistrictsRoutes extends CrudRoutes {
  getAllByState: (stateId: string | number) => string;
  getDistrictWithAddresses: (id: string | number) => string;
  getCount: string;
}

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

interface AppointmentsRoutes extends Omit<CrudRoutes, 'getById'> {}

// Kanban route interfaces (with additional list-by-parent operations where needed)
interface KanbanBoardMembersRoutes extends CrudRoutes {
  getByBoard: (boardId: string | number) => string;
}

interface KanbanCardAssigneesRoutes extends CrudRoutes {
  getByCard: (cardId: string | number) => string;
  getByUser: (userId: string | number) => string;
}

interface KanbanCardLabelsRoutes extends CrudRoutes {
  getByCard: (cardId: string | number) => string;
}

interface KanbanCardAttachmentsRoutes extends CrudRoutes {
  getByCard: (cardId: string | number) => string;
}

interface BoardTaskCommentsRoutes extends CrudRoutes {
  getByTask: (taskId: string | number) => string;
}

interface BoardTaskAttachmentsRoutes extends CrudRoutes {
  getByTask: (taskId: string | number) => string;
}

interface ApiRoutes {
  version: string;
  auth: AuthRoutes;
  countries: CrudRoutes;
  addressTypes: CrudRoutes;
  states: StatesRoutes;
  districts: DistrictsRoutes;
  roles: RolesRoutes;
  users: UsersRoutes;
  export: ExportRoutes;
  advancedTools: AdvancedToolsRoutes;
  google: GoogleRoutes;
  appointments: AppointmentsRoutes;

  // Kanban
  kanbanBoards: CrudRoutes;
  kanbanColumns: CrudRoutes;
  kanbanCards: CrudRoutes;
  kanbanLabels: CrudRoutes;
  kanbanBoardMembers: KanbanBoardMembersRoutes;
  kanbanCardAssignees: KanbanCardAssigneesRoutes;
  kanbanCardLabels: KanbanCardLabelsRoutes;
  kanbanCardComments: CrudRoutes;
  kanbanCardAttachments: KanbanCardAttachmentsRoutes;
  boardTasks: CrudRoutes;
  boardTaskComments: BoardTaskCommentsRoutes;
  boardTaskAttachments: BoardTaskAttachmentsRoutes;
}

const apiRoutes: ApiRoutes = {
  version,

  auth: {
    home: "/",
    login: `${version}/auth/login`,
    refreshToken: `${version}/auth/refreshToken`,
    register: `${version}/auth/register`,
    changePassword: "accountInfo/changePassword",
    forgetPassword: `${version}/forgetPassword`,
    resetPassword: `${version}/auth/resetPassword`,
    resendEmailConfirmation: `${version}/auth/resendConfirmationEmail`,
    getUserPhoto: "accountInfo/getUserPhoto",
    updateUserPhoto: "accountInfo/updateUserPicture",
    getUserInfo: "accountInfo/getInfo",
    updateUserInfo: "accountInfo/updateInfo",
    confirmEmail: `${version}/auth/confirmEmail`,
  },

  //Basic Data
  countries: {
    getAll: `${version}/countries/getAll`,
    getById: (id: string | number) => `${version}/countries/${id}`,
    add: `${version}/countries/add`,
    update: `${version}/countries/update`,
    delete: (id: string | number) => `${version}/countries/delete/${id}`,
  },
  addressTypes: {
    getAll: `${version}/addressTypes/getAll`,
    getById: (id: string | number) => `${version}/addressTypes/${id}`,
    add: `${version}/addressTypes/add`,
    update: `${version}/addressTypes/update`,
    delete: (id: string | number) => `${version}/addressTypes/delete/${id}`,
  },
  states: {
    getAll: `${version}/states/getAll`,
    getById: (id: string | number) => `${version}/states/${id}`,
    add: `${version}/states/add`,
    update: `${version}/states/update`,
    delete: (id: string | number) => `${version}/states/delete/${id}`,
  },
  districts: {
    getAll: `${version}/districts/getAll`,
    getById: (id: string | number) => `${version}/districts/${id}`,
    getAllByState: (stateId: string | number) => `${version}/districts/getAllByState/by-state/${stateId}`,
    getDistrictWithAddresses: (id: string | number) => `${version}/districts/getDistrictWithAddresses/${id}/addresses`,
    add: `${version}/districts/add`,
    update: `${version}/districts/update`,
    delete: (id: string | number) => `${version}/districts/delete/${id}`,
    getCount: `${version}/districts/getCount/count`,
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

  appointments: {
    getAll: `${version}/Appointments/GetAll`,
    add: `${version}/Appointments/Add`,
    update: `${version}/Appointments/Update`,
    delete: (id: string | number) => `${version}/Appointments/Delete?id=${id}`,
  },

  // Kanban endpoints
  kanbanBoards: {
    getAll: `${version}/kanbanboards`,
    getById: (id: string | number) => `${version}/kanbanboards/${id}`,
    add: `${version}/kanbanboards`,
    update: `${version}/kanbanboards`,
    delete: (id: string | number) => `${version}/kanbanboards/${id}`,
  },
  kanbanColumns: {
    getAll: `${version}/kanbancolumns`,
    getById: (id: string | number) => `${version}/kanbancolumns/${id}`,
    add: `${version}/kanbancolumns`,
    update: `${version}/kanbancolumns`,
    delete: (id: string | number) => `${version}/kanbancolumns/${id}`,
  },
  kanbanCards: {
    getAll: `${version}/kanbancards`,
    getById: (id: string | number) => `${version}/kanbancards/${id}`,
    add: `${version}/kanbancards`,
    update: `${version}/kanbancards`,
    delete: (id: string | number) => `${version}/kanbancards/${id}`,
  },
  kanbanLabels: {
    getAll: `${version}/KanbanLabels/GetAll`,
    getById: (id: string | number) => `${version}/KanbanLabels/GetById/${id}`,
    add: `${version}/KanbanLabels/Add`,
    update: `${version}/KanbanLabels/Update`,
    delete: (id: string | number) => `${version}/KanbanLabels/Delete/${id}`,
  },
  kanbanBoardMembers: {
    getAll: `${version}/kanbanboardmembers`,
    getById: (id: string | number) => `${version}/kanbanboardmembers/${id}`,
    getByBoard: (boardId: string | number) => `${version}/kanbanboardmembers/board/${boardId}`,
    add: `${version}/kanbanboardmembers`,
    update: `${version}/kanbanboardmembers`,
    delete: (id: string | number) => `${version}/kanbanboardmembers/${id}`,
  },
  kanbanCardAssignees: {
    getAll: `${version}/kanbancardassignees`,
    getById: (id: string | number) => `${version}/kanbancardassignees/${id}`,
    getByCard: (cardId: string | number) => `${version}/kanbancardassignees/card/${cardId}`,
    getByUser: (userId: string | number) => `${version}/kanbancardassignees/user/${userId}`,
    add: `${version}/kanbancardassignees`,
    update: `${version}/kanbancardassignees`,
    delete: (id: string | number) => `${version}/kanbancardassignees/${id}`,
  },
  kanbanCardLabels: {
    getAll: `${version}/kanbancardlabels`,
    getById: (id: string | number) => `${version}/kanbancardlabels/${id}`,
    getByCard: (cardId: string | number) => `${version}/kanbancardlabels/card/${cardId}`,
    add: `${version}/kanbancardlabels`,
    update: `${version}/kanbancardlabels`,
    delete: (id: string | number) => `${version}/kanbancardlabels/${id}`,
  },
  kanbanCardComments: {
    getAll: `${version}/KanbanCardComments/GetAll`,
    getById: (id: string | number) => `${version}/KanbanCardComments/GetById/${id}`,
    add: `${version}/KanbanCardComments/Add`,
    update: `${version}/KanbanCardComments/Update`,
    delete: (id: string | number) => `${version}/KanbanCardComments/Delete/${id}`,
  },
  kanbanCardAttachments: {
    getAll: `${version}/kanbancardattachments`,
    getById: (id: string | number) => `${version}/kanbancardattachments/${id}`,
    getByCard: (cardId: string | number) => `${version}/kanbancardattachments/card/${cardId}`,
    add: `${version}/kanbancardattachments`,
    update: `${version}/kanbancardattachments`,
    delete: (id: string | number) => `${version}/kanbancardattachments/${id}`,
  },
  boardTasks: {
    getAll: `${version}/BoardTasks/GetAll`,
    getById: (id: string | number) => `${version}/BoardTasks/GetById/${id}`,
    add: `${version}/BoardTasks/Add`,
    update: `${version}/BoardTasks/Update`,
    delete: (id: string | number) => `${version}/BoardTasks/Delete/${id}`,
  },
  boardTaskComments: {
    getAll: `${version}/BoardTaskComments/GetAll`,
    getById: (id: string | number) => `${version}/BoardTaskComments/GetById/${id}`,
    getByTask: (taskId: string | number) => `${version}/BoardTaskComments/GetByTaskId/task/${taskId}`,
    add: `${version}/BoardTaskComments/Add`,
    update: `${version}/BoardTaskComments/Update`,
    delete: (id: string | number) => `${version}/BoardTaskComments/Delete/${id}`,
  },
  boardTaskAttachments: {
    getAll: `${version}/boardtaskattachments`,
    getById: (id: string | number) => `${version}/boardtaskattachments/${id}`,
    getByTask: (taskId: string | number) => `${version}/boardtaskattachments/task/${taskId}`,
    add: `${version}/boardtaskattachments`,
    update: `${version}/boardtaskattachments`,
    delete: (id: string | number) => `${version}/boardtaskattachments/${id}`,
  },

  // Google Auth
  google: {
    auth: "/api/account/google-auth",
  },
};

export default apiRoutes;
export type { ApiRoutes, AuthRoutes, CrudRoutes, DistrictsRoutes, RolesRoutes, UsersRoutes, AppointmentsRoutes, KanbanBoardMembersRoutes, KanbanCardAssigneesRoutes, KanbanCardLabelsRoutes, KanbanCardAttachmentsRoutes, BoardTaskCommentsRoutes, BoardTaskAttachmentsRoutes };
