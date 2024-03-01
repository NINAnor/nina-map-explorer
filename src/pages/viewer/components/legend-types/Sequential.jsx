import { Columns, Media } from "react-bulma-components";

const { Column } = Columns;

export default function SequentialLegend({ background, min_label, max_label, vertical = false }) {
    if (!vertical) {
        return (
            <Columns className="sequential-legend-horizontal mt-1" flexDirection="column">
                <Column className="bar">
                    <div style={{ background, height: 20, width: '100%' }}></div>
                </Column>
                <Column>
                    <Columns className="descriptors" alignContent="space-between" gap={4}>
                        <Column className="is-size-7">{max_label}</Column>
                        <Column className="is-size-7">{min_label}</Column>
                    </Columns>                         
                </Column>        
            </Columns>
        )
    } else {
        return (
            <Columns className="sequential-legend-vertical">
                <Column size="one-quarter" className="bar">
                    <div style={{ background, height: '100%', width: '100%' }}></div>
                </Column>
                <Column>
                    <Columns className="descriptors" flexDirection="column" alignContent="space-between" gap={4}>
                        <Column className="is-size-7">{max_label}</Column>
                        <Column className="is-size-7">{min_label}</Column>
                    </Columns>                         
                </Column>        
            </Columns>
        )
    }
}