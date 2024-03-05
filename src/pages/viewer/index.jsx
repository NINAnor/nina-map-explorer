import { ErrorComponent, Route } from "@tanstack/react-router";
import parse from 'html-react-parser';
import rootRoute from "../root";
import Layers from "./components/Layers";
import Map from "./components/Map";
import MapContextProvider from "./components/MapContextProvider";
import Metadata from "./components/Metadata";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import mapApi from "../../api";
import { NotFoundError } from "../../lib/utils";
import { Content, Tabs } from "react-bulma-components";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import ModalContextProvider from "./components/ModalContextProvider";
import Lazy from "./components/Lazy";
import ErrorWrapper from "../../components/ErrorWrapper";

const fetchMap = async (mapSlug) => {
  const map = await mapApi
    .get(`maps/${mapSlug}/metadata/`);
  return map
}


const mapQueryOptions = (mapSlug) =>
  queryOptions({
    queryKey: ['maps', { mapSlug }],
    queryFn: () => fetchMap(mapSlug),
  })


export const viewerRoute = new Route({
  component: Viewer,
  path: 'datasets/$mapSlug',
  getParentRoute: () => rootRoute,
  errorComponent: MapErrorComponent,
  loader: ({ context: { queryClient }, params: { mapSlug } }) =>
    queryClient.ensureQueryData(mapQueryOptions(mapSlug)),
})

function MapErrorComponent({ error }) {
  if (error.response) {
    if (error.response.status == 404) {
      return <ErrorWrapper>The map does not exists</ErrorWrapper>
    }
    if (error.response.data) {
      return <ErrorWrapper>{error.response.data}</ErrorWrapper>
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

  return <ErrorComponent error={error} />
}


const TABS = {
  kartlag: {
    label: 'Kartlag',
    render: (map) => <Layers layers={map.data.layers} />,
  },
  beskrivelse: {
    label: 'Beskrivelse',
    render: (map) => (
    <Content px={2}>
      {parse(map.data.description)}
    </Content>
    )
  }
}

function TabNav({ map }) {
  const [active, setActive] = useState('kartlag');

  const render = useMemo(() => TABS[active].render(map), [active, map]);

  return (
    <>
      <Tabs fullwidth mt={3}>
        {Object.keys(TABS).map(k => (
          <Tabs.Tab active={k === active} key={k} onClick={() => setActive(k)}>
            {TABS[k].label}
          </Tabs.Tab>
        ))}
      </Tabs>
      {render}
    </>
  )
}

export function Viewer() { 
  const { mapSlug } = viewerRoute.useParams();
  const mapQuery = useSuspenseQuery(mapQueryOptions(mapSlug));
  const map = mapQuery.data;

  return (
    <MapContextProvider>
      <ModalContextProvider>
        <Helmet 
          title={map.data.title}
        />
        <div id="app-wrap" style={{ display: 'flex' }}>
          <div id="sidebar">
            <Metadata {...map.data} />
            <TabNav map={map} />
          </div>
          <Map {...map.data} />
          <Lazy lazy={map.data.lazy} />
        </div>
      </ModalContextProvider>
    </MapContextProvider>
  );
}
