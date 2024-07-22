import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { MapContext } from "../contexts";

import {
  geocoderApi,
  transformRequest,
  maplibregl,
  setCursorStyle,
  popup,
} from "./maplibre-helpers";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import { mapStore, selectors, setStyle } from "../mapStore";
import { useStore } from "@tanstack/react-store";
import { BACKGROUND_LAYER_ID } from "../../../constants";
import toast from "react-hot-toast";

function handleError(e) {
  console.log(e);
  let text = "There was an error!";

  // TODO: improve error handling
  if (e.error instanceof maplibregl.AJAXError) {
    if (e.error.status === 404) {
      text = "Map not found";
    }
  } else {
    console.error(e.error);
  }

  toast.error(text);
}

function registerFunctions(map, layerId) {
  map.current.on("click", layerId, (e) => popup(e).addTo(map.current));
  map.current.on("mouseenter", layerId, () =>
    setCursorStyle("pointer", map.current),
  );
  map.current.on("mouseleave", layerId, () => setCursorStyle("", map.current));
}

export default function MapContextProvider({ mapSlug, children }) {
  const map = React.useRef(null);
  const mapContainerRef = React.useRef(null);
  const visibleLayers = useStore(mapStore, selectors.getVisibleLayers);
  const config = useStore(mapStore, selectors.getMapConfig);

  useLayoutEffect(() => {
    console.log("called!");
    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `${window.API_URL}maps/${mapSlug}/style/`,
      transformRequest,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(
      new MaplibreGeocoder(geocoderApi, {
        maplibregl: maplibregl,
        placeholder: "Søk",
      }),
      "top-left",
    );

    function listenStyle() {
      let style = map.current.getStyle();
      setStyle(style);
    }

    function loadStyle() {
      const style = map.current.getStyle();

      for (const layer of style.layers) {
        registerFunctions(map, layer.id);
      }
    }

    map.current.once("load", () => {
      // Inject a background
      // this is neeeded in order to avoid strange rendering issues
      // while changing the basemap
      const order = map.current.getLayersOrder();
      if (order[0] !== BACKGROUND_LAYER_ID) {
        map.current.addLayer(
          {
            id: BACKGROUND_LAYER_ID,
            type: "background",
            paint: {
              "background-color": "#fff",
            },
            metadata: {},
          },
          order[0],
        );
      }
    });

    map.current.on("styledata", listenStyle);
    map.current.on("style.load", loadStyle);
    map.current.on("error", handleError);
    return () => {
      map.current.off("styledata", listenStyle);
      map.current.off("styledata", listenStyle);
      map.current.off("error", handleError);
    };
  }, [mapSlug]);

  const updateVisibility = useCallback(
    (layer, isVisible) => {
      if (config.exclusive_layers) {
        for (const lid of visibleLayers) {
          map.current.setLayoutProperty(lid, "visibility", "none");
        }
      }

      if (layer.loaded) {
        map.current.setLayoutProperty(
          layer.id,
          "visibility",
          isVisible ? "none" : "visible",
        );
      } else {
        map.current.addLayer(layer);
        registerFunctions(map, layer.id);
      }
    },
    [visibleLayers, config],
  );

  const flyToLayer = useMemo(() => {
    if (!config.zoom_to_extend) {
      return null;
    }
    return (layer) => {
      if (layer && layer.source) {
        let bounds = map.current.getSource(layer.source).bounds;
        map.current.fitBounds(bounds);
      }
    };
  }, [config]);

  const flyToBounds = useMemo(() => {
    if (!config.zoom_to_extend) {
      return null;
    }
    return (bounds) => {
      map.current.fitBounds(bounds);
    };
  }, [config]);

  const setActiveBasemap = (current, next) => {
    map.current.setLayoutProperty(current, "visibility", "none");
    map.current.setLayoutProperty(next, "visibility", "visible");
  };

  const value = {
    map: map.current,
    mapContainerRef,
    updateVisibility,
    flyToLayer,
    flyToBounds,
    setActiveBasemap,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
