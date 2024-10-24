import { useContext, useMemo } from "react";
import { VariableSizeTree as Tree } from "react-vtree";
import { MapContext, ModalContext } from "../contexts";
import LegendSymbol from "./LegendSymbol";
import { Icon } from "react-bulma-components";
import AutoSizer from "react-virtualized-auto-sizer";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HD_SIZE } from "../../../constants";
import { useMediaQuery } from "react-responsive";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";

function useLegendSymbol(layer) {
  const zoom = useStore(mapStore, selectors.getZoom);

  return useMemo(() => {
    try {
      return LegendSymbol(layer, zoom);
    } catch (e) {
      return null;
    }
  }, [layer, zoom]);
}

function useLayer(layerId) {
  const selector = useMemo(() => selectors.getLayer(layerId), [layerId]);
  return useStore(mapStore, selector);
}

function Layer({ data }) {
  const { updateVisibility, flyToLayer } = useContext(MapContext);
  const layer = useLayer(data.id);
  const visibleLayers = useStore(mapStore, selectors.getVisibleLayers);
  const legend = useLegendSymbol(layer);
  const fly = useMemo(() => {
    return flyToLayer ? () => flyToLayer(layer) : null;
  }, [layer, flyToLayer]);
  const isVisible = visibleLayers.includes(data.id);

  const icon = isVisible ? "fas fa-eye" : "fas fa-eye-slash";

  return (
    <>
      <div>
        <a onClick={() => updateVisibility(layer, isVisible)}>
          <Icon>
            <i className={icon}></i>
          </Icon>
        </a>
      </div>
      <div className="legend-wrapper">{legend}</div>
      <div className="node-name">{data.name}</div>
      <ComponentDropdown data={data}>
        {fly && isVisible && layer.source && (
          <MenuItem>
            <a onClick={fly}>
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
  const { flyToBounds } = useContext(MapContext);

  const fly = useMemo(() => {
    return flyToBounds ? () => flyToBounds(data.bbox) : null;
  }, [data.bbox, flyToBounds]);

  return (
    <>
      <a onClick={toggle}>
        <Icon>
          <i className={`fas fa-folder${isOpen ? "-open" : ""}`}></i>
        </Icon>
      </a>
      <div className="node-name">{data.name}</div>
      <ComponentDropdown data={data}>
        {fly && data.bbox && (
          <MenuItem>
            <a onClick={fly}>
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

function ComponentDropdown({ data, children }) {
  const openNodeDescription = useContext(ModalContext);

  if (!children && !data.description && !data.link && !data.download) {
    return null;
  }

  return (
    <Menu>
      <MenuButton className="button is-white is-small">
        <Icon>
          <i aria-hidden="true" className="fas fa-ellipsis-vertical" />
        </Icon>
      </MenuButton>
      <MenuItems anchor="bottom start" className="node-menu">
        {children}
        {data.description && (
          <MenuItem>
            <a onClick={() => openNodeDescription(data)}>
              <Icon>
                <i className="fa fa-info"></i>
              </Icon>
            </a>
          </MenuItem>
        )}
        {data.link && (
          <MenuItem>
            <a href={data.link} target="_blank" rel="noreferrer">
              <Icon>
                <i className="fa fa-info"></i>
              </Icon>
            </a>
          </MenuItem>
        )}
        {data.download && (
          <MenuItem>
            <a href={data.download} download target="_blank" rel="noreferrer">
              <Icon>
                <i className="fa fa-download"></i>
              </Icon>
            </a>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
}

function Child({ data, isOpen, style, setOpen }) {
  let Component = Group;
  if (data.isLeaf) {
    Component = Layer;
  }

  return (
    <div style={style} className="row">
      <div
        className="row-wrapper"
        style={{ marginLeft: `${data.nestingLevel * 0.4}rem` }}
      >
        <Component
          data={data}
          isOpen={isOpen}
          toggle={() => setOpen(!isOpen)}
        />
      </div>
    </div>
  );
}

const getNodeData = (node, nestingLevel, isSmallScreen) => ({
  data: {
    ...node,
    defaultHeight: isSmallScreen
      ? 30
      : (Math.round(node.name.length / 80) + 1) * 30,
    id: node.id.toString(), // mandatory
    isLeaf: !node.children,
    isOpenByDefault: node.is_open, // mandatory
    name: node.name,
    nestingLevel,
  },
  nestingLevel,
  node,
});

export default function Layers() {
  const isSmallScreen = useMediaQuery({ maxWidth: HD_SIZE });

  const layers = useStore(mapStore, selectors.getTree);

  const tw = useMemo(() => {
    function* treeWalker() {
      for (let layer of layers) {
        yield getNodeData(layer, 0, isSmallScreen);
      }

      while (true) {
        // Step [2]: Get the parent component back. It will be the object
        // the `getNodeData` function constructed, so you can read any data from it.
        const parent = yield;

        if (parent.node.children) {
          for (let i = 0; i < parent.node.children.length; i++) {
            // Step [3]: Yielding all the children of the provided component. Then we
            // will return for the step [2] with the first children.
            yield getNodeData(
              parent.node.children[i],
              parent.nestingLevel + 1,
              isSmallScreen,
            );
          }
        }
      }
    }

    return treeWalker;
  }, [layers, isSmallScreen]);

  if (!layers || !layers.length) {
    return null;
  }

  return (
    <div className="layers">
      <AutoSizer>
        {({ width, height }) => (
          <Tree treeWalker={tw} height={height} width={width}>
            {Child}
          </Tree>
        )}
      </AutoSizer>
    </div>
  );
}
