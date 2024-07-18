import { default as mlgl } from "maplibre-gl";

import * as pmtiles from "pmtiles";
import { ProtocolV3 } from "@ninanor/maplibre-gl-cog";

let protocol = new pmtiles.Protocol();
let cogProtocol = new ProtocolV3();
mlgl.addProtocol("pmtiles", protocol.tile);
mlgl.addProtocol("cog", cogProtocol.tile);

// This is necessary to load map styles of protected resources
export const transformRequest =
  window.TRANSFORM_REQUEST ||
  ((url, resourceType) => {
    if (resourceType === "Style" && url.startsWith(window.API_URL)) {
      return {
        url: url,
        credentials: "include",
      };
    }
  });

export const geocoderApi = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson`;
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        features.push({
          type: "Feature",
          geometry: feature.geometry,
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
        });
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      features,
    };
  },
};

export const maplibregl = mlgl;

export function popup(e) {
  let properties = e.features[0].properties;
  let html =
    "<div style='max-height:250px;overflow-y:auto;'><table class='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'><tbody>" +
    Object.keys(properties)
      .map(
        (key) => `<tr><td><b>${key}</b></td><td>${properties[key]}</td></tr>`,
      )
      .reduce((a, b) => a + b) +
    "</tbody></table></div>";
  return new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html);
}

export function setCursorStyle(style, map) {
  map.getCanvas().style.cursor = style;
}
