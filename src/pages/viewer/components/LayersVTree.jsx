import { useContext, useMemo } from "react";
import {VariableSizeTree as Tree} from 'react-vtree';
import { MapContext, ModalContext } from "../contexts";
import LegendSymbol from "./LegendSymbol";
import { Icon } from "react-bulma-components";
import AutoSizer from 'react-virtualized-auto-sizer';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function flyToLayer(map, layer) {
  if (map && layer && layer.source) {
    let bounds = map.getSource(layer.source).bounds;
    map.fitBounds(bounds);
  }
}

function Layer({ data }) {
  const { map, layers, lazy, config, visibleLayers } = useContext(MapContext);
  const layer = layers[data.id];

  const icon = layer && layer.isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';

  const updateVisibility = () => {
    if (config && config.exclusive_layers) {
      for (const lid of visibleLayers) {
        map.setLayoutProperty(lid, 'visibility', 'none');
      }
    }

    if (layer) {  
      map.setLayoutProperty(data.id, 'visibility', layer.isVisible ? 'none' : 'visible');
    } else {
      map.addLayer(lazy.layers[data.id]);
    }
  }

  const legend = useMemo(() => {
    try {
      if (layer) {
        return LegendSymbol(layer, map);
      } else if (lazy.layers && lazy.layers[data.id]) {
        return LegendSymbol(lazy.layers[data.id], map)
      }
      return null;
    } catch(e) {
      return null;
    }
  }, [layer, lazy])

  return (
    <>
      <div>
        <a onClick={updateVisibility}>
          <Icon >
            <i className={icon}></i>
          </Icon>
        </a>
      </div>
      <div className="legend-wrapper">{legend}</div>
      <div className="node-name">{data.name}</div>
      <ComponentDropdown data={data}>
        {config && config.zoom_to_extend && map && layer && layer.isVisible && layer.source && (
        <MenuItem>
          <a onClick={() => flyToLayer(map, layer)}>
            <Icon>
              <i className="fas fa-expand"></i>
            </Icon>
          </a>
        </MenuItem>
      )}
      </ComponentDropdown>
    </>
  );
}

function Group({ data, isOpen, toggle }) {
  return (
    <>
      <a onClick={toggle}>
        <Icon>
          <i className={`fas fa-folder${isOpen ? '-open' : '' }`}></i>
        </Icon>
      </a>
      <div className="node-name">{data.name}</div>
      <ComponentDropdown data={data} />
    </>
  );
}

function ComponentDropdown({ data, children }) {
  const openNodeDescription = useContext(ModalContext);

  if (!children && !data.description && !data.link && !data.download) {
    return null
  }

  return (
    <Menu>
      <MenuButton className="button is-white is-small">
        <Icon><i aria-hidden="true" className="fas fa-ellipsis-vertical"/></Icon>
      </MenuButton>
      <MenuItems anchor="bottom start" className="node-menu">
        {children}
        {data.description && (<MenuItem>
          <a onClick={() => openNodeDescription(data)}><Icon><i className="fa fa-info"></i></Icon></a>
        </MenuItem>)}
        {data.link && (<MenuItem>
          <a href={data.link} target="_blank" rel="noreferrer"><Icon><i className="fa fa-info"></i></Icon></a>
        </MenuItem>)}
        {data.download && (<MenuItem>
          <a href={data.download} download target="_blank" rel="noreferrer"><Icon><i className="fa fa-download"></i></Icon></a>
        </MenuItem>)}
      </MenuItems>
    </Menu>
  )
}

function Child({ data, isOpen, style, setOpen }) {
  let Component = Group
  if (data.isLeaf) {
    Component = Layer
  }

  return (
    <div style={style} className="row">
      <div className="row-wrapper" style={{ marginLeft: `${data.nestingLevel * 0.4}rem` }}>
        <Component data={data} isOpen={isOpen} toggle={() => setOpen(!isOpen)} />
      </div>
    </div>
  );
}

const getNodeData = (node, nestingLevel) => ({
  data: {
    ...node,
    defaultHeight: (Math.round(node.name.length / 80) + 1) * 30,
    // defaultHeight: 60,
    id: node.id.toString(), // mandatory
    isLeaf: node.children ? node.children.length === 0 : true,
    isOpenByDefault: true, // mandatory
    name: node.name,
    nestingLevel,
  },
  nestingLevel,
  node,
});

export default function Layers({ layers = [] }) {

  const tw = useMemo(() => {
    function* treeWalker() {    
      for (let layer of layers) {
        yield getNodeData(layer, 0);
      }
    
      while (true) {
        // Step [2]: Get the parent component back. It will be the object
        // the `getNodeData` function constructed, so you can read any data from it.
        const parent = yield;

        if (parent.node.children) {
          for (let i = 0; i < parent.node.children.length; i++) {
            // Step [3]: Yielding all the children of the provided component. Then we
            // will return for the step [2] with the first children.
            yield getNodeData(parent.node.children[i], parent.nestingLevel + 1);
          }
        }
      }
    }

    return treeWalker;
  }, [layers])

  return (
    <div className="layers">
      <AutoSizer>
        {({ width, height }) => (
          <Tree
            treeWalker={tw}
            height={height}
            width={width}
          >
            {Child}
          </Tree>
        )}
      </AutoSizer>
    </div>
  )
}