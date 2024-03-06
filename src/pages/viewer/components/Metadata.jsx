import { Content, Element, Heading, Image, Media, Panel } from "react-bulma-components";
import logoFallback from '../../../assets/logosmall.png';
import { useContext, useMemo } from "react";
import { MapContext } from "../contexts";

function Vertical({ title, subtitle, logo, config = {} }) {
  return (
    <Element>
      <Image
        src={logo || logoFallback}
        fullwidth
      />
      <Element display="flex" flexDirection="column" alignItems="center">
        <Heading size={4} className="has-text-primary">{title}</Heading>
        {subtitle && <Heading size={6} subtitle>{subtitle}</Heading>}
      </Element>
    </Element>
  )
}

function Horizontal({title, subtitle, logo, config = {}}) {
  return (
    <Media className="pt-5">
      <Media.Item align="left">
        <Image
          src={logo || logoFallback}
          size={64}
        />
      </Media.Item>
      <Media.Item align="center">
        <Heading size={4} className="has-text-primary">{title}</Heading>
        {subtitle && <Heading size={6} subtitle>{subtitle}</Heading>}
      </Media.Item>
    </Media>
  )
}

export default function Metadata({ metadataRef }) {
  const { config = {}, metadata } = useContext(MapContext);

  const layout = useMemo(() => {
    if (config.logoLayout === 'vertical') {
      return <Vertical {...metadata} />
    }

    return <Horizontal {...metadata} />
  }, [config, metadata]);

  return (
    <div ref={metadataRef} className="metadata">
      {layout}
    </div>
  )
}