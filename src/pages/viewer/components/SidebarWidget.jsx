import { useCallback, useContext } from "react";
import { Button, Icon } from "react-bulma-components";
import MediaQuery from "react-responsive";
import { HD_SIZE } from "../../../constants";
import { MapContext } from "../contexts";

export default function SidebarWidget() {
  const { setSidebar } = useContext(MapContext);

  const open = useCallback(() => setSidebar(true), [setSidebar]);

  return (
    <MediaQuery maxWidth={HD_SIZE}>
      <div id="sidebar-open">
        <Button onClick={open}>
          <Icon>
            <i className="fas fa-bars"></i>
          </Icon>
        </Button>
      </div>
    </MediaQuery>
  );
}
