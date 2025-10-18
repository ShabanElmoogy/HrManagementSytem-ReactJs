import { appPermissions } from "@/constants";
import { MyLoadingIndicator } from "@/shared/components";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../features/auth/login/login";
import AuthLayout from "../layouts/authLayout/authLayout";
import MainLayout from "../layouts/mainLayout/mainLayout";
import { appRoutes } from "./appRoutes";

const ProtectedRoute = lazy(() =>
  import("../shared/components/auth/protectedRoute")
);
const Home = lazy(() => import("../features/home/home"));
const AllKpisPage = lazy(() => import("../features/home/AllKpisPage"));
const AllTrendsPage = lazy(() => import("../features/home/AllTrendsPage"));
const AllHealthPipelinePage = lazy(() => import("../features/home/AllHealthPipelinePage"));
const AllGlobalPresencePage = lazy(() => import("../features/home/AllGlobalPresencePage"));
const AllAttendanceTrendsPage = lazy(() => import("../features/home/AllAttendanceTrendsPage"));
const EmailConfirmed = lazy(() => import("../features/auth/emailConfirmed"));
const ForgetPassword = lazy(() => import("../features/auth/forgetPassword"));
const ProfilePage = lazy(() => import("../features/auth/profile/profilePage"));
const ChangePassword = lazy(() =>
  import("../features/auth/profile/profileTabs/changePassword/changePassword")
);
const Register = lazy(() => import("../features/auth/register/register"));
const ResendEmailConfirmation = lazy(() =>
  import("../features/auth/resendEmailConfirmation")
);
const ResetPassword = lazy(() => import("../features/auth/resetPassword"));
const RolePermissionsPage = lazy(() =>
  import("../features/auth/roles/components/rolePermissionsPage")
);
const CountriesPage = lazy(() =>
  import("../features/basicData/countries/countriesPage")
);
const StatesPage = lazy(() =>
  import("../features/basicData/states").then((m) => ({
    default: m.StatesPage,
  }))
);
const DistrictsPage = lazy(() =>
  import("../features/basicData/districts/districtsPage")
);
const AddressTypesPage = lazy(() =>
  import("../features/basicData/addressesType/addressTypesPage")
);
const EmployeePage = lazy(() =>
  import("../features/employee").then((m) => ({ default: m.EmployeePage }))
);
const EmployeeDetailPage = lazy(() =>
  import("../features/employee").then((m) => ({
    default: m.EmployeeDetailPage,
  }))
);
const EmployeeForm = lazy(() =>
  import("../features/employee").then((m) => ({ default: m.EmployeeForm }))
);
const DocumentManagementPage = lazy(() =>
  import("../features/employee").then((m) => ({
    default: m.DocumentManagementPage,
  }))
);
const UsersPage = lazy(() => import("@/features/auth/users/usersPage"));
const RolesPage = lazy(() => import("@/features/auth/roles/rolesPage"));
const TrackChangesGrid = lazy(() =>
  import("@/features/advancedTools/trackChangesGrid")
);
const LocalizationGrid = lazy(() =>
  import("@/features/advancedTools/localizationGrid")
);
const HealthCheck = lazy(() => import("@/features/advancedTools/healthCheck"));
const ApiEndpoints = lazy(() =>
  import("@/features/advancedTools/apiEndpoints")
);
const HangfireDashboard = lazy(() =>
  import("@/features/advancedTools/hangfireDashboard")
);
const ChartExamplesPage = lazy(() =>
  import("@/features/chartExamples/chartExamplesPage")
);
const CountryReport = lazy(() =>
  import("@/features/basicData/countries/reports/CountryReport")
);

// Analytics
const HRMainDashboard = lazy(() =>
  import("@/features/analytics/components/HRMainDashboard")
);
const PerformanceAnalytics = lazy(() =>
  import("@/features/analytics/components/PerformanceAnalytics")
);
const TimeAttendanceAnalytics = lazy(() =>
  import("@/features/analytics/components/TimeAttendanceAnalytics")
);
const EmployeeEngagementDashboard = lazy(() =>
  import("@/features/analytics/components/EmployeeEngagementDashboard")
);
const DocumentAnalytics = lazy(() =>
  import("@/features/analytics/components/DocumentAnalytics")
);
const CustomReportBuilder = lazy(() =>
  import("@/features/analytics/components/CustomReportBuilder")
);
const ReportViewer = lazy(() =>
  import("@/features/analytics/components/ReportViewer")
);
const DataExportTools = lazy(() =>
  import("@/features/analytics/components/DataExportTools")
);

// File Manager
const FilesGrid = lazy(() => import("@/features/FileManager/FilesGrid"));
const MediaViewer = lazy(() =>
  import("@/features/FileManager/mediaViewer/MediaViewer")
);

// Appointments (FullCalendar)
const AppointmentsPage = lazy(() => import("@/features/appointments").then(m => ({ default: m.AppointmentsPage })));

// Communication imports
const MessagingSystem = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.MessagingSystem,
  }))
);
const AnnouncementCenter = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.AnnouncementCenter,
  }))
);
const FeedbackCollection = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.FeedbackCollection,
  }))
);
const CommunicationDashboard = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.CommunicationDashboard,
  }))
);
const NotificationSystem = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.NotificationSystem,
  }))
);
const CommunicationReports = lazy(() =>
  import("@/features/communication").then((m) => ({
    default: m.CommunicationReports,
  }))
);

