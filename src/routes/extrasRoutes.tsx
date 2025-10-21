import { appRoutes } from "./appRoutes";
import { appPermissions } from "@/constants";
import { MyLoadingIndicator } from "@/shared/components";
import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";

const ProtectedRoute = lazy(() =>
  import("../shared/components/auth/protectedRoute")
);
const UsersPage = lazy(() => import("@/features/auth/users/UsersPage.tsx"));
const RolesPage = lazy(() => import("@/features/auth/roles/rolesPage.tsx"));
const RolePermissionsPage = lazy(() =>
  import("../features/auth/roles/components/rolePermissionsPage")
);
const TrackChangesGrid = lazy(() =>
  import("@/features/advancedTools/trackChangesGrid.tsx")
);
const LocalizationGrid = lazy(() =>
  import("@/features/advancedTools/localizationGrid.tsx")
);
const HealthCheck = lazy(() => import("@/features/advancedTools/healthCheck.tsx"));
const ApiEndpoints = lazy(() =>
  import("@/features/advancedTools/apiEndpoints.tsx")
);
const HangfireDashboard = lazy(() =>
  import("@/features/advancedTools/hangfireDashboard.tsx")
);
const FilesGrid = lazy(() => import("@/features/fileManager/FilesGrid.tsx"));
const MediaViewer = lazy(() => import("@/features/fileManager/mediaViewer/MediaViewer.tsx"));
const AppointmentsPage = lazy(() => import("@/features/appointments/pages/AppointmentsPage.tsx"));

export const ExtrasRoutes = () => (
  <>
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
  </>
);