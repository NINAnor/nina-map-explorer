import React from "react";
import MapContext from "../map";
import find from 'lodash/find';
import maplibregl from 'maplibre-gl';

function getLayer(layerId, style) {
  const layer = find(style.layers, ({ id }) => id === layerId)
  if (layer) {
    layer.isVisible = layer.layout && layer.layout.visibility === 'none' ? false : true;
  }
  return layer;
}

function popup(e) {
  let properties = e.features[0].properties;
  let html =
    "<table>" +
    Object.keys(properties)
      .map((key) => `<tr><td>${key}</td><td>${properties[key]}</td></tr>`)
      .reduce((a, b) => a + b) +
    "</table>";
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

  const setMap = (m) => {
    map.current = m
    setReady(true);
  }

  React.useEffect(() => {
    function listenStyle() {
      const style = map.current.getStyle();
      setLayers(map.current.getLayersOrder().reduce((p, c) => ({
        ...p,
        [c]: getLayer(c, style),
      }), {}));
      setStyle(style);
    }

    function loadStyle() {
      const style = map.current.getStyle();
      document.title = style.name;
      setStyle(style);

      for (const layer of style.layers) {
        map.current.on("click", layer.id, (e) => popup(e).addTo(map.current));
        map.current.on("mouseenter", layer.id, () => setCursorStyle("pointer", map.current));
        map.current.on("mouseleave", layer.id, () => setCursorStyle("", map.current));
      }
    }
    
    if (ready) {
      map.current.on('styledata', listenStyle);
      map.current.on('style.load', loadStyle);
      return () => {
        map.current.off('style.load', loadStyle);
        map.current.off('styledata', listenStyle);
      }
    }
  }, [ready])

  const value = {
    map: map.current,
    setMap,
    ready,
    layers,
    style,
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}

