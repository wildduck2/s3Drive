import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// <TanStackRouterDevtools position="bottom-right" />
// <ReactQueryDevtools initialIsOpen={false} />
export const Route = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
})
