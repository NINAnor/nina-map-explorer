import { useContext, useEffect, useState } from "react"
import { MapContext } from "../contexts"
import { Image, Box, Columns } from "react-bulma-components";
import { BACKGROUND_LAYER_ID, BACKGROUND_TILES } from "../../../constants";

function BasemapElement({ metadata, open, active = false, onClick, id, map, source }) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        function getSource() {
            const mapSource = map.getSource(source);
            if (mapSource.tiles) {
                setUrl(mapSource.tiles[0]
                    .replace("{x}", BACKGROUND_TILES.x)
                    .replace("{y}", BACKGROUND_TILES.y)
                    .replace("{z}", BACKGROUND_TILES.z)
                )
            }
        }
        getSource();
        map.on('sourcedata', getSource);
        return () => map.off('sourcedata', getSource);
    }, [map, source])

    return (
        <Box clickable className="basemap-el" p={1} backgroundColor={active && open ? 'link' : 'white'}>
            <Image size={64} src={url} onClick={onClick} alt={metadata.name} backgroundColor="white"/>
        </Box>
    )
}

function BasemapWidget({ map, active, others }) {
    const [open, setOpen] = useState(false);

    const setActiveBasemap = (layerId) => {
        map.setLayoutProperty(active.id, 'visibility', 'none');
        map.moveLayer(BACKGROUND_LAYER_ID, layerId);
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        setOpen(false);
    }

    return (
        <Columns id="basemap" gap={1}>
            <Columns.Column>
                {active && <BasemapElement open={open} active {...active} onClick={() => setOpen(!open)} map={map} />}
            </Columns.Column>
            {open && others.map(b => <Columns.Column key={b.id}><BasemapElement {...b} onClick={() => setActiveBasemap(b.id)} map={map} /></Columns.Column>)}
        </Columns>
    )
}

export default function BasemapWidgetWrapper() {
    const { basemaps, map } = useContext(MapContext);
    if (!basemaps || !basemaps.active) {
        return null;
    }
    return <BasemapWidget map={map} {...basemaps} />
}
