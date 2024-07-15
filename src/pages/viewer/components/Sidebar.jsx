import { useCallback, useContext } from "react";
import { MapContext } from "../contexts";
import useClientHeight from "../useClientHeight";
import Metadata from "./Metadata";
import TabNav from "./TabNav";
import MediaQuery from "react-responsive";
import { HD_SIZE } from "../../../constants";
import { createPortal } from "react-dom";
import { Button, Icon } from "react-bulma-components";

export function DesktopSidebar({ data }) {
  const { height, ref } = useClientHeight();
  const { sidebar } = useContext(MapContext);
  return (
    <div id="sidebar" className={!sidebar ? "" : ""}>
      <Metadata {...data.data} metadataRef={ref} />
      <TabNav map={data} top={height} />
    </div>
  );
}

export function MobileSidebar({ data }) {
  const { height, ref } = useClientHeight();
  const { sidebar, setSidebar } = useContext(MapContext);

  const onClose = useCallback(() => setSidebar(false), [setSidebar]);

  if (!sidebar) {
    return null;
  }

  return (
    <div id="sidebar-mobile">
      <div id="sidebar-close">
        <Button onClick={onClose}>
          <Icon>
            <i className="fas fa-times"></i>
          </Icon>
        </Button>
      </div>
      <Metadata {...data.data} metadataRef={ref} />
      <TabNav map={data} top={height} />
    </div>
  );
}

export default function Sidebar({ data }) {
  return (
    <>
      <MediaQuery maxWidth={HD_SIZE}>
        {createPortal(
          <MobileSidebar data={data} />,
          document.getElementById("sidebar-portal"),
        )}
      </MediaQuery>
      <MediaQuery minWidth={HD_SIZE}>
        <DesktopSidebar data={data} />
      </MediaQuery>
    </>
  );
}
