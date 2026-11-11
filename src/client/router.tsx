import React, { useEffect, useState } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { TVScreen } from './pages/TVScreen';
import { PlayScreen } from './pages/PlayScreen';
import { AdminScreen } from './pages/AdminScreen';
import { TopLoadingBar } from './components/TopLoadingBar';
import { detectMobileViewport } from './helpers/networkHelpers';

const SmartDeviceEntry: React.FC = () => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => detectMobileViewport());

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(detectMobileViewport());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobileDevice ? <PlayScreen /> : <TVScreen />;
};

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TopLoadingBar />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SmartDeviceEntry,
});

const tvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tv',
  component: TVScreen,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play',
  validateSearch: (search: Record<string, unknown>): { room?: string } => ({
    room: typeof search.room === 'string' ? search.room : 'MDX26',
  }),
  component: PlayScreen,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminScreen,
});

const admAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/adm',
  component: AdminScreen,
});

const fallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: SmartDeviceEntry,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tvRoute,
  playRoute,
  adminRoute,
  admAliasRoute,
  fallbackRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
