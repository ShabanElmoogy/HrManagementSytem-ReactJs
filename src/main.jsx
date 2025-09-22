import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import PullToRefresh from 'pulltorefreshjs';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600, // 20ms - data is fresh for 20ms
      gcTime: 10 * 60 * 1000, // 5 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on mount if data is still fresh (respects staleTime)
      // refetchInterval : 3000
    },
    mutations: {
      retry: 1,
    },
  },
});

// Create a wrapper component for PullToRefresh
const AppWithPullToRefresh = () => {
  useEffect(() => {
    // Initialize PullToRefresh after component mounts
    const ptr = PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
        window.location.reload();
      }
    });

    // Cleanup on unmount
    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return <AppRoutes />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="438701484360-sb25nra1cea6vhngasldijinaoroislu.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppWithPullToRefresh />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </GoogleOAuthProvider>
);