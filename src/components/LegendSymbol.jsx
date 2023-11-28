import Symbol from '@watergis/legend-symbol';
import { createElement } from 'react';

// Based on: https://github.com/watergis/maplibre-gl-legend/blob/main/packages/maplibre-gl-legend/src/lib/index.ts#L124

// Transforms xml attributes in React compatible attributes (dash to camelCase, className)
function transformAttributes(attributes) {
  const copy = {}
  Object.keys(attributes).forEach(k => {
    copy[k.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())] = attributes[k];
  })

  if (copy.class) {
    copy.className = copy.class;
    delete copy.class;
  }

  return copy;
}

function toComponent(json) {
  return json ? createElement(json.element, transformAttributes(json.attributes), ...(json.children ? json.children.map(c => toComponent(c)) : [])) : null;
}

function LegendSymbol(layer, map) {
  let symbol = toComponent(Symbol({
    sprite: layer.sprite,
    zoom: map.getZoom(),
    layer: layer,
  }), [layer]);

  // fallback for raster images
  if (!symbol) {
    return <i className='fas fa-image'></i>
  }

  return symbol;
}

export default LegendSymbol;
