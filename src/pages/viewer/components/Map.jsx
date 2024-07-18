import { useContext } from "react";

import { MapContext } from "../contexts";
import LegendWidget from "./LegendWidget";
import BasemapWidget from "./BasemapWidget";
import { Helmet } from "react-helmet";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";

export default function Map() {
  const { mapContainerRef } = useContext(MapContext);
  const mapTitle = useStore(mapStore, selectors.getMapTitle);

  return (
    <div className="map-wrap">
      <div ref={mapContainerRef} className="map" />
      <Helmet title={mapTitle} />
      <LegendWidget />
      <BasemapWidget />
    </div>
  );
}
