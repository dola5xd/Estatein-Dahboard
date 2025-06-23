import { lazy, Suspense, type JSX } from "react";
import type { RouteObject } from "react-router";
import Loading from "./components/loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import Login from "@/pages/login/Login";
const Register = lazy(() => import("@/pages/register/Register"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const PrivateRoute = lazy(() => import("@/layouts/PrivateRoute"));

const Home = lazy(() => import("@/pages/Dashboard/Home"));
const Clients = lazy(() => import("@/pages/Dashboard/Clients"));
const Properties = lazy(() => import("@/pages/Dashboard/Properties"));
const Ratings = lazy(() => import("@/pages/Dashboard/Ratings"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const NotFoundPage = lazy(() => import("@/pages/Notfound"));

const withSuspense = (Component: JSX.Element) => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Suspense fallback={<Loading />}>{Component}</Suspense>
  </ErrorBoundary>
);

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/register",
    element: withSuspense(<Register />),
  },
  {
    path: "/",
    element: withSuspense(<PrivateRoute />),
    children: [
      {
        path: "/",
        element: withSuspense(
          <SidebarProvider className="flex w-full gap-x-7 py-7">
            <DashboardLayout />
          </SidebarProvider>
        ),
        children: [
          { index: true, element: withSuspense(<Home />) },
          { path: "clients", element: withSuspense(<Clients />) },
          { path: "properties", element: withSuspense(<Properties />) },
          { path: "ratings", element: withSuspense(<Ratings />) },
          { path: "settings", element: withSuspense(<Settings />) },
        ],
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
];
