import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";

// ─── Lazy page imports ────────────────────────────────────────────────────────
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AreasPage = lazy(() => import("./pages/AreasPage"));
const ReadingsPage = lazy(() => import("./pages/ReadingsPage"));
const PressurePage = lazy(() => import("./pages/PressurePage"));
const LeaksPage = lazy(() => import("./pages/LeaksPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// ─── Auth guard wrapper ───────────────────────────────────────────────────────
function AuthenticatedLayout() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

// ─── Route Tree ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthenticatedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const areasRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/areas",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AreasPage />
    </Suspense>
  ),
});

const readingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/readings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReadingsPage />
    </Suspense>
  ),
});

const pressureRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/pressure",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PressurePage />
    </Suspense>
  ),
});

const leaksRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/leaks",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LeaksPage />
    </Suspense>
  ),
});

const mapRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/map",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MapPage />
    </Suspense>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/reports",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReportsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authRoute.addChildren([
    dashboardRoute,
    areasRoute,
    readingsRoute,
    pressureRoute,
    leaksRoute,
    mapRoute,
    reportsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
