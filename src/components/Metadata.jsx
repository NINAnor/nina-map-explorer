import { useContext } from "react";
import useMetadata from "../hooks/useMetadata";
import MapContext from "../contexts/map";


export default function Metadata() {
  const { style } = useContext(MapContext);
  const { data, isLoading } = useMetadata();

  if (isLoading || !data) {
    return null;
  }

  return (
    <div>
      <h3 style={{ marginTop: '0'}}>{style ? style.name : ''}</h3>
      <p>{data.subtitle}</p>
      <details>
        <summary>Beskrivelse</summary>
        <div style={{ marginLeft: '0.5rem'}} dangerouslySetInnerHTML={{ __html: data.description }} />
      </details>
    </div>
  )
}