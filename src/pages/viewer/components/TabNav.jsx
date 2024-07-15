import { useMemo, useState } from "react";
import useClientHeight from "../useClientHeight";
import { Content, Tabs } from "react-bulma-components";
import Layers from "./LayersVTree";
import parse from "html-react-parser";

const TABS = {
  kartlag: {
    label: "Kartlag",
    render: (map) => <Layers layers={map.data.layers} />,
  },
  beskrivelse: {
    label: "Beskrivelse",
    render: (map) => <Content px={2}>{parse(map.data.description)}</Content>,
  },
};

export default function TabNav({ map, top = 0 }) {
  const [active, setActive] = useState("kartlag");

  const { height, ref } = useClientHeight();

  const render = useMemo(() => TABS[active].render(map), [active, map]);

  return (
    <>
      <Tabs fullwidth mt={3} domRef={ref}>
        {Object.keys(TABS).map((k) => (
          <Tabs.Tab active={k === active} key={k} onClick={() => setActive(k)}>
            {TABS[k].label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <div style={{ height: `calc(100vh - ${height + top}px)` }}>{render}</div>
    </>
  );
}
