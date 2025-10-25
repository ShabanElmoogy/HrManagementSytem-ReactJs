import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import PullToRefresh from 'pulltorefreshjs';
import { registerLicense } from '@syncfusion/ej2-base';
import { checkForUpdates, forceReload } from './shared/utils/versionManager';

registerLicense('Ix0oFS8QJAw9HSQvXkVhQlBad1hJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxWd0VhXX5acHVQQWhZWEd9XEM=');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppWithPullToRefresh = () => {
  useEffect(() => {
    if (checkForUpdates()) {
      console.log('New version detected, clearing cache...');
      setTimeout(() => forceReload(), 1000);
      return;
    }

    const ptr = PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
        window.location.reload();
      }
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return <AppRoutes />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="438701484360-sb25nra1cea6vhngasldijinaoroislu.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <AppWithPullToRefresh />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </LocalizationProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
