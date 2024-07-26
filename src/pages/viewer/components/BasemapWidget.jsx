import { useContext, useEffect, useState } from "react";
import { MapContext } from "../contexts";
import { Image, Box, Element } from "react-bulma-components";
import { BACKGROUND_TILES } from "../../../constants";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";

function BasemapElement({ metadata, active = false, onClick, map, source }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    function getSource() {
      const mapSource = map.getSource(source);
      if (mapSource.tiles) {
        setUrl(
          mapSource.tiles[0]
            .replace("{x}", BACKGROUND_TILES.x)
            .replace("{y}", BACKGROUND_TILES.y)
            .replace("{z}", BACKGROUND_TILES.z),
        );
      }
    }
    getSource();
    map.on("sourcedata", getSource);
    return () => map.off("sourcedata", getSource);
  }, [map, source]);

  return (
    <Box
      clickable
      className="basemap-el"
      mr={1}
      p={1}
      backgroundColor={active ? "link" : "white"}
    >
      <Image
        size={64}
        src={url}
        onClick={onClick}
        alt={metadata.name}
        backgroundColor="white"
      />
    </Box>
  );
}

export default function BasemapWidget() {
  const { map, setActiveBasemap } = useContext(MapContext);
  const basemaps = useStore(mapStore, selectors.getBasemaps);
  const active = useStore(mapStore, selectors.getActiveBasemap);

  return (
    <div id="basemap">
      <Element display="flex">
        {basemaps.map((b) => (
          <BasemapElement
            key={b.id}
            active={active?.id === b.id}
            {...b}
            onClick={() => setActiveBasemap(active?.id, b.id)}
            map={map}
          />
        ))}
      </Element>
    </div>
  );
}
