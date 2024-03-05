import { useContext, useMemo } from "react"
import { MapContext } from "../contexts"
import { Box } from "react-bulma-components";
import SequentialLegend from "./legend-types/Sequential";


function LegendRender({ type, ...data }) {
    switch(type) {
        case 'sequential': return <SequentialLegend {...data} />;
        default: null;
    }
}

function getMapLegend(legends) {
    return legends.map(legend => {
        return (
            <div key={legend.id || legend.title} className="mb-2">
                <p className="is-size-6">{legend.title}</p>
                <div className="py-1">
                    <LegendRender {...legend} />
                </div>
            </div>
        )
    });
}

function getLayerLegend(layers) {
    return Object.entries(layers).filter(([key, value]) => {
        if (value && value.layout && value.layout.visibility === 'none') {
            return false;
        }
        if (!value.metadata || !value.metadata.legend) {
            return false;
        }

        return true;
    }).map(([key, value]) => {
        return (
            <div key={key} className="mb-2">
                <p className="is-size-6">{value.metadata.name}</p>
                <div className="py-1">
                    <LegendRender {...value.metadata.legend} />
                </div>
            </div>
        )
    });
}

function LegendWidget({ layers, style }) {
    const config = useMemo(() => style && style.metadata && style.metadata.legend && style.metadata.legend.config ? style.metadata.legend.config : {
        layerLegend: true,
    }, [style]);
    const legend = useMemo(() => config.layerLegend ? getLayerLegend(layers) : null, [layers, config]);
    const mapLegend = useMemo(() => style && style.metadata && style.metadata.legend && style.metadata.legend.data ? getMapLegend(style.metadata.legend.data) : null, [style]);

    if ((!legend || !legend.length) && (!mapLegend || !mapLegend.length)) {
        return null;
    }

    return (
        <Box id="legend-box">
            {mapLegend}
            {legend}
        </Box>
    )
}

export default function LegendWidgetWrapper() {
    const { layers, style } = useContext(MapContext);

    if (!style) {
        return null;
    }

    return <LegendWidget layers={layers} style={style} />
}
