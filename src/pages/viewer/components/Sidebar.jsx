import useClientHeight from "../useClientHeight";
import Metadata from "./Metadata";
import TabNav from "./TabNav";
import MediaQuery from "react-responsive";
import { HD_SIZE } from "../../../constants";
import { createPortal } from "react-dom";
import { Button, Icon } from "react-bulma-components";
import { mapStore, selectors, setShowSidebar } from "../mapStore";
import { useStore } from "@tanstack/react-store";

export function DesktopSidebar() {
  const { height, ref } = useClientHeight();
  return (
    <div id="sidebar">
      <Metadata metadataRef={ref} />
      <TabNav top={height} />
    </div>
  );
}

const onClose = () => setShowSidebar(false);

export function MobileSidebar() {
  const { height, ref } = useClientHeight();
  const sidebar = useStore(mapStore, selectors.isSidebarOpen);

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
      <Metadata metadataRef={ref} />
      <TabNav top={height} />
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      <MediaQuery maxWidth={HD_SIZE}>
        {createPortal(
          <MobileSidebar />,
          document.getElementById("sidebar-portal"),
        )}
      </MediaQuery>
      <MediaQuery minWidth={HD_SIZE}>
        <DesktopSidebar />
      </MediaQuery>
    </>
  );
}
