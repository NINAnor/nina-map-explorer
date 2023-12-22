import { Outlet, RootRoute } from "@tanstack/react-router";

function Root() {
  return (
    <>
        <Outlet />
    </>
  );
}

const rootRoute = new RootRoute({
    component: Root,
})

export default rootRoute;
