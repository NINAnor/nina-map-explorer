import { Content, Heading, Image, Media, Panel } from "react-bulma-components";
import logoFallback from '../../../assets/logosmall.png';

export default function Metadata({ title, subtitle, logo, metadataRef }) {
  return (
    <div ref={metadataRef} className="metadata">
      <Media className="pt-5">
        <Media.Item align="left">
          <Image
            src={logo || logoFallback}
            size={64}
          />
        </Media.Item>
        <Media.Item align="center">
          <Heading size={4} className="has-text-primary">{title}</Heading>
          <Heading size={6} subtitle>{subtitle}</Heading>
        </Media.Item>
      </Media>
    </div>
  )
}