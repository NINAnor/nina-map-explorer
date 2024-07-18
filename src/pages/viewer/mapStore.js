import { Store } from "@tanstack/store";

export const mapStore = new Store({
  style: null,
  showSidebar: true,
  layers: {},
  visibleLayerIds: [],
});

export const setStyle = (style) => {
  const layers = {};
  const visibleLayerIds = [];

  for (let l of style.layers) {
    layers[l.id] = {
      ...l,
      // this means that the layer is actually loaded!
      loaded: true,
    };

    if (!l.layout || l.layout?.visibility !== "none") {
      visibleLayerIds.push(l.id);
    }
  }

  mapStore.setState((state) => {
    return {
      ...state,
      style,
      layers,
      visibleLayerIds,
    };
  });
};

export const setShowSidebar = (showSidebar) => {
  mapStore.setState((state) => ({
    ...state,
    showSidebar,
  }));
};

function isStyleReady(state) {
  return !!state.style;
}

export const selectors = {
  getMapZoom: (state) => state.style?.zoom,
  getMapTitle: (state) => state.style?.metadata?.title,
  getMapDescription: (state) => state.style?.metadata?.description,
  getTree: (state) => state.style?.metadata?.catalogue?.tree,
  isStyleReady,
  isSidebarOpen: (state) => state.showSidebar,
  getMetadata: (state) => ({
    title: state.style?.metadata?.title,
    logo: state.style?.metadata?.logo,
    subtitle: state.style?.metadata?.subtitle,
    logoLayout: state.style?.metadata?.config?.logoLayout,
  }),
  getLayer: (layerId) => (state) => {
    // merge together the loaded and the catalogue
    const merged = {
      ...(state.style?.metadata?.catalogue.layers || {}),
      ...state.layers,
    };
    return merged[layerId];
  },
  getVisibleLayers: (state) => state.visibleLayerIds,
  getMapConfig: (state) => state.style?.metadata?.config || {},
  getMapLegend: (state) => state.style?.metadata?.legends,
  getVisibleLayersLegends: (state) => {
    const legends = [];
    for (let lid of state.visibleLayerIds) {
      const layer = state.layers[lid];
      if (layer.metadata?.legend) {
        legends.push(layer);
      }
    }
    return legends;
  },
  getBasemaps: (state) => {
    return state.style?.layers?.filter((l) => l.metadata.is_basemap) || [];
  },
  getActiveBasemap: (state) =>
    state.style?.layers
      ?.filter((l) => l.metadata.is_basemap)
      .filter((l) => state.visibleLayerIds.includes(l.id))
      .pop() || null,
};
