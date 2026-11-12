import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { HomeScreen } from './pages/HomeScreen';
import { TVScreen } from './pages/TVScreen';
import { PlayScreen } from './pages/PlayScreen';
import { AdminScreen } from './pages/AdminScreen';
import { TopLoadingBar } from './components/TopLoadingBar';

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
  component: HomeScreen,
});

const tvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tv',
  validateSearch: (search: Record<string, unknown>): { room?: string } => ({
    room: typeof search.room === 'string' ? search.room : 'MDX26',
  }),
  component: TVScreen,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play',
  validateSearch: (search: Record<string, unknown>): { room?: string; round?: string } => ({
    room: typeof search.room === 'string' ? search.room : 'MDX26',
    round: typeof search.round === 'string' ? search.round : undefined,
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
  component: HomeScreen,
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