// Kanban
const KanbanBoards = lazy(() =>
  import("@/features/kanban").then((m) => ({ default: m.KanbanBoards }))
);
const KanbanBoardView = lazy(() =>
  import("@/features/kanban").then((m) => ({ default: m.KanbanBoardView }))
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<MyLoadingIndicator />}>
      <Routes>
        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path={appRoutes.profile}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.login}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.register}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.resendEmailConfirmation}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <ResendEmailConfirmation />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.emailConfirmed}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <EmailConfirmed />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.forgetPassword}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <ForgetPassword />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.resetPassword}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path={appRoutes.changePassword}
            element={
              <Suspense fallback={<MyLoadingIndicator />}>
                <ChangePassword />
              </Suspense>
            }
          />
        </Route>

        {/* Protected Main App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route
              path={appRoutes.home}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <Home />
                </Suspense>
              }
            />

            <Route
              path={appRoutes.kpis}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <AllKpisPage />
                </Suspense>
              }
            />

            <Route
              path={appRoutes.trends}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <AllTrendsPage />
                </Suspense>
              }
            />

            <Route
              path={appRoutes.healthPipeline}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <AllHealthPipelinePage />
                </Suspense>
              }
            />

            <Route
              path={appRoutes.globalPresence}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <AllGlobalPresencePage />
                </Suspense>
              }
            />

            <Route
              path={appRoutes.attendanceTrends}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <AllAttendanceTrendsPage />
                </Suspense>
              }
            />

            {/* ========================================================================= */}
            {/* Basic Data */}
            <Route
              path={appRoutes.basicData.countries}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewCountries]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <CountriesPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.countryReport}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewCountries]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <CountryReport />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.states}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewStates]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <StatesPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.addressTypes}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewAddressTypes]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <AddressTypesPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.districts}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewStates]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DistrictsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.employees}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <EmployeePage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.employeeDetail}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <EmployeeDetailPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.employeeEdit}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewCountries]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <EmployeeForm mode="edit" />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.employeeCreate}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ManageUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <EmployeeForm mode="create" />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.basicData.employeeDocuments}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Chart Examples */}
            <Route
              path={appRoutes.chartExamples}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <ChartExamplesPage />
                </Suspense>
              }
            />

            {/* Roles Management */}
            <Route
              path={appRoutes.auth.rolesPage}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <RolesPage />
                </Suspense>
              }
            />
            <Route
              path={appRoutes.auth.rolePermissionsPage}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <RolePermissionsPage />
                </Suspense>
              }
            />
            <Route
              path={appRoutes.auth.usersPage}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <UsersPage />
                </Suspense>
              }
            />

            {/* Advanced Tools */}
            <Route
              path={appRoutes.advancedTools.trackChanges}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <TrackChangesGrid />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path={appRoutes.advancedTools.localizationApi}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <LocalizationGrid />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path={appRoutes.advancedTools.healthCheck}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <HealthCheck />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path={appRoutes.advancedTools.apiEndpoints}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <ApiEndpoints />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path={appRoutes.advancedTools.hangfireDashboard}
              element={
                <ProtectedRoute>
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <HangfireDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* File Manager */}
            <Route
              path={appRoutes.extras.filesManager}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <FilesGrid />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.extras.mediaViewer}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <MediaViewer />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Appointments */}
            <Route
              path={appRoutes.extras.appointments}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <AppointmentsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* NotificationExample route removed - using simplified notification system */}

            {/* ========================================================================= */}
            {/* Analytics Routes */}
            <Route
              path={appRoutes.analytics.mainDashboard}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <HRMainDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.performanceAnalytics}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <PerformanceAnalytics />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.timeAttendanceAnalytics}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <TimeAttendanceAnalytics />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.employeeEngagement}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <EmployeeEngagementDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.documentAnalytics}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentAnalytics />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.customReports}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <CustomReportBuilder />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.reportViewer}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <ReportViewer />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.analytics.dataExport}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DataExportTools />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* ========================================================================= */}
            {/* Communication Routes */}
            <Route
              path={appRoutes.communication.messaging}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <MessagingSystem />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.communication.announcements}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <AnnouncementCenter />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.communication.feedback}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <FeedbackCollection />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.communication.dashboard}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <CommunicationDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.communication.notifications}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <NotificationSystem />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.communication.reports}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <CommunicationReports />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* ========================================================================= */}
            {/* Document Management Routes */}
            <Route
              path={appRoutes.documents.overview}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.documents.employeeDocuments}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.documents.companyDocuments}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.documents.templates}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.documents.archives}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <DocumentManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* ========================================================================= */}
            {/* Kanban Routes */}
            <Route
              path={appRoutes.kanban.boards}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <KanbanBoards />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path={appRoutes.kanban.boardView}
              element={
                <ProtectedRoute
                  requiredPermissions={[appPermissions.ViewUsers]}
                >
                  <Suspense fallback={<MyLoadingIndicator />}>
                    <KanbanBoardView />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Redirect unmatched routes to home */}
            <Route
              path="*"
              element={<Navigate to={appRoutes.home} replace />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
