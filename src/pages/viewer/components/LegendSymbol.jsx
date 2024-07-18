import Symbol from "@watergis/legend-symbol";
import { createElement } from "react";

// Based on: https://github.com/watergis/maplibre-gl-legend/blob/main/packages/maplibre-gl-legend/src/lib/index.ts#L124

const formatStringToCamelCase = (str) => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

const getStyleObjectFromString = (str) => {
  const style = {};
  str.split(";").forEach((el) => {
    const [property, value] = el.split(":");
    if (!property) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};

// Transforms xml attributes in React compatible attributes (dash to camelCase, className)
function transformAttributes(attributes) {
  const copy = {};
  Object.keys(attributes).forEach((k) => {
    copy[k.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())] =
      attributes[k];
  });

  if (copy.class) {
    copy.className = copy.class;
    delete copy.class;
  }

  if (copy.style && typeof copy.style == "string") {
    copy.style = getStyleObjectFromString(copy.style);
  }

  return copy;
}

function toComponent(json) {
  return json
    ? createElement(
        json.element,
        transformAttributes(json.attributes),
        ...(json.children ? json.children.map((c) => toComponent(c)) : []),
      )
    : null;
}

function LegendSymbol(layer, zoom) {
  let symbol = null;
  try {
    symbol = toComponent(
      Symbol({
        sprite: layer?.sprite,
        zoom,
        layer: layer,
      }),
      [layer],
    );
  } catch (e) {
    console.error("Error while creating legend symbol", e, layer);
  }

  // fallback for raster images
  if (!symbol) {
    return <i className="fas fa-image"></i>;
  }

  return symbol;
}

export default LegendSymbol;
