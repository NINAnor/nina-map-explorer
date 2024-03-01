import { useContext, useMemo } from "react"
import { MapContext } from "../contexts"
import { Box, Heading } from "react-bulma-components";
import SequentialLegend from "./legend-types/Sequential";


function LegendRender({ type, ...data }) {
    switch(type) {
        case 'sequential': return <SequentialLegend {...data} />;
        default: null;
    }
}

export default function LegendWidget() {
    const { layers } = useContext(MapContext);

    const legend = useMemo(() => {
        return Object.entries(layers).filter(([key, value]) => {
            if (value && value.layout && value.layout.visibility === 'none') {
                return false;
            }
            return true;
        }).map(([key, value]) => {
            if (!value.metadata.legend) {
                return null;
            }
            return (
                <div key={key} className="mb-2">
                    <p className="is-size-6">{value.metadata.name}</p>
                    <div className="py-1">
                        <LegendRender {...value.metadata.legend} />
                    </div>
                </div>
            )

        }).filter(_ => _);
    }, [layers]);

    if (!legend || !legend.length) {
        return null;
    }

    return (
        <Box id="legend-box">
            <Heading renderAs="h6" size={5} weight="bold">Legend</Heading>
            {legend}
        </Box>
    )
}