import { useContext, useMemo } from "react";
import useMetadata from "../../../hooks/useMetadata";
import { Tree } from 'react-arborist';
import MapContext from "../map";
import LegendSymbol from "./LegendSymbol";

function Layer({ node, style, dragHandle }) {
  const { map, layers } = useContext(MapContext);
  const layer = layers[node.data.id];

  const icon = layer && layer.isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';

  const updateVisibility = () => {
    map.setLayoutProperty(node.data.id, 'visibility', layer.isVisible ? 'none' : 'visible');
  }

  const legend = useMemo(() => {
    return layer ? LegendSymbol(layer, map) : null;
  })

  return (
    <div style={style} ref={dragHandle}>
      <div style={{ display: 'flex' }}>
        <div onClick={updateVisibility} style={{ flexGrow: 1, display: 'flex' }}>
          <i className={icon}></i>
          <div style={{ width: '17px', margin: '0 0.5rem' }}>{legend}</div>
          <div>{node.data.name}</div>
        </div>
        {node.data.download && (<div><a href={node.data.download} download><i className="fas fa-download"></i></a></div>)}
      </div>
    </div>
  );
}

function Group({ node, style, dragHandle }) {
  return (
    <div style={style} ref={dragHandle}>
      <div style={{ display: 'flex' }}>
        <div onClick={() => node.toggle()} style={{ flexGrow: 1 }}><i className={`fas fa-folder${node.isOpen ? '-open' : '' }`}></i> {node.data.name}</div>
        {node.data.download && (<div><a href={node.data.download} download><i className="fas fa-download"></i></a></div>)}
      </div>
    </div>
  );
}

function Child({ node, ...other }) {
  let Component = Group
  if (node.isLeaf) {
    Component = Layer
  }

  return <Component node={node} {...other} />
}


export default function Layers({ layers = [] }) {
  return (
    <div>
      <h5>Kartlag</h5>
      <Tree
        initialData={layers}
        disableEdit
        disableDrag
        disableDrop
        disableMultiSelection
        openByDefault
        width={400}
        height={window.innerHeight * 0.7}
        indent={10}
        rowHeight={30}
        overscanCount={1}
      >
        {Child}
      </Tree>
    </div>
  )
}