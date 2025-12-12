import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';

export const Route = createRootRoute({
  component: () => (
    <div className="relative min-h-screen bg-background noise-texture">
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  ),
});
