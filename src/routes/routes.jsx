import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { MyLoadingIndicator } from "@/shared/components";
import { appPermissions } from "@/constants";

// Layouts
import AuthLayout from "../layouts/authLayout/authLayout";
import MainLayout from "../layouts/mainLayout/mainLayout";

// Components
import ProtectedRoute from "../shared/components/auth/protectedRoute";
import { appRoutes } from "./appRoutes";

// Pages
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
import UsersPage from "@/features/auth/users/usersPage";
import RolesPage from "@/features/auth/roles/rolesPage";
import TrackChangesGrid from "@/features/advancedTools/trackChangesGrid";
import LocalizationGrid from "@/features/advancedTools/localizationGrid";
import HealthCheck from "@/features/advancedTools/healthCheck";
import ApiEndpoints from "@/features/advancedTools/apiEndpoints";
import HangfireDashboard from "@/features/advancedTools/hangfireDashboard";
import EmployeeContainer from "@/features/basicData/employees/EmployeeContainer";
import ChartExamplesPage from "@/features/chartExamples/chartExamplesPage";
// NotificationExample removed - using simplified notification system

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
{/*             
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
            /> */}
            
            {/* Employees Management */}
            <Route
              path={appRoutes.basicData.employees}
              element={
                <Suspense fallback={<MyLoadingIndicator />}>
                  <EmployeeContainer />
                </Suspense>
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
            {/* NotificationExample route removed - using simplified notification system */}

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