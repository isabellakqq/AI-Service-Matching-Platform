import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import Providers from "./pages/Providers";
import ProviderDetail from "./pages/ProviderDetail";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "requests", Component: MyRequests },
      { path: "providers", Component: Providers },
      { path: "providers/:id", Component: ProviderDetail },
      { path: "insights", Component: AIInsights },
      { path: "settings", Component: Settings },
    ],
  },
]);
