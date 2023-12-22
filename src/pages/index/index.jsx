import { Route } from "@tanstack/react-router"
import rootRoute from "../root"
import { useQuery } from "@tanstack/react-query";
import { MapsList } from "./MapsList";
import mapApi from "../../api";

export function IndexPage() {

  const { isPending, error, data } = useQuery({
    queryKey: ['portal'],
    queryFn: () =>
      mapApi.get(`portals/${window.PORTAL_KEY}/`),
  })

  return (
    <div>
      <h1>NINA Maps</h1>
      <h3>Published Maps</h3>
      <MapsList />
    </div>
  );
}

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  component: IndexPage,
  path: '/',
})
