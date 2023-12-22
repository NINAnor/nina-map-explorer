import { useContext } from "react";
import useMetadata from "../../../hooks/useMetadata";
import MapContext from "../map";


export default function Metadata({ title, subtitle, description }) {
  return (
    <div>
      <h3 style={{ marginTop: '0'}}>{title}</h3>
      <p>{subtitle}</p>
      <details>
        <summary>Beskrivelse</summary>
        <div style={{ marginLeft: '0.5rem'}} dangerouslySetInnerHTML={{ __html: description }} />
      </details>
    </div>
  )
}