import { Element } from "react-bulma-components";
import logo from "../assets/logowhite.png";

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
        <Element className="has-text-white is-size-7" ml={2}>
          Norsk institutt for naturforskning - www.nina.no
        </Element>
      </Element>
      <Element className="has-text-white is-size-7" ml="auto">
        Samarbeid og kunnskap for framtidas miljøløsninger
      </Element>
    </Element>
  );
}
