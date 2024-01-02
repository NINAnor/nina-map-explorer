import { Route } from "@tanstack/react-router"
import rootRoute from "../root"
import { queryOptions } from "@tanstack/react-query";
import { MapsList } from "./MapsList";
import mapApi from "../../api";

const fetchPortal = async () => {
  const map = await mapApi
    .get(`portals/${window.PORTAL_KEY}/`)

  if (!map) {
    throw new NotFoundError(`Portal not found!`)
  }

  return map
}

const portalOptions = () => queryOptions({
  queryKey: ['portals'],
  queryFn: fetchPortal,
})

export function IndexPage() {
  // const query = useSuspenseQuery(portalOptions())

  return (
    <div className="wrapper">
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
  loader: ({ context: { queryClient }}) => 
    queryClient.ensureQueryData(portalOptions())
})
