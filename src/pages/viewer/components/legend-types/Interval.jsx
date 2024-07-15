import { Columns } from "react-bulma-components";

const { Column } = Columns;

export default function IntervalLegend({ intervals }) {
  return intervals.map(({ background, description }) => (
    <Columns className="interval-legend-entry" key={background}>
      <Column size="one-quarter" className="bar">
        <div style={{ background, height: "100%", width: "100%" }}></div>
      </Column>
      <Column className="is-size-7">{description}</Column>
    </Columns>
  ));
}
