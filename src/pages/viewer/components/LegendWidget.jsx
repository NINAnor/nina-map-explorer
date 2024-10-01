import { Box } from "react-bulma-components";
import SequentialLegend from "./legend-types/Sequential";
import IntervalLegend from "./legend-types/Interval";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";
import ImageLegend from "./legend-types/Image";

function LegendRender({ type, ...data }) {
  switch (type) {
    case "sequential":
      return <SequentialLegend {...data} />;
    case "interval":
      return <IntervalLegend {...data} />;
    case "wms":
      return <ImageLegend {...data} />;
    default:
      null;
  }
}

function MapLegend({ legends }) {
  return legends.map((legend) => {
    return (
      <div key={legend.id || legend.title} className="mb-2">
        <p className="is-size-6">{legend.title}</p>
        <div className="py-1">
          <LegendRender {...legend} />
        </div>
      </div>
    );
  });
}

function LayerLegend({ layers }) {
  return layers.map((layer) => {
    return (
      <div key={layer.id} className="mb-2">
        <p className="is-size-6">{layer.metadata.name}</p>
        <div className="py-1">
          <LegendRender {...layer.metadata.legend} />
        </div>
      </div>
    );
  });
}

export default function LegendWidget() {
  const mapLegends = useStore(mapStore, selectors.getMapLegend);
  const layerLegends = useStore(mapStore, selectors.getVisibleLayersLegends);

  if (!mapLegends && (!layerLegends || !layerLegends.length)) {
    return null;
  }

  return (
    <Box id="legend-box">
      {mapLegends && <MapLegend legends={mapLegends} />}
      {layerLegends && <LayerLegend layers={layerLegends} />}
    </Box>
  );
}
