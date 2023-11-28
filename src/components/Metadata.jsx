import { useContext, useState } from "react";
import useMetadata from "../hooks/useMetadata";
import MapContext from "../contexts/map";


export default function Metadata() {
  const [open, setOpen] = useState(false);
  const { style } = useContext(MapContext);
  const { data, isLoading } = useMetadata();

  if (isLoading || !data) {
    return null;
  }

  return (
    <div style={{ marginLeft: '0.5rem' }}>
      <h3>{style ? style.name : ''}</h3>
      <p>{data.subtitle}</p>
      <div onClick={() => setOpen(!open)}><i className={`fas fa-caret-${open ? 'down' : 'right'}`}></i> Beskrivelse</div>
      {open ? <div style={{ marginLeft: '0.5rem'}} dangerouslySetInnerHTML={{ __html: data.description }} /> : null}
    </div>
  )
}