import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import PullToRefresh from 'pulltorefreshjs';

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
    <BrowserRouter>
      <AppWithPullToRefresh />
    </BrowserRouter>
  </GoogleOAuthProvider>
);