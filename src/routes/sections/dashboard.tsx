import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewPrivilegePage = lazy(() => import('src/pages/dashboard/privilege'));
const OverviewStackDetectPage = lazy(() => import('src/pages/dashboard/stack-detect'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// Signature
const SignatureListPage = lazy(() => import('src/pages/dashboard/signature/list'));
const SignatureCreatePage = lazy(() => import('src/pages/dashboard/signature/new'));
const SignatureEditPage = lazy(() => import('src/pages/dashboard/signature/edit'));
// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },

      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'privilege', element: <OverviewPrivilegePage /> },
      { path: 'detect', element: <OverviewStackDetectPage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'signature',
        children: [
          // { element: <SignatureProfilePage />, index: true },
          { path: 'list', element: <SignatureListPage /> },
          { path: 'new', element: <SignatureCreatePage /> },
          { path: ':id/edit', element: <SignatureEditPage /> },
        ],
      },
    ],
  },
];
