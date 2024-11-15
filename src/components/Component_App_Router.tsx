import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Import all page components
import Page_About from "../pages/Page_About";
import Page_Articles from "../pages/Page_Articles";
import Page_FAQ from "../pages/Page_FAQ";
import Page_Red_Eye from "../pages/Page_Red_Eye";
import Page_Vendor from "../pages/Page_Vendor";
import Page_Landing from "../pages/Page_Landing";

// JSON map for route configuration
const routeConfig = [
  { path: "/", component: Page_Landing },
  { path: "/about", component: Page_About },
  { path: "/articles", component: Page_Articles },
  { path: "/faq", component: Page_FAQ },
  { path: "/red_eye", component: Page_Red_Eye },
  { path: "/vendor", component: Page_Vendor },
];

// Custom hook to normalize paths for case-insensitive routing
const NormalizePath: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase();

  if (location.pathname !== normalizedPath) {
    return <Navigate to={normalizedPath} replace />;
  }

  return <>{children}</>;
};

export function useAppNavigate() {
  const navigate = useNavigate();

  return (path: string, newTab = false) => {
    if (path.startsWith("http") || path.startsWith("https")) {
      window.location.href = path; // Navigate to external URLs
    } else {
      if (newTab) {
        window.open(window.location.origin + path, "_blank");
      } else {
        navigate(path); // Internal navigation
      }
    }
  };
}

// Main Router Component
export const Component_App_Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NormalizePath>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routeConfig.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </NormalizePath>
    </BrowserRouter>
  );
};
