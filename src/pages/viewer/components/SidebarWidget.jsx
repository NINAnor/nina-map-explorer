import { Button, Icon } from "react-bulma-components";
import MediaQuery from "react-responsive";
import { HD_SIZE } from "../../../constants";
import { setShowSidebar } from "../mapStore";

const open = () => setShowSidebar(true);

export default function SidebarWidget() {
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
