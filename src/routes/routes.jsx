import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { MyLoadingIndicator } from "@/shared/components";
import { appPermissions } from "@/constants";
import AuthLayout from "../layouts/authLayout/authLayout";
import MainLayout from "../layouts/mainLayout/mainLayout";
import ProtectedRoute from "../shared/components/auth/protectedRoute";
import { appRoutes } from "./appRoutes";
import Home from "../features/home/home";
import EmailConfirmed from "../features/auth/emailConfirmed";
import ForgetPassword from "../features/auth/forgetPassword";
import Login from "../features/auth/login/login";
import ProfilePage from "../features/auth/profile/profilePage";
import ChangePassword from "../features/auth/profile/profileTabs/changePassword/changePassword";
import Register from "../features/auth/register/register";
import ResendEmailConfirmation from "../features/auth/resendEmailConfirmation";
import ResetPassword from "../features/auth/resetPassword";
import RolePermissionsPage from "../features/auth/roles/components/rolePermissionsPage";
import CountriesPage from "../features/basicData/countries/countriesPage";
import { StatesPage } from "../features/basicData/states";
import DistrictsPage from "../features/basicData/districts/districtsPage";
import AddressTypesPage from "../features/basicData/addressesType/addressTypesPage";
import {
  EmployeePage,
  EmployeeDetailPage,
  EmployeeForm,
  DocumentManagementPage,
} from "../features/employee";
import UsersPage from "@/features/auth/users/usersPage";
import RolesPage from "@/features/auth/roles/rolesPage";
import TrackChangesGrid from "@/features/advancedTools/trackChangesGrid";
import LocalizationGrid from "@/features/advancedTools/localizationGrid";
import HealthCheck from "@/features/advancedTools/healthCheck";
import ApiEndpoints from "@/features/advancedTools/apiEndpoints";
import HangfireDashboard from "@/features/advancedTools/hangfireDashboard";
import ChartExamplesPage from "@/features/chartExamples/chartExamplesPage";
import CountryReport from "@/features/basicData/countries/reports/CountryReport";

import {
  HRMainDashboard,
  PerformanceAnalytics,
  TimeAttendanceAnalytics,
  EmployeeEngagementDashboard,
  DocumentAnalytics,
  CustomReportBuilder,
  ReportViewer,
  DataExportTools,
} from "@/features/analytics";

// File Manager
import FilesGrid from "@/features/FileManager/FilesGrid";
import MediaViewer from "@/features/FileManager/MediaViewer";

// Communication imports
import {
  MessagingSystem,
  AnnouncementCenter,
  FeedbackCollection,
  CommunicationDashboard,
  NotificationSystem,
  CommunicationReports,
} from "@/features/communication";

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
