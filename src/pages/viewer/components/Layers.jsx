import { useContext, useMemo, useState } from "react";
import { Tree } from 'react-arborist';
import { MapContext, ModalContext } from "../contexts";
import LegendSymbol from "./LegendSymbol";
import { Button } from "react-bulma-components";

function flyToLayer(map, layer) {
  if (map && layer && layer.source) {
    let bounds = map.getSource(layer.source).bounds;
    map.fitBounds(bounds);
    map.zoomOut();
  }
}

function Layer({ node }) {
  const { map, layers, lazy, config, visibleLayers } = useContext(MapContext);
  const layer = layers[node.data.id];

  const icon = layer && layer.isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';

  const updateVisibility = () => {
    if (config && config.exclusive_layers) {
      for (const lid of visibleLayers) {
        map.setLayoutProperty(lid, 'visibility', 'none');
      }
    }

    if (layer) {  
      map.setLayoutProperty(node.data.id, 'visibility', layer.isVisible ? 'none' : 'visible');
    } else {
      map.addLayer(lazy.layers[node.data.id]);
    }
  }

  const legend = useMemo(() => {
    try {
      if (layer) {
        return LegendSymbol(layer, map);
      } else if (lazy.layers && lazy.layers[node.data.id]) {
        return LegendSymbol(lazy.layers[node.data.id], map)
      }
      return null;
    } catch(e) {
      return null;
    }
  }, [layer, lazy])

  return (
    <>
      <div onClick={updateVisibility} style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <i className={icon}></i>
        <div style={{ width: '17px', height: '17px', margin: '0 0.5rem' }}>{legend}</div>
        <div>{node.data.name}</div>
      </div>  
      {config && config.zoom_to_extend && map && layer && layer.isVisible && layer.source && (
        <div>
          <Button size="small" text onClick={() => flyToLayer(map, layer)}><i className="fas fa-expand"></i></Button>
        </div>
      )}
    </>
  );
}

function Group({ node }) {
  return (
    <div onClick={() => node.toggle()} style={{ flexGrow: 1 }}><i className={`fas fa-folder${node.isOpen ? '-open' : '' }`}></i> {node.data.name}</div>
  );
}

function Child({ node, dragHandle, style }) {
  const openNodeDescription = useContext(ModalContext);

  let Component = Group
  if (node.isLeaf) {
    Component = Layer
  }

  return (
    <div style={style} ref={dragHandle}>
      <div style={{ display: 'flex' }}>
        <Component node={node} />
        <div style={{ display: 'flex' }}>
          {node.data.description && (<Button size="small" text onClick={() => openNodeDescription(node.data)}><i className="fas fa-info"></i></Button>)}
          {node.data.link && (<Button size="small" renderAs="a" text href={node.data.link} target="_blank"><i className="fas fa-info"></i></Button>)}
          {node.data.download && (<Button size="small" text renderAs="a" href={node.data.download} download><i className="fas fa-download"></i></Button>)}
        </div>
      </div>
    </div>
  );
}

const options = {
  box: "border-box"
}

const ROW_HEIGHT = 30;
const SIDEBAR_WIDTH = 400 - 16; // 400 - 8px padding per side

function useTreeVisibleNodesCount() {
  const [count, setCount] = useState(0)
  const ref = (api) => {
    if (api) setCount(api.visibleNodes.length)
  }
  return { ref, count }
}

export default function Layers({ layers = [] }) {
  const { count, ref } = useTreeVisibleNodesCount();

  return (
    <div className="layers">
      <Tree
        initialData={layers}
        disableEdit
        disableDrag
        disableDrop
        disableMultiSelection
        openByDefault
        height={count * ROW_HEIGHT}
        indent={10}
        rowHeight={ROW_HEIGHT}
        width={SIDEBAR_WIDTH}
        overscanCount={1}
        ref={ref}
      >
        {Child}
      </Tree>
    </div>
  )
}