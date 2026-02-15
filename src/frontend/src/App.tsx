import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import VocabularyPage from './pages/VocabularyPage';
import SettingsPage from './pages/SettingsPage';
import ConversationPage from './pages/ConversationPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/practice',
  component: PracticePage,
});

const vocabularyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vocabulary',
  component: VocabularyPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversation',
  component: ConversationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  practiceRoute,
  vocabularyRoute,
  settingsRoute,
  conversationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
