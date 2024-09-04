import { useMemo, useState } from "react";
import useClientHeight from "../useClientHeight";
import { Content, Tabs } from "react-bulma-components";
import Layers from "./LayersVTree";
import parse from "html-react-parser";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";

function Description() {
  const description = useStore(mapStore, selectors.getMapDescription);

  return (
    <div className="description">
      <Content px={2}>{parse(description)}</Content>
    </div>
  );
}

const TABS = {
  kartlag: {
    label: "Kartlag",
    render: () => <Layers />,
  },
  beskrivelse: {
    label: "Beskrivelse",
    render: () => <Description />,
  },
};

export default function TabNav({ top = 0 }) {
  const [active, setActive] = useState("kartlag");
  const { height, ref } = useClientHeight();

  const render = useMemo(() => TABS[active].render(), [active]);

  return (
    <>
      <Tabs fullwidth domRef={ref}>
        {Object.keys(TABS).map((k) => (
          <Tabs.Tab active={k === active} key={k} onClick={() => setActive(k)}>
            {TABS[k].label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <div
        className="max-wrapper"
        style={{ height: `calc(100vh - ${height + top}px)` }}
      >
        {render}
      </div>
    </>
  );
}
