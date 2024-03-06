import { useContext, useMemo, useState } from "react"
import { MapContext } from "../contexts"
import { Element, Image, Box, Columns } from "react-bulma-components";
import { BACKGROUND_LAYER_ID, BACKGROUND_TILES } from "../../../constants";

function BasemapElement({ metadata, open, active = false, onClick, id, map, source }) {
    const url = useMemo(() => {
        const mapSource = map.getSource(source);
        if (mapSource.tiles) {
            return mapSource.tiles[0]
                .replace("{x}", BACKGROUND_TILES.x)
                .replace("{y}", BACKGROUND_TILES.y)
                .replace("{z}", BACKGROUND_TILES.z);
        }
    }, [id, source]);

    return (
        <Box clickable className="basemap-el" p={1} backgroundColor={active && open ? 'link' : 'white'}>
            <Image size={64} src={url} onClick={onClick} alt={metadata.name} backgroundColor="white"/>
        </Box>
    )
}

function BasemapWidget({ layers, map }) {
    const [open, setOpen] = useState(false);
    const basemaps = useMemo(() => {
        return Object.keys(layers).map(k => layers[k]).filter(v => v && v.metadata && v.metadata.is_basemap)
    }, [layers]);

    const activeLayer = useMemo(() => {
        const ls = basemaps.filter(l => l.isVisible);
        return ls.length ? ls[0] : null;
    }, [basemaps])

    const others = useMemo(() => {
        return basemaps.filter(l => activeLayer ? l.id !== activeLayer.id : true);
    }, [basemaps, activeLayer])

    const setActiveBasemap = (layerId) => {
        map.setLayoutProperty(activeLayer.id, 'visibility', 'none');
        map.moveLayer(BACKGROUND_LAYER_ID, layerId);
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        setOpen(false);
    }

    return (
        <Columns id="basemap" gap={1}>
            <Columns.Column>
                {activeLayer && <BasemapElement open={open} active {...activeLayer} onClick={() => setOpen(!open)} map={map} />}
            </Columns.Column>
            {open && others.map(b => <Columns.Column key={b.id}><BasemapElement {...b} onClick={() => setActiveBasemap(b.id)} map={map} /></Columns.Column>)}
        </Columns>
    )
}

export default function BasemapWidgetWrapper() {
    const { layers, style, map } = useContext(MapContext);

    if (!style || !layers) {
        return null;
    }

    return <BasemapWidget layers={layers} style={style} map={map} />
}
