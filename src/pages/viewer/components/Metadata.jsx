import { Element, Heading, Image, Media } from "react-bulma-components";
import logoFallback from "../../../assets/logosmall.png";
import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import { mapStore, selectors } from "../mapStore";

function Vertical({ subtitle, logo }) {
  return (
    <Element>
      <Image src={logo || logoFallback} fullwidth />
      <Element display="flex" flexDirection="column" alignItems="center">
        {subtitle && (
          <Heading size={4} className="has-text-primary">
            {subtitle}
          </Heading>
        )}
      </Element>
    </Element>
  );
}

function Horizontal({ title, subtitle, logo }) {
  return (
    <Media className="pt-5">
      <Media.Item align="left">
        <Image src={logo || logoFallback} size={64} />
      </Media.Item>
      <Media.Item align="center">
        <Heading size={4} className="has-text-primary">
          {title}
        </Heading>
        {subtitle && (
          <Heading size={6} subtitle>
            {subtitle}
          </Heading>
        )}
      </Media.Item>
    </Media>
  );
}

export default function Metadata({ metadataRef }) {
  const metadata = useStore(mapStore, selectors.getMetadata);

  const layout = useMemo(() => {
    if (metadata.logoLayout === "vertical") {
      return <Vertical {...metadata} />;
    }

    return <Horizontal {...metadata} />;
  }, [metadata]);

  return (
    <div ref={metadataRef} className="metadata">
      {layout}
    </div>
  );
}
