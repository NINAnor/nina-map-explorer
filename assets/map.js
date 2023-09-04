let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const geocoderApi = {
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

const map = new maplibregl.Map({
  container: "map",
});
map.addControl(
  new MaplibreGeocoder(geocoderApi, {
    "maplibregl": maplibregl,
    "placeholder": "Søk",
  }),
  "top-left",
);

map.addControl(new maplibregl.NavigationControl());

function popup(e) {
  let properties = e.features[0].properties;
  let html =
    "<table>" +
    Object.keys(properties)
      .map((key) => `<tr><td>${key}</td><td>${properties[key]}</td></tr>`)
      .reduce((a, b) => a + b) +
    "</table>";
  new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
}

function setCursorStyle(style) {
  map.getCanvas().style.cursor = style;
}

map.on("style.load", () => {
  let name = map.getStyle().name;
  document.title = name;
  document.querySelectorAll(".style-name").forEach((e) => (e.innerText = name));

  let layers = map.getStyle().layers;
  let targets = new Map(
    layers.slice(2).map((layer) => [layer.id, layer.source]),
  );
  map.addControl(
    new MaplibreLegendControl.MaplibreLegendControl(targets, {
      title: "Tegnforklaring",
      showDefault: true,
      showCheckbox: true,
      onlyRendered: false,
      reverseOrder: false,
    }),
    "bottom-left",
  );
  for (const layer of layers) {
    console.log(layer.id);
    map.on("click", layer.id, popup);
    map.on("mouseenter", layer.id, () => setCursorStyle("pointer"));
    map.on("mouseleave", layer.id, () => setCursorStyle(""));
  }
});

let dataset = location.hash.slice(1);
let base = "datasets/" + dataset + "/";

fetch(base + "metadata.json")
  .then((response) => response.json())
  .then((metadata) => {
    map.setStyle(base + metadata.style);
    document
      .querySelectorAll(".metadata-source")
      .forEach((e) => (e.href = base + metadata.source));
    document
      .querySelectorAll(".metadata-subtitle")
      .forEach((e) => (e.innerHTML = metadata.subtitle || ""));
    document
      .querySelectorAll(".metadata-description")
      .forEach((e) => (e.innerHTML = metadata.description || ""));
  });
