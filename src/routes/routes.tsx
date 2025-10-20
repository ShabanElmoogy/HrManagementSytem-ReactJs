import { MyLoadingIndicator } from "@/shared/components";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/mainLayout/mainLayout";
import { appRoutes } from "./appRoutes";
import { AuthRoutes } from "./authRoutes";
import { DashboardRoutes } from "./dashboardRoutes";
import { BasicDataRoutes } from "./basicDataRoutes";
import { AnalyticsRoutes } from "./analyticsRoutes";
import { CommunicationRoutes } from "./communicationRoutes";

const ProtectedRoute = lazy(() =>
  import("../shared/components/auth/protectedRoute")
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<MyLoadingIndicator />}>
      <Routes>
        {/* Authentication Routes */}
        {AuthRoutes()}

        {/* Protected Main App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard Routes */}
            {DashboardRoutes()}
            
            {/* Basic Data Routes */}
            {BasicDataRoutes()}
            
            {/* Analytics Routes */}
            {AnalyticsRoutes()}
            
            {/* Extras Routes
            {ExtrasRoutes()} */}
            
            {/* Communication Routes */}
            {CommunicationRoutes()}

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
