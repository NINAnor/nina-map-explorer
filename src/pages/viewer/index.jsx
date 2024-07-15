import { ErrorComponent, Route } from "@tanstack/react-router";
import rootRoute from "../root";
import Map from "./components/Map";
import MapContextProvider from "./components/MapContextProvider";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import mapApi from "../../api";
import { Element } from "react-bulma-components";
import { Helmet } from "react-helmet";
import ModalContextProvider from "./components/ModalContextProvider";
import Lazy from "./components/Lazy";
import ErrorWrapper from "../../components/ErrorWrapper";
import Footer from "../../components/Footer";
import SidebarWidget from "./components/SidebarWidget";
import Sidebar from "./components/Sidebar";

const fetchMap = async (mapSlug) => {
  const map = await mapApi.get(`maps/${mapSlug}/metadata/`);
  return map;
};

const mapQueryOptions = (mapSlug) =>
  queryOptions({
    queryKey: ["maps", { mapSlug }],
    queryFn: () => fetchMap(mapSlug),
  });

export const viewerRoute = new Route({
  component: Viewer,
  path: "datasets/$mapSlug",
  getParentRoute: () => rootRoute,
  errorComponent: MapErrorComponent,
  loader: ({ context: { queryClient }, params: { mapSlug } }) =>
    queryClient.ensureQueryData(mapQueryOptions(mapSlug)),
});

function MapErrorComponent({ error }) {
  if (error.response) {
    if (error.response.status == 404) {
      return <ErrorWrapper>The map does not exists</ErrorWrapper>;
    }
    if (error.response.data) {
      return <ErrorWrapper>{error.response.data}</ErrorWrapper>;
    }
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  }

  return <ErrorComponent error={error} />;
}

export function Viewer() {
  const { mapSlug } = viewerRoute.useParams();
  const mapQuery = useSuspenseQuery(mapQueryOptions(mapSlug));
  const mapData = mapQuery.data;

  return (
    <MapContextProvider>
      <ModalContextProvider>
        <Helmet title={mapData.data.title} />
        <div id="app-wrap" style={{ display: "flex" }}>
          <Sidebar data={mapData} />
          <Element id="content">
            <Map {...mapData.data} />
            <SidebarWidget />
            <Footer />
          </Element>
        </div>
        <Lazy lazy={mapData.data.lazy} />
      </ModalContextProvider>
    </MapContextProvider>
  );
}
