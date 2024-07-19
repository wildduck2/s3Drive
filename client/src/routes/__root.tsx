import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// <ReactQueryDevtools initialIsOpen={false} />
// <TanStackRouterDevtools position="bottom-right" />
export const Route = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
})
