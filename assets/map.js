let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
});
map.addControl(new maplibregl.NavigationControl());

map.on("style.load", () => {
  let name = map.getStyle().name;
  document.title = name;
  document.querySelectorAll(".style-name").forEach((e) => (e.innerText = name));

  let layers = map.getStyle().layers;
  let colorRules = layers[layers.length - 1].paint;
  if (!colorRules) return;
  let color = colorRules["fill-color"] || colorRules["circle-color"];
  if (!color) return;
  let html = "<table>";
  for (let i = 2; i < color.length - 1; i += 2) {
    html += `<tr><td class="block" style="background-color: ${
      color[i + 1]
    }"></td><td>${color[i]}</td></tr>`;
  }
  html += `<tr><td class="block" style="background-color: ${
    color[color.length - 1]
  }"></td><td><i>others</i></td></tr>`;
  html += "</table>";
  document.querySelectorAll(".legend").forEach((e) => (e.innerHTML = html));
});

map.on("click", "data-layer", (e) => {
  let properties = e.features[0].properties;
  let html =
    "<table>" +
    Object.keys(properties)
      .map((key) => `<tr><td>${key}</td><td>${properties[key]}</td></tr>`)
      .reduce((a, b) => a + b) +
    "</table>";
  new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
});
map.on("mouseenter", "data-layer", () => {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "data-layer", () => {
  map.getCanvas().style.cursor = "";
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
      .querySelectorAll(".metadata-description")
      .forEach((e) => (e.innerHTML = metadata.description));
  });
