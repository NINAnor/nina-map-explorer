import React from "react";
import { MapContext } from "../contexts";
import maplibregl from "maplibre-gl";
import find from "lodash/find";

function getLayer(layerId, style) {
  const layer = find(style.layers, (l) => l.id === layerId);
  if (layer) {
    layer.isVisible =
      layer && layer.layout && layer.layout.visibility === "none"
        ? false
        : true;
  }
  return layer;
}

function popup(e) {
  let properties = e.features[0].properties;
  let html =
    "<table class='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'><tbody>" +
    Object.keys(properties)
      .map(
        (key) => `<tr><td><b>${key}</b></td><td>${properties[key]}</td></tr>`,
      )
      .reduce((a, b) => a + b) +
    "</tbody></table>";
  return new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html);
}

function setCursorStyle(style, map) {
  map.getCanvas().style.cursor = style;
}

export default function MapContextProvider({ children }) {
  const map = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [layers, setLayers] = React.useState({});
  const [style, setStyle] = React.useState(null);
  const [lazy, setLazy] = React.useState({ styles: {}, layers: {} });
  const [basemaps, setBasemaps] = React.useState({
    active: null,
    layers: [],
  });
  const [visibleLayers, setVisibleLayers] = React.useState([]);

  const setMap = (m) => {
    map.current = m;
    setReady(true);
  };

  React.useEffect(() => {
    function listenStyle() {
      const layers = {};
      let active = null;
      const basemaps = [];
      const visible = [];
      const style = map.current.getStyle();
      for (const lid of map.current.getLayersOrder()) {
        const layer = getLayer(lid, style);
        layers[lid] = layer;
        if (layer.metadata && layer.metadata.is_basemap) {
          if (!active && layer.isVisible) {
            active = layer;
          }
          basemaps.push(layer);
        } else {
          if (layer.isVisible) {
            visible.push(layer.id);
          }
        }
      }
      setBasemaps({
        active,
        layers: basemaps,
      });
      setVisibleLayers(visible);
      setLayers(layers);
      setStyle(style);
    }

    function loadStyle() {
      const style = map.current.getStyle();
      document.title = style.name;
      setStyle(style);

      for (const layer of style.layers) {
        map.current.on("click", layer.id, (e) => popup(e).addTo(map.current));
        map.current.on("mouseenter", layer.id, () =>
          setCursorStyle("pointer", map.current),
        );
        map.current.on("mouseleave", layer.id, () =>
          setCursorStyle("", map.current),
        );
      }
    }

    if (ready) {
      map.current.on("styledata", listenStyle);
      map.current.on("style.load", loadStyle);
      return () => {
        map.current.off("style.load", loadStyle);
        map.current.off("styledata", listenStyle);
      };
    }
  }, [ready]);

  const value = {
    map: map.current,
    setMap,
    ready,
    layers,
    style,
    lazy,
    setLazy,
    metadata: style ? style.metadata : null,
    config:
      style && style.metadata && style.metadata.config
        ? style.metadata.config
        : {},
    basemaps,
    visibleLayers,
    setVisibleLayers,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
