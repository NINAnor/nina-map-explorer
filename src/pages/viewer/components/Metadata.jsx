import { Content, Heading, Image, Media, Panel } from "react-bulma-components";
import logo from '../../../assets/logosmall.png';

export default function Metadata({ title, subtitle, description, metadataRef }) {
  return (
    <div ref={metadataRef} className="metadata">
      <Media className="pt-2">
        <Media.Item align="left">
          <Image
            src={logo}
            size={64}
          />
        </Media.Item>
        <Media.Item align="center">
          <Heading size={4}>{title}</Heading>
          <Heading size={6} subtitle>{subtitle}</Heading>
        </Media.Item>
      </Media>
    </div>
  )
}