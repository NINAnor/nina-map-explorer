import { Element } from "react-bulma-components";
import logo from "../assets/logowhite.png";
import MediaQuery from "react-responsive";
import { DESKTOP_SIZE, TABLET_SIZE } from "../constants";

export default function Footer() {
  return (
    <Element
      id="footer"
      backgroundColor="primary"
      px={5}
      display="flex"
      alignItems="baseline"
      py={1}
      justifyContent="center"
    >
      <Element
        className="has-text-white"
        href="https://www.nina.no"
        renderAs="a"
        display="flex"
        alignItems="baseline"
      >
        <img src={logo} alt="nina logo" className="logo" />
        <MediaQuery minWidth={TABLET_SIZE}>
          <Element className="has-text-white is-size-7" ml={2}>
            Norsk institutt for naturforskning - www.nina.no
          </Element>
        </MediaQuery>
      </Element>
      <MediaQuery minWidth={DESKTOP_SIZE}>
        <Element className="has-text-white is-size-7" ml="auto">
          Samarbeid og kunnskap for framtidas miljøløsninger
        </Element>
      </MediaQuery>
    </Element>
  );
}
