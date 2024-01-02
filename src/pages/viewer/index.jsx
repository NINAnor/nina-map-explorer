import { ErrorComponent, Route } from "@tanstack/react-router";
import rootRoute from "../root";
import Layers from "./components/Layers";
import Map from "./components/Map";
import MapContextProvider from "./components/MapContextProvider";
import Metadata from "./components/Metadata";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import mapApi from "../../api";
import { NotFoundError } from "../../lib/utils";

const fetchMap = async (mapSlug) => {
  const map = await mapApi
    .get(`maps/${mapSlug}/metadata/`)

  if (!map) {
    throw new NotFoundError(`Map not found!`)
  }

  return map
}


const mapQueryOptions = (mapSlug) =>
  queryOptions({
    queryKey: ['maps', { mapSlug }],
    queryFn: () => fetchMap(mapSlug),
  })


export const viewerRoute = new Route({
  component: Viewer,
  path: 'dataset/$mapSlug',
  getParentRoute: () => rootRoute,
  errorComponent: MapErrorComponent,
  loader: ({ context: { queryClient }, params: { mapSlug } }) =>
    queryClient.ensureQueryData(mapQueryOptions(mapSlug)),
})


function MapErrorComponent({ error }) {
  if (error instanceof NotFoundError) {
    return <div>{error.message}</div>
  }

  return <ErrorComponent error={error} />
}


export function Viewer() {
  const { mapSlug } = viewerRoute.useParams();
  const mapQuery = useSuspenseQuery(mapQueryOptions(mapSlug));
  const map = mapQuery.data;

  return (
    <MapContextProvider>
      <div id="app-wrap" style={{ display: 'flex' }}>
        <div id="sidebar">
          <Metadata {...map.data} />
          <Layers layers={map.data.layers} />
        </div>
        <Map {...map.data} />
      </div>
    </MapContextProvider>
  );
}
